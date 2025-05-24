import { batch, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { indexGithubUserTask } from "./index-github-user-task";

export const indexGithubUsersTask = schemaTask({
	id: "index-github-users",
	schema: z.array(z.string()),
	maxDuration: 60,
	run: async (usernames) => {
		await batch.trigger<typeof indexGithubUserTask>(
			usernames.map((username) => ({
				id: indexGithubUserTask.id,
				payload: {
					username,
				},
			})),
		);
	},
});
