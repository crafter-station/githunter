import * as fs from "node:fs";
import * as path from "node:path";
import * as readline from "node:readline";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { PopulateGithubUser } from "@/services/populate-github-user.service";
import { eq } from "drizzle-orm";

async function main() {
	const filePath = path.resolve(__dirname, "../users.txt");
	if (!fs.existsSync(filePath)) {
		console.error(`No se encontró el archivo en ${filePath}`);
		process.exit(1);
	}

	const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Number.POSITIVE_INFINITY,
	});

	for await (const line of rl) {
		if (!line.trim()) continue;

		const [country, username, _] = line.split(",");
		try {
			const existingUser = await db.query.user.findFirst({
				where: eq(userTable.username, username),
			});
			if (existingUser) {
				console.log(
					`github username ${username} already processed with id ${existingUser.id}, skipping`,
				);
				continue;
			}

			const service = new PopulateGithubUser();
			await service.exec(username, country, null, 10);
			console.log(`username ${username} processed`);
		} catch (error) {
			console.error(`error executing script for user: ${username}`, error);
		}
	}
}

if (require.main === module) {
	main().catch((err) => console.log(err));
}
