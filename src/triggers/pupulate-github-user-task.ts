import {
	mapReposOfUser,
	mapTechStackFromRepos,
	mapUser,
} from "@/core/models/mappers";
import type { RepoOfUser } from "@/core/models/user";
import { batch, logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import type {
	RepoContribution,
	RepoSummary,
	UserProfile,
} from "../services/github-scrapper";
import { getRepoContributionsTask } from "./get-repo-contributions-task";
import { getRepoDetailsTask } from "./get-repo-details-task";
import { getContributedReposInLastMonthTask } from "./get-top-repos-task";
import { getUserInfoTask } from "./get-user-info-task";
import { getUserMetadata } from "./get-user-metadata";
import { insertUserToDbTask } from "./insert-user-to-db-task";

export const pupulateGithubUserTask = schemaTask({
	id: "pupulate-github-user",
	schema: z.object({
		username: z.string(),
	}),
	run: async ({ username }) => {
		// Log the start of profile generation
		logger.info(`Starting GitHub profile generation for ${username}`);

		// Add metadata for tracking this task
		metadata.set("username", username);

		const { userInfo, reposSummaries } = await getUserInfoWithTopRepos();
		const repos = await getReposOfUser(reposSummaries, username);
		const userMetadata = await extractMetadata();
		const techStackSet = mapTechStackFromRepos(repos);
		logger.info(`Stack: ${Array.from(techStackSet)}`);

		const userRecord = mapUser(
			username,
			userInfo,
			repos,
			userMetadata,
			techStackSet,
		);

		metadata.set("progress", "saving_to_database");
		insertUserToDbTask.trigger(userRecord);

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
					},
				},
				{
					id: getContributedReposInLastMonthTask.id,
					payload: { username },
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

			await metadata.set("progress", "fetching_repo_details");
			const { runs } = await batch.triggerAndWait<
				typeof getRepoDetailsTask | typeof getRepoContributionsTask
			>([
				{
					id: getRepoContributionsTask.id,
					payload: {
						username: username,
						reposFullNames: repoSummaries.map((repo) => repo.fullName),
					},
				},
				...repoSummaries.map((repo) => ({
					id: getRepoDetailsTask.id,
					payload: {
						fullName: repo.fullName,
						defaultBranch: repo.defaultBranch,
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

				if (run.id === getRepoDetailsTask.id) {
					const data = run.output as {
						fullName: string;
						techStack: string[];
						description: string;
					};
					repoDetails.set(data.fullName, data);
					continue;
				}

				if (run.id === getRepoContributionsTask.id) {
					repoContributions = run.output as Map<string, RepoContribution>;
				}
			}

			return mapReposOfUser(repoSummaries, repoDetails, repoContributions);
		}
	},
});
