import { mapTechStackFromRepos, mapUser } from "@/core/models/mappers";
import type { RepoOfUser } from "@/core/models/user";
import { batch, logger, metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import type { RepoSummary, UserProfile } from "../services/github-scrapper";
import type { getRepoDetailsTask } from "./get-repo-details-task";
import type { getTopReposTask } from "./get-top-repos-task";
import type { getUserInfoTask } from "./get-user-info-task";
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
		await metadata.set("username", username);

		const { userInfo, topRepos } = await getUserInfoWithTopRepos();
		const repos = await getUserReposDetails(topRepos);
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

		await metadata.set("progress", "saving_to_database");
		await insertUserToDbTask.trigger(userRecord);

		// Final progress update
		await metadata.set("progress", "completed");

		return {
			username,
			status: "completed",
			message: "GitHub profile generated successfully",
		};

		async function extractMetadata() {
			await metadata.set("progress", "generating_user_metadata");

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
				typeof getUserInfoTask | typeof getTopReposTask
			>([
				{
					id: "get-user-info",
					payload: {
						username,
					},
				},
				{
					id: "get-top-repos",
					payload: { username },
				},
			]);

			// Update task progress status
			await metadata.set("progress", "initial_data_collected");

			let userInfo: UserProfile | null = null;
			let topRepos: RepoSummary[] | null = null;

			for (const result of results.runs) {
				if (result.ok) {
					if (result.taskIdentifier === "get-user-info") {
						userInfo = result.output;
					} else if (result.taskIdentifier === "get-top-repos") {
						topRepos = result.output;
					}
				}
			}

			if (userInfo === null) {
				throw new Error("User info not found");
			}

			return {
				userInfo,
				topRepos,
			};
		}

		async function getUserReposDetails(topRepos: RepoSummary[] | null) {
			const repos: RepoOfUser[] = [];

			if (!topRepos) {
				return repos;
			}

			await metadata.set("progress", "fetching_repo_details");
			const repoDetails = await batch.triggerAndWait<typeof getRepoDetailsTask>(
				topRepos.map((repo) => ({
					id: "get-repo-details",
					payload: {
						fullName: repo.fullName,
						defaultBranch: repo.defaultBranch,
					},
				})),
			);

			for (const result of repoDetails.runs) {
				if (result.ok) {
					const data = result.output;
					if (result.taskIdentifier === "get-repo-details") {
						const repo = topRepos.find(
							(r) => r.fullName === result.output.fullName,
						);
						if (repo) {
							repos.push({
								fullName: repo.fullName,
								description: data.description,
								stars: repo.stars,
								techStack: data.techStack,
							});
						}
					}
				}
			}
			return repos;
		}
	},
});
