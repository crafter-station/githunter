import { getCandidateEvaluation } from "./candidates";
import { getBundledDataset } from "./data";
import { rankingLenses } from "./lenses";
import { buildRankingSnapshot } from "./score";
import { getLadderStandings } from "./season-store";
import { getSeason } from "./seasons";
import { getRankingSnapshot } from "./store";
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
	career?: {
		allTimeRank: number;
		formRank: number;
		careerPoints: number;
		formScore: number;
		seasons: number;
		championships: number;
		podiums: number;
		provisional: boolean;
		seasonLabel: string;
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

export async function getRankingProfile(username: string) {
	const normalized = username.trim().toLowerCase();
	const snapshots = await Promise.all(
		Object.values(rankingLenses).map((lens) =>
			getRankingSnapshot("peru", lens.id),
		),
	);
	const rankings = snapshots.flatMap((snapshot) => {
		const entry = snapshot.entries.find(
			(item) => item.profile.login.toLowerCase() === normalized,
		);
		return entry ? [{ lens: snapshot.lens, entry }] : [];
	});
	const candidate =
		rankings.length === 0
			? await getCandidateEvaluation("peru", normalized)
			: null;
	const resolvedRankings = rankings.length > 0 ? rankings : candidate?.rankings;
	const profile = resolvedRankings?.[0]?.entry.profile ?? candidate?.profile;
	if (!profile || !resolvedRankings) return getBundledRankingProfile(username);

	const [allTime, form] = await Promise.all([
		getLadderStandings({ scope: "peru", mode: "all-time" }),
		getLadderStandings({ scope: "peru", mode: "form" }),
	]);
	const allTimeStanding = allTime.standings.find(
		(standing) => standing.profile.login.toLowerCase() === normalized,
	);
	const formStanding = form.standings.find(
		(standing) => standing.profile.login.toLowerCase() === normalized,
	);
	const latest = snapshots[0];
	const season = allTime.seasons[0] ?? getSeason(new Date(latest.generatedAt));

	return {
		profile,
		rankings: resolvedRankings,
		generatedAt: candidate?.evaluatedAt ?? latest.generatedAt,
		period: latest.period,
		career:
			allTimeStanding && formStanding
				? {
						allTimeRank: allTimeStanding.rank,
						formRank: formStanding.rank,
						careerPoints: allTimeStanding.careerPoints,
						formScore: formStanding.formScore,
						seasons: allTimeStanding.seasons,
						championships: allTimeStanding.championships,
						podiums: allTimeStanding.podiums,
						provisional: allTimeStanding.provisional,
						seasonLabel: season.label,
					}
				: undefined,
	} satisfies BundledRankingProfile;
}
