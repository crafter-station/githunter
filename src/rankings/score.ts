import { getLensMetricEntries } from "./lenses";
import type {
	LensDefinition,
	MetricBreakdown,
	RankingDataset,
	RankingEntry,
	RankingMetric,
	RankingProfile,
	RankingSnapshot,
} from "./types";

function round(value: number, precision = 2) {
	const multiplier = 10 ** precision;
	return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

function percentileLookup(values: number[]) {
	const lookup = new Map<number, number>();
	if (values.length <= 1) {
		for (const value of values) lookup.set(value, 100);
		return lookup;
	}
	const sorted = [...values].sort((left, right) => left - right);
	for (let start = 0; start < sorted.length; ) {
		let end = start + 1;
		while (end < sorted.length && sorted[end] === sorted[start]) end += 1;
		lookup.set(
			sorted[start],
			round(((start + (end - start - 1) / 2) / (sorted.length - 1)) * 100),
		);
		start = end;
	}
	return lookup;
}

function changePercent(current: number, previous: number | undefined) {
	if (previous === undefined) return null;
	if (previous === 0) return current === 0 ? 0 : null;
	return round(((current - previous) / previous) * 100, 1);
}

function momentumValue(profile: RankingProfile, metric: RankingMetric) {
	const previous = profile.previousMetrics?.[metric];
	if (previous === undefined) return null;
	const current = profile.metrics[metric];
	const total = current + previous;
	const reliability = Math.min(1, total / 50);
	return Math.log2((current + 10) / (previous + 10)) * reliability;
}

function metricValue(
	profile: RankingProfile,
	metric: RankingMetric,
	lens: LensDefinition,
) {
	return lens.mode === "momentum"
		? momentumValue(profile, metric)
		: profile.metrics[metric];
}

export function scoreProfiles(
	profiles: RankingProfile[],
	lens: LensDefinition,
): RankingEntry[] {
	const lensMetrics = getLensMetricEntries(lens);
	const percentiles = new Map<RankingMetric, Map<number, number>>();

	for (const [metric] of lensMetrics) {
		percentiles.set(
			metric,
			percentileLookup(
				profiles
					.map((profile) => metricValue(profile, metric, lens))
					.filter((value): value is number => value !== null),
			),
		);
	}

	const scored = profiles.map((profile) => {
		let availableWeight = 0;
		const breakdown: MetricBreakdown[] = [];

		for (const [metric, weight] of lensMetrics) {
			const value = metricValue(profile, metric, lens);
			if (value === null) continue;
			availableWeight += weight;
			const metricPercentile = percentiles.get(metric)?.get(value) ?? 0;
			const previous = profile.previousMetrics?.[metric];
			breakdown.push({
				metric,
				raw: profile.metrics[metric],
				previous: previous ?? null,
				changePercent: changePercent(profile.metrics[metric], previous),
				percentile: metricPercentile,
				weight,
				points: round(metricPercentile * weight),
			});
		}

		const weightedPoints = breakdown.reduce(
			(sum, metric) => sum + metric.points,
			0,
		);
		const score = availableWeight > 0 ? weightedPoints / availableWeight : 0;

		return {
			rank: 0,
			previousRank: null,
			rankChange: null,
			score: round(score),
			confidence: round(availableWeight * 100, 0),
			profile,
			breakdown,
		};
	});

	return scored
		.sort(
			(left, right) =>
				right.score - left.score ||
				left.profile.login.localeCompare(right.profile.login),
		)
		.map((entry, index) => ({ ...entry, rank: index + 1 }));
}

export function buildRankingSnapshot(
	dataset: RankingDataset,
	lens: LensDefinition,
	previousEntries?: RankingEntry[],
): RankingSnapshot {
	const previousRanks = new Map(
		(previousEntries ?? []).map((entry) => [
			entry.profile.login.toLowerCase(),
			entry.rank,
		]),
	);
	const entries = scoreProfiles(dataset.profiles, lens).map((entry) => {
		const previousRank =
			previousRanks.get(entry.profile.login.toLowerCase()) ?? null;
		return {
			...entry,
			previousRank,
			rankChange: previousRank === null ? null : previousRank - entry.rank,
		};
	});
	const snapshotDate = dataset.generatedAt.slice(0, 10);

	return {
		id: `${dataset.scope}:${lens.id}:${lens.version}:${snapshotDate}`,
		scope: dataset.scope,
		scopeName: dataset.scope === "peru" ? "Peru" : dataset.scope,
		lens,
		generatedAt: dataset.generatedAt,
		period: dataset.period,
		previousPeriod: dataset.previousPeriod,
		cohort: dataset.cohort,
		sources: dataset.sources,
		limitations: dataset.limitations,
		entries,
		cache: "bundled",
	};
}
