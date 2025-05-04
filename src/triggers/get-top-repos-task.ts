import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { GithubService } from "../services/github-scrapper";

export const getTopReposTask = schemaTask({
	id: "get-top-repos",
	schema: z.object({
		username: z
			.string()
			.describe("The username of the user to get top repos for"),
	}),
	maxDuration: 60,
	run: async ({ username }) => {
		const githubService = new GithubService();

		const topRepos = await githubService.getTopReposIncludingOrgs(username, 20);

		return topRepos;
	},
});
