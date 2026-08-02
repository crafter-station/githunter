import { writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import baseline from "../src/rankings/data/peru-baseline.json";
import exclusions from "../src/rankings/data/peru-exclusions.json";
import { collectRankingDataset } from "../src/rankings/github";
import type { RankingDataset } from "../src/rankings/types";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const current = baseline as RankingDataset;
const excludedLogins = new Set(exclusions.map((exclusion) => exclusion.login));
const logins = current.profiles
	.map((profile) => profile.login)
	.filter((login) => !excludedLogins.has(login));
const dataset = await collectRankingDataset({
	scope: "peru",
	logins,
	token,
	cohortDefinition: current.cohort.definition,
	onProgress: ({ completed, total }) =>
		console.log(`Ranking bundle ${completed}/${total}`),
});
if (dataset.profiles.length < logins.length * 0.9) {
	throw new Error(
		`Ranking bundle returned ${dataset.profiles.length}/${logins.length} profiles`,
	);
}

const output = resolve(
	dirname(fileURLToPath(import.meta.url)),
	"../src/rankings/data/peru-baseline.json",
);
await writeFile(output, `${JSON.stringify(dataset, null, 2)}\n`);
console.log(`Wrote ${dataset.profiles.length} profiles to ${output}`);
