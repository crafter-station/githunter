import { runConcurrently } from "@/lib/concurrency";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { PopulateGithubUser } from "../core/services/populate-github-user.service";

export const populateGithubUsersTaks = schemaTask({
	id: "populate-github-users",
	schema: z.array(z.string()),
	maxDuration: 60,
	run: async (usernames) => {
		const populateGithubUser = new PopulateGithubUser();
		const repoCount = 10;
		const totalConcurrent = 10;

		await runConcurrently(
			usernames,
			async (username) => await populateGithubUser.exec(username, repoCount),
			totalConcurrent,
		);
	},
});
