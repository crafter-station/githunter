import "dotenv/config";
import { getBundledDataset } from "../src/rankings/data";
import {
	collectRankingDataset,
	createHistoricalSeasonEvidenceWindows,
} from "../src/rankings/github";
import { persistRankingDataset } from "../src/rankings/store";

const token = process.env.GITHUB_TOKEN;
if (!token) throw new Error("GITHUB_TOKEN is not set");

const baseline = getBundledDataset("peru");
const logins = baseline.profiles.map((profile) => profile.login);
const seasons = ["2026-Q1", "2026-Q2"];

for (const season of seasons) {
	const dataset = await collectRankingDataset({
		scope: "peru",
		logins,
		token,
		cohortDefinition: baseline.cohort.definition,
		windows: createHistoricalSeasonEvidenceWindows(season),
		reconstructed: true,
		onProgress: ({ completed, total }) =>
			console.log(`${season} ${completed}/${total}`),
	});
	if (dataset.profiles.length < logins.length * 0.9) {
		throw new Error(
			`${season} returned ${dataset.profiles.length}/${logins.length} profiles`,
		);
	}
	const snapshots = await persistRankingDataset(dataset);
	console.log(
		JSON.stringify({
			season,
			profiles: dataset.profiles.length,
			lenses: snapshots.map((snapshot) => snapshot.lens.id),
		}),
	);
}
