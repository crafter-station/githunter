import { type RankingScope, getBundledDataset } from "./data";
import { collectRankingDataset } from "./github";
import { persistRankingDataset } from "./store";

export async function refreshRankingScope({
	scope,
	token,
	onProgress,
}: {
	scope: RankingScope;
	token: string;
	onProgress?: (progress: { completed: number; total: number }) => void;
}) {
	const baseline = getBundledDataset(scope);
	const dataset = await collectRankingDataset({
		scope,
		logins: baseline.profiles.map((profile) => profile.login),
		token,
		cohortDefinition: baseline.cohort.definition,
		onProgress,
	});
	if (dataset.profiles.length < baseline.profiles.length * 0.9) {
		throw new Error(
			`Ranking refresh returned ${dataset.profiles.length}/${baseline.profiles.length} profiles`,
		);
	}
	const snapshots = await persistRankingDataset(dataset);
	return { dataset, snapshots };
}
