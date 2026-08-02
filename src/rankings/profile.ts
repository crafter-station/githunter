import { getBundledDataset } from "./data";
import { rankingLenses } from "./lenses";
import { buildRankingSnapshot } from "./score";
import type { LensDefinition, RankingEntry, RankingProfile } from "./types";

export interface BundledProfileRanking {
	lens: LensDefinition;
	entry: RankingEntry;
}

export interface BundledRankingProfile {
	profile: RankingProfile;
	rankings: BundledProfileRanking[];
	generatedAt: string;
	period: {
		from: string;
		to: string;
	};
}

const bundledDataset = getBundledDataset("peru");
const bundledRankings = Object.values(rankingLenses).map((lens) => {
	const snapshot = buildRankingSnapshot(bundledDataset, lens);
	return {
		lens,
		entries: new Map(
			snapshot.entries.map((entry) => [
				entry.profile.login.toLowerCase(),
				entry,
			]),
		),
	};
});
const bundledProfiles = new Map(
	bundledDataset.profiles.map((profile) => [
		profile.login.toLowerCase(),
		profile,
	]),
);

export function getBundledRankingProfile(
	username: string,
): BundledRankingProfile | null {
	const normalized = username.trim().toLowerCase();
	const profile = bundledProfiles.get(normalized);

	if (!profile) return null;

	const rankings = bundledRankings.map(({ lens, entries }) => {
		const entry = entries.get(normalized);

		if (!entry) throw new Error(`Ranking entry not found for ${profile.login}`);

		return { lens, entry };
	});

	return {
		profile,
		rankings,
		generatedAt: bundledDataset.generatedAt,
		period: bundledDataset.period,
	};
}
