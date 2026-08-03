import { getCandidateEvaluation } from "./candidates";
import { bundledDatasets, getBundledDataset, getRankingScope } from "./data";
import { rankingLenses } from "./lenses";
import type { RankingScope } from "./scopes";
import { buildRankingSnapshot } from "./score";
import { getLadderStandings } from "./season-store";
import { getSeason } from "./seasons";
import { getAvailableScopes, getRankingSnapshot } from "./store";
import type { LensDefinition, RankingEntry, RankingProfile } from "./types";

export interface BundledProfileRanking {
	lens: LensDefinition;
	entry: RankingEntry;
}

export interface BundledRankingProfile {
	scope: RankingScope;
	scopeName: string;
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

const bundledScopeRankings = Object.keys(bundledDatasets).map((scope) => {
	const rankingScope = scope as keyof typeof bundledDatasets;
	const dataset = getBundledDataset(rankingScope);
	return {
		scope: rankingScope,
		dataset,
		profiles: new Map(
			dataset.profiles.map((profile) => [profile.login.toLowerCase(), profile]),
		),
		rankings: Object.values(rankingLenses).map((lens) => {
			const snapshot = buildRankingSnapshot(dataset, lens);
			return {
				lens,
				entries: new Map(
					snapshot.entries.map((entry) => [
						entry.profile.login.toLowerCase(),
						entry,
					]),
				),
			};
		}),
	};
});

export function getBundledRankingProfile(
	username: string,
): BundledRankingProfile | null {
	const normalized = username.trim().toLowerCase();
	const bundled = bundledScopeRankings.find((item) =>
		item.profiles.has(normalized),
	);
	const profile = bundled?.profiles.get(normalized);

	if (!profile || !bundled) return null;

	const rankings = bundled.rankings.map(({ lens, entries }) => {
		const entry = entries.get(normalized);

		if (!entry) throw new Error(`Ranking entry not found for ${profile.login}`);

		return { lens, entry };
	});

	return {
		scope: bundled.scope,
		scopeName: getRankingScope(bundled.scope).name,
		profile,
		rankings,
		generatedAt: bundled.dataset.generatedAt,
		period: bundled.dataset.period,
	};
}

export async function getRankingProfile(username: string) {
	const normalized = username.trim().toLowerCase();
	const snapshotsByScope = await Promise.all(
		getAvailableScopes().map(async (scope) => ({
			scope,
			snapshots: await Promise.all(
				Object.values(rankingLenses).map((lens) =>
					getRankingSnapshot(scope, lens.id),
				),
			),
		})),
	);
	const matchedScope =
		snapshotsByScope.find(({ snapshots }) =>
			snapshots.some((snapshot) =>
				snapshot.entries.some(
					(item) => item.profile.login.toLowerCase() === normalized,
				),
			),
		) ?? snapshotsByScope.find(({ scope }) => scope === "peru");
	if (!matchedScope) return getBundledRankingProfile(username);
	const { scope, snapshots } = matchedScope;
	const rankings = snapshots.flatMap((snapshot) => {
		const entry = snapshot.entries.find(
			(item) => item.profile.login.toLowerCase() === normalized,
		);
		return entry ? [{ lens: snapshot.lens, entry }] : [];
	});
	const candidate =
		rankings.length === 0
			? await getCandidateEvaluation(scope, normalized)
			: null;
	const resolvedRankings = rankings.length > 0 ? rankings : candidate?.rankings;
	const profile = resolvedRankings?.[0]?.entry.profile ?? candidate?.profile;
	if (!profile || !resolvedRankings) return getBundledRankingProfile(username);

	const [allTime, form] = await Promise.all([
		getLadderStandings({ scope, mode: "all-time" }),
		getLadderStandings({ scope, mode: "form" }),
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
		scope,
		scopeName: getRankingScope(scope).name,
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
