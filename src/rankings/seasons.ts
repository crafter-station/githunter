import type {
	CareerStanding,
	LensId,
	RankingSeason,
	RankingSeasonResult,
} from "./types";

export const ladderRulesetVersion = "1.0.0";
export const firstOfficialSeasonId = "2026-Q4";

function isoDate(date: Date) {
	return date.toISOString().slice(0, 10);
}

function seasonOrder(id: string) {
	const match = /^(\d{4})-Q([1-4])$/.exec(id);
	return match ? Number(match[1]) * 4 + Number(match[2]) : 0;
}

export function getSeasonId(date: Date) {
	const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
	return `${date.getUTCFullYear()}-Q${quarter}`;
}

export function getSeason(date = new Date()): RankingSeason {
	const year = date.getUTCFullYear();
	const quarter = Math.floor(date.getUTCMonth() / 3) + 1;
	const startsAt = new Date(Date.UTC(year, (quarter - 1) * 3, 1));
	const endsAt = new Date(Date.UTC(year, quarter * 3, 0));
	const id = `${year}-Q${quarter}`;
	return {
		id,
		label: `${year} Q${quarter}`,
		startsAt: isoDate(startsAt),
		endsAt: isoDate(endsAt),
		status:
			seasonOrder(id) < seasonOrder(firstOfficialSeasonId)
				? "preseason"
				: "active",
		rulesetVersion: ladderRulesetVersion,
		closedAt: null,
	};
}

export function isSeasonId(value: string) {
	return /^\d{4}-Q[1-4]$/.test(value);
}

export function buildCareerStandings({
	results,
	seasons,
	lensId = "balanced",
	mode = "all-time",
}: {
	results: RankingSeasonResult[];
	seasons: RankingSeason[];
	lensId?: LensId;
	mode?: "all-time" | "form";
}) {
	const seasonById = new Map(seasons.map((season) => [season.id, season]));
	const relevant = results.filter((result) => result.lensId === lensId);
	const groups = new Map<string, RankingSeasonResult[]>();
	for (const result of relevant) {
		const key = result.username.toLowerCase();
		groups.set(key, [...(groups.get(key) ?? []), result]);
	}

	const standings = [...groups.values()].map((entries) => {
		const ordered = [...entries].sort(
			(left, right) => seasonOrder(right.seasonId) - seasonOrder(left.seasonId),
		);
		const closed = ordered.filter(
			(entry) => seasonById.get(entry.seasonId)?.status === "closed",
		);
		const scoredCareer = closed.length > 0 ? closed : ordered.slice(0, 1);
		const formEntries = ordered.slice(0, 4);
		const current = ordered[0];
		return {
			rank: 0,
			profile: current.entry.profile,
			careerPoints: Number(
				scoredCareer
					.reduce((total, entry) => total + entry.score, 0)
					.toFixed(2),
			),
			formScore: Number(
				(
					formEntries.reduce((total, entry) => total + entry.score, 0) /
					Math.max(formEntries.length, 1)
				).toFixed(2),
			),
			seasons: closed.length,
			championships: closed.filter((entry) => entry.rank === 1).length,
			podiums: closed.filter((entry) => entry.rank <= 3).length,
			currentRank: current?.rank ?? null,
			currentScore: current?.score ?? null,
			provisional: closed.length === 0,
		} satisfies CareerStanding;
	});

	return standings
		.sort((left, right) => {
			const leftScore = mode === "form" ? left.formScore : left.careerPoints;
			const rightScore = mode === "form" ? right.formScore : right.careerPoints;
			return (
				rightScore - leftScore ||
				right.championships - left.championships ||
				(right.currentScore ?? 0) - (left.currentScore ?? 0) ||
				left.profile.login.localeCompare(right.profile.login)
			);
		})
		.map((standing, index) => ({ ...standing, rank: index + 1 }));
}
