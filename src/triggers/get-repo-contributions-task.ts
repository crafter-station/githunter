import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import {
	GithubService,
	type RepoContribution,
} from "../services/github-scrapper";

export const getRepoContributionsTask = schemaTask({
	id: "get-repo-contributions-task",
	schema: z.object({
		reposFullNames: z.array(z.string()),
		username: z.string(),
		userId: z.string().optional(),
	}),
	run: async ({ reposFullNames, username, userId }) => {
		const githubService = new GithubService(userId);

		const contributions = new Map<string, RepoContribution>();
		for (const fullName of reposFullNames) {
			const contribution = await githubService.getRepoContributionsInLastMonth(
				fullName,
				username,
			);
			contributions.set(fullName, contribution);
		}

		return contributions;
	},
});
