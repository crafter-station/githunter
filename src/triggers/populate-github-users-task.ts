import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { populateGithubUser } from "../core/services/populate-github-user.service";

export const populateGithubUsersTaks = schemaTask({
	id: "populate-github-users",
	schema: z.array(z.string()),
	maxDuration: 60,
	run: async (usernames) => {
		for (const username of usernames) {
			await populateGithubUser(username, 10);
		}
	},
});
