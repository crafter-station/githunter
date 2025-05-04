import type { Repo } from "@/db/schema";
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
		const repos: Repo[] = [];

		if (topRepos) {
			// Update task progress status
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
		}

		// Update task progress status
		await metadata.set("progress", "generating_user_metadata");

		const metadata_result = await getUserMetadata.triggerAndWait({
			username,
			repos,
		});

		if (!metadata_result.ok) {
			throw new Error("Failed to get user metadata");
		}

		const techStackSet = new Set<string>();

		for (const repo of repos) {
			for (const tech of repo.techStack) {
				techStackSet.add(tech);
			}
		}

		const stack = Array.from(techStackSet);
		logger.info(`Stack: ${stack}`);

		// Update task progress status
		await metadata.set("progress", "saving_to_database");

		await insertUserToDbTask.trigger({
			username,
			fullname: userInfo.name ?? "",
			avatarUrl: userInfo.avatarUrl,

			stars: repos.reduce((acc, repo) => acc + repo.stars, 0),
			followers: userInfo.followers,
			following: userInfo.following,
			repositories: userInfo.publicRepos,
			contributions: userInfo.contributionCount,

			country: userInfo.country ?? undefined,
			city: userInfo.city ?? undefined,

			website: userInfo.websiteUrl ?? undefined,
			twitter: userInfo.twitterUsername ?? undefined,
			linkedin: userInfo.linkedinUrl ?? undefined,

			about: metadata_result.output.about,

			stack,
			potentialRoles: metadata_result.output.roles,

			repos,
		});

		// Final progress update
		await metadata.set("progress", "completed");

		return {
			username,
			status: "completed",
			message: "GitHub profile generated successfully",
		};
	},
});
