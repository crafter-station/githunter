import type { RankingDataset, RankingMetric, RankingProfile } from "./types";

export const historicalMetricKeys = [
	"commits",
	"publicContributions",
	"mergedPullRequests",
] as const satisfies readonly RankingMetric[];

export type HistoricalMetric = (typeof historicalMetricKeys)[number];

export interface HistoricalMetricSummary {
	metric: HistoricalMetric;
	current: number;
	previous: number;
	changePercent: number | null;
}

export interface HistoricalRecord {
	period: RankingDataset["period"];
	previousPeriod: NonNullable<RankingDataset["previousPeriod"]>;
	profiles: number;
	metrics: HistoricalMetricSummary[];
}

export function buildHistoricalRecord({
	period,
	previousPeriod,
	profiles,
}: {
	period: RankingDataset["period"];
	previousPeriod?: RankingDataset["previousPeriod"];
	profiles: RankingProfile[];
}): HistoricalRecord | null {
	if (!previousPeriod) return null;

	return {
		period,
		previousPeriod,
		profiles: profiles.length,
		metrics: historicalMetricKeys.map((metric) => {
			const totals = profiles.reduce(
				(summary, profile) => ({
					current: summary.current + profile.metrics[metric],
					previous: summary.previous + (profile.previousMetrics?.[metric] ?? 0),
				}),
				{ current: 0, previous: 0 },
			);

			return {
				metric,
				...totals,
				changePercent:
					totals.previous === 0
						? null
						: Math.round(
								((totals.current - totals.previous) / totals.previous) * 100,
							),
			};
		}),
	};
}
