import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { GithubService } from "../services/github-scrapper";

export const getUserInfoTask = schemaTask({
	id: "get-user-info",
	schema: z.object({
		username: z.string().describe("The username of the user to get info for"),
	}),
	maxDuration: 60,
	run: async ({ username }) => {
		const githubService = new GithubService();

		const userInfo = await githubService.getUserInfo(username);

		return userInfo;
	},
});
