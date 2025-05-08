import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { RepoAnalyzer } from "@/services/repo-analyzer";
import { GithubService } from "../services/github-scrapper";

export const getRepoDetailsTask = schemaTask({
	id: "get-repo-details",
	schema: z.object({
		fullName: z
			.string()
			.describe("The full name of the repo to get details for"),
		defaultBranch: z.string().describe("The default branch of the repo"),
		userId: z
			.string()
			.optional()
			.describe("The clerk user ID to use their GitHub token"),
	}),
	run: async ({ fullName, defaultBranch, userId }) => {
		const githubService = new GithubService(userId);
		const repoAnalyzer = new RepoAnalyzer();

		const fileTree = await githubService.getRepoFileTree(fullName);
		const { techStack, description } = await repoAnalyzer.analyze(
			fullName,
			defaultBranch,
			fileTree,
		);

		return {
			fullName,
			techStack,
			description,
		};
	},
});
