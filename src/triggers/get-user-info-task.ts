import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { GithubService } from "../services/github-scrapper";

export const getUserInfoTask = schemaTask({
	id: "get-user-info",
	schema: z.object({
		username: z.string().describe("The username of the user to get info for"),
		userId: z
			.string()
			.optional()
			.describe("The clerk user ID to use their GitHub token"),
	}),
	maxDuration: 60,
	run: async ({ username, userId }) => {
		const githubService = new GithubService(userId);

		const userInfo = await githubService.getUserInfo(username);

		return userInfo;
	},
});
