import {
	mapReposOfUser,
	mapTechStackFromRepos,
	mapUser,
} from "@/core/models/mappers";
import type { RepoOfUser } from "@/core/models/user";
import { type User, clerkClient } from "@clerk/nextjs/server";
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
import { insertUserToDbTask } from "./insert-user-to-db-task";

export const pupulateAuthenticatedGithubUserTask = schemaTask({
	id: "pupulate-authenticated-github-user",
	schema: z.object({
		username: z.string(),
		userId: z.string().optional(),
	}),
	run: async ({ username, userId }) => {
		logger.info(`Starting GitHub profile generation for ${username}`);

		const clerk = await clerkClient();

		let clerkUser: User | null = null;

		if (userId) {
			clerkUser = await clerk.users.getUser(userId);
		}

		// Add metadata for tracking this task
		metadata.set("username", username);

		const { userInfo, reposSummaries } = await getUserInfoWithTopRepos();
		const repos = await getReposOfUser(reposSummaries, username);
		const userMetadata = await extractMetadata();
		const techStackSet = mapTechStackFromRepos(repos);
		logger.info(`Stack: ${Array.from(techStackSet)}`);
		const pinnedRepos = await getPinnedRepos();

		const userRecord = mapUser(
			username,
			userInfo,
			repos,
			userMetadata,
			techStackSet,
			pinnedRepos,
		);

		metadata.set("progress", "saving_to_database");
		const result = await insertUserToDbTask.triggerAndWait(userRecord);
		if (!result.ok) {
			throw new Error("Failed to save into database");
		}

		// Final progress update
		metadata.set("progress", "completed");

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
			const repos: RepoOfUser[] = [];

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

			return mapReposOfUser(repoSummaries, repoDetails, repoContributions);
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
