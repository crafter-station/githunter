import { readFile, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";
import { collectRankingDataset } from "../src/rankings/github";
import type { RankingDataset, RankingProfile } from "../src/rankings/types";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const scope = process.argv[2]?.toLowerCase() ?? "peru";
const configs = {
	peru: {
		name: "Peru",
		cohortDefinition:
			"Public GitHub users mapped to Peru from follower discovery and public activity rankings, after location review and cross-country exclusions.",
	},
	colombia: {
		name: "Colombia",
		cohortDefinition:
			"Public GitHub users mapped to Colombia from the 256-account committers.top country cohort, scored from GitHub public evidence.",
	},
} as const;

if (!(scope in configs)) throw new Error(`Unsupported ranking scope: ${scope}`);
const config = configs[scope as keyof typeof configs];
const baselinePath = resolve(root, `src/rankings/data/${scope}-baseline.json`);
const exclusionsPath = resolve(
	root,
	`src/rankings/data/${scope}-exclusions.json`,
);
const checkpointPath = resolve(tmpdir(), `githunter-${scope}-ranking.json`);

async function readJson<T>(path: string): Promise<T | null> {
	try {
		return JSON.parse(await readFile(path, "utf8")) as T;
	} catch {
		return null;
	}
}

const current = await readJson<RankingDataset>(baselinePath);
const exclusions =
	(await readJson<Array<{ login: string }>>(exclusionsPath)) ?? [];
const excludedLogins = new Set(exclusions.map((exclusion) => exclusion.login));
const sourceLogins = current
	? current.profiles.map((profile) => profile.login)
	: ((
			(await fetch(`https://committers.top/rank_only/${scope}.json`).then(
				(response) => response.json(),
			)) as { user: string[] }
		).user ?? []);
const logins = sourceLogins.filter((login) => !excludedLogins.has(login));
const checkpoint =
	(await readJson<{ profiles: RankingProfile[] }>(checkpointPath))?.profiles ??
	[];
const completedLogins = new Set(
	checkpoint.map((profile) => profile.login.toLowerCase()),
);
const remainingLogins = logins.filter(
	(login) => !completedLogins.has(login.toLowerCase()),
);
const dataset = await collectRankingDataset({
	scope,
	logins: remainingLogins,
	token,
	cohortDefinition: current?.cohort.definition ?? config.cohortDefinition,
	initialProfiles: checkpoint,
	candidateCount: logins.length,
	onCheckpoint: (profiles) =>
		writeFile(checkpointPath, JSON.stringify({ profiles })),
	onProgress: ({ completed, total }) =>
		console.log(`${config.name} ranking bundle ${completed}/${total}`),
});
if (dataset.profiles.length < logins.length * 0.9) {
	throw new Error(
		`Ranking bundle returned ${dataset.profiles.length}/${logins.length} profiles`,
	);
}

await writeFile(baselinePath, `${JSON.stringify(dataset, null, 2)}\n`);
await unlink(checkpointPath).catch(() => undefined);
console.log(`Wrote ${dataset.profiles.length} profiles to ${baselinePath}`);
