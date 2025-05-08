import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { GithubService } from "../services/github-scrapper";

export const getContributedReposInLastMonthTask = schemaTask({
	id: "get-contributed-repos-in-last-month",
	schema: z.object({
		username: z
			.string()
			.describe("The username of the user to get top repos for"),
		userId: z
			.string()
			.optional()
			.describe("The clerk user ID to use their GitHub token"),
	}),
	maxDuration: 60,
	run: async ({ username, userId }) => {
		return await new GithubService(userId).getContributedReposInLastMonth(
			username,
		);
	},
});
