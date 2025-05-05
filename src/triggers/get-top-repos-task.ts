import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { GithubService } from "../services/github-scrapper";

export const getContributedReposInLastMonthTask = schemaTask({
	id: "get-contributed-repos-in-last-month",
	schema: z.object({
		username: z
			.string()
			.describe("The username of the user to get top repos for"),
	}),
	maxDuration: 60,
	run: async ({ username }) => {
		return await new GithubService().getContributedReposInLastMonth(username);
	},
});
