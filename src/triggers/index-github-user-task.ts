import { batch, logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import type {
	RepoContribution,
	RepoSummary,
	UserProfile,
} from "../services/github-scrapper";
import { getPinnedReposTask } from "./get-pinned-repos-task";
import { getRepoContributionsTask } from "./get-repo-contributions-task";
import { getRepoDetailsTask } from "./get-repo-details-task";
import { getContributedReposInLastMonthTask } from "./get-top-repos-task";
import { getUserInfoTask } from "./get-user-info-task";
import { getUserMetadata } from "./get-user-metadata";
import { ingestUserToVectorDb } from "./ingest-user-vector-db";
import { insertUserToDbTask } from "./insert-user-to-db-task";

import type { RecentRepo, UserInsert } from "@/db/schema";

import { mapRecentRepos, mapTechStack } from "@/lib/mappers";
import { nanoid } from "@/lib/nanoid";

export const indexGithubUserTask = schemaTask({
	id: "index-github-user",
	schema: z.object({
		username: z.string(),
		userId: z.string().optional(),
	}),
	run: async ({ username, userId }) => {
		logger.info(`Starting GitHub profile generation for ${username}`);

		// Add metadata for tracking this task
		metadata.set("username", username);

		const { userInfo, reposSummaries } = await getUserInfoWithTopRepos();
		const repos = await getReposOfUser(reposSummaries, username);
		const userMetadata = await extractMetadata();
		const pinnedRepos = await getPinnedRepos();

		const userRecord: UserInsert = {
			id: nanoid(),
			clerkId: userId,
			username,
			fullname: userInfo.name ?? "",
			avatarUrl: userInfo.avatarUrl,
			stars: userInfo.starsCount,
			followers: userInfo.followers,
			following: userInfo.following,
			repositories: userInfo.publicRepos,
			contributions: userInfo.contributionCount,
			country: userInfo.country ?? null,
			city: userInfo.city ?? null,
			website: userInfo.websiteUrl ?? null,
			twitter: userInfo.twitterUsername ?? null,
			linkedin: userInfo.linkedinUrl ?? null,
			about: userMetadata.about,
			stack: Array.from(mapTechStack(repos)),
			potentialRoles: userMetadata.roles,
			repos,
			pinnedRepos: Array.from(pinnedRepos),
			curriculumVitae: null,
		};
		metadata.set("progress", "saving_to_database");
		const result = await insertUserToDbTask.triggerAndWait(userRecord);
		if (!result.ok) {
			throw new Error("Failed to save into database");
		}

		const user = result.output;

		await ingestUserToVectorDb.triggerAndWait({
			id: user.id,
			username: user.username,
			fullname: user.fullname,
			avatarUrl: user.avatarUrl,
			country: user.country,
		});

		return {
			username,
			status: "completed",
			message: "GitHub profile generated successfully",
		};

		async function extractMetadata() {
			metadata.set("progress", "generating_user_metadata");

			const metadataResult = await getUserMetadata.triggerAndWait({
				username,
				repos,
			});

			if (!metadataResult.ok) {
				throw new Error("Failed to get user metadata");
			}

			return metadataResult.output;
		}

		async function getUserInfoWithTopRepos() {
			const results = await batch.triggerAndWait<
				typeof getUserInfoTask | typeof getContributedReposInLastMonthTask
			>([
				{
					id: getUserInfoTask.id,
					payload: {
						username,
						userId,
					},
				},
				{
					id: getContributedReposInLastMonthTask.id,
					payload: { username, userId },
				},
			]);

			// Update task progress status
			metadata.set("progress", "initial_data_collected");

			let userInfo: UserProfile | null = null;
			let reposSummaries: RepoSummary[] | null = null;

			for (const result of results.runs) {
				if (result.ok) {
					if (result.taskIdentifier === getUserInfoTask.id) {
						userInfo = result.output;
					} else if (
						result.taskIdentifier === getContributedReposInLastMonthTask.id
					) {
						reposSummaries = result.output;
					}
				}
			}

			if (userInfo === null) {
				throw new Error("User info not found");
			}

			return {
				userInfo,
				reposSummaries,
			};
		}

		async function getReposOfUser(
			repoSummaries: RepoSummary[] | null,
			username: string,
		) {
			const repos: RecentRepo[] = [];

			if (!repoSummaries) {
				return repos;
			}

			metadata.set("progress", "fetching_repo_details");
			const { runs } = await batch.triggerAndWait<
				typeof getRepoDetailsTask | typeof getRepoContributionsTask
			>([
				{
					id: getRepoContributionsTask.id,
					payload: {
						username: username,
						reposFullNames: repoSummaries.map((repo) => repo.fullName),
						userId,
					},
				},
				...repoSummaries.map((repo) => ({
					id: getRepoDetailsTask.id,
					payload: {
						fullName: repo.fullName,
						defaultBranch: repo.defaultBranch,
						userId,
					},
				})),
			]);

			let repoContributions = new Map<string, RepoContribution>();
			const repoDetails = new Map<
				string,
				{ fullName: string; techStack: string[]; description: string }
			>();

			for (const run of runs) {
				if (!run.ok) {
					continue;
				}

				if (run.taskIdentifier === getRepoDetailsTask.id) {
					const data = run.output as {
						fullName: string;
						techStack: string[];
						description: string;
					};
					repoDetails.set(data.fullName, data);
					continue;
				}

				if (run.taskIdentifier === getRepoContributionsTask.id) {
					repoContributions = run.output as Map<string, RepoContribution>;
				}
			}

			logger.info(`repoContributions: ${[...repoContributions.entries()]}`);
			logger.info(`repoDetails: ${[...repoDetails.entries()]}`);

			return mapRecentRepos(repoSummaries, repoDetails, repoContributions);
		}

		async function getPinnedRepos() {
			metadata.set("progress", "extracting_pinned_repos");

			const result = await getPinnedReposTask.triggerAndWait({
				username,
			});

			if (!result.ok) {
				throw new Error("Failed to get pinned repos");
			}

			return result.output;
		}
	},
});
