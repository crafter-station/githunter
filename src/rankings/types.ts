export const rankingMetricKeys = [
	"commits",
	"publicContributions",
	"mergedPullRequests",
	"pullRequests",
	"reviews",
	"issues",
	"stars",
	"forks",
	"followers",
	"externalRepos",
] as const;

export type RankingMetric = (typeof rankingMetricKeys)[number];

export type RankingMetrics = Record<RankingMetric, number>;

export const lensIds = [
	"balanced",
	"builder",
	"oss-impact",
	"maintainer",
	"rising",
] as const;

export type LensId = (typeof lensIds)[number];

export interface RankingProfile {
	login: string;
	name: string;
	location: string;
	avatarUrl: string;
	metrics: RankingMetrics;
	previousMetrics?: Partial<RankingMetrics>;
}

export interface RankingDataset {
	scope: string;
	generatedAt: string;
	period: {
		from: string;
		to: string;
	};
	previousPeriod?: {
		from: string;
		to: string;
	};
	cohort: {
		definition: string;
		candidates: number;
		scored: number;
	};
	sources: string[];
	limitations: string[];
	profiles: RankingProfile[];
}

export interface LensDefinition {
	id: LensId;
	version: string;
	name: string;
	shortName: string;
	question: string;
	description: string;
	weights: Partial<Record<RankingMetric, number>>;
	mode: "level" | "momentum";
}

export interface MetricBreakdown {
	metric: RankingMetric;
	raw: number;
	previous: number | null;
	changePercent: number | null;
	percentile: number;
	weight: number;
	points: number;
}

export interface RankingEntry {
	rank: number;
	previousRank: number | null;
	rankChange: number | null;
	score: number;
	confidence: number;
	profile: RankingProfile;
	breakdown: MetricBreakdown[];
}

export interface RankingSnapshot {
	id: string;
	scope: string;
	scopeName: string;
	lens: LensDefinition;
	generatedAt: string;
	period: RankingDataset["period"];
	previousPeriod: RankingDataset["previousPeriod"];
	cohort: RankingDataset["cohort"];
	sources: string[];
	limitations: string[];
	entries: RankingEntry[];
	cache: "database" | "redis" | "bundled";
}
