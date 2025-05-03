import fs from "node:fs/promises";
import path from "node:path";
import { populateGithubUsersTaks } from "@/triggers/populate-github-users-task";

if (require.main === module) {
	(async () => {
		const buildDir = path.resolve(__dirname, "../github-cache");
		const files = await fs.readdir(buildDir);
		const usernames: string[] = [];

		for (const file of files.filter((f) => f.endsWith(".json"))) {
			const users = Object.keys(
				JSON.parse(await fs.readFile(path.join(buildDir, file), "utf-8")),
			);
			for (const user of users) {
				if (user.includes(".md")) {
					continue;
				}

				if (!usernames.includes(user)) {
					usernames.push(user);
				}
			}
		}

		await populateGithubUsersTaks.trigger(usernames);
	})();
}
