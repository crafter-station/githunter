import { metricLabels } from "./lenses";
import type { RankingEntry } from "./types";

export interface SignalProfile {
	login: string;
	name: string;
	location: string;
	avatarUrl: string;
	rank: number;
	score: number;
	strongestLabel: string;
	strongestValue: string;
}

function compactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: value >= 1000 ? "compact" : "standard",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

export function buildSignalProfiles(entries: RankingEntry[], limit = 12) {
	return entries.slice(0, limit).map((entry) => {
		const strongest = [...entry.breakdown].sort(
			(left, right) => right.points - left.points,
		)[0];
		return {
			login: entry.profile.login,
			name: entry.profile.name || entry.profile.login,
			location: entry.profile.location,
			avatarUrl: entry.profile.avatarUrl,
			rank: entry.rank,
			score: entry.score,
			strongestLabel: metricLabels[strongest.metric],
			strongestValue: compactNumber(strongest.raw),
		} satisfies SignalProfile;
	});
}
