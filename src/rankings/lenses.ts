import type { LensDefinition, LensId, RankingMetric } from "./types";

export const metricLabels: Record<RankingMetric, string> = {
	commits: "Commits",
	publicContributions: "Contributions",
	mergedPullRequests: "Merged PRs",
	pullRequests: "Pull requests",
	reviews: "Reviews",
	issues: "Issues",
	stars: "Stars",
	forks: "Forks",
	followers: "Followers",
	externalRepos: "External repos",
};

export const rankingLenses = {
	balanced: {
		id: "balanced",
		version: "1.0.0",
		name: "Balanced",
		shortName: "Balanced",
		question: "Who combines sustained work, collaboration, and public impact?",
		description:
			"A broad view of recent public work, accepted collaboration, and durable adoption.",
		weights: {
			commits: 0.15,
			publicContributions: 0.1,
			mergedPullRequests: 0.12,
			pullRequests: 0.05,
			reviews: 0.05,
			issues: 0.03,
			stars: 0.22,
			forks: 0.08,
			followers: 0.12,
			externalRepos: 0.08,
		},
		mode: "level",
	},
	builder: {
		id: "builder",
		version: "1.0.0",
		name: "Builder",
		shortName: "Builder",
		question: "Who consistently ships public work?",
		description:
			"Rewards sustained output and accepted changes while keeping popularity secondary.",
		weights: {
			commits: 0.3,
			publicContributions: 0.2,
			mergedPullRequests: 0.2,
			pullRequests: 0.1,
			externalRepos: 0.1,
			stars: 0.05,
			reviews: 0.05,
		},
		mode: "level",
	},
	"oss-impact": {
		id: "oss-impact",
		version: "1.0.0",
		name: "Open source impact",
		shortName: "OSS Impact",
		question: "Whose public work is adopted by others?",
		description:
			"Measures cumulative public adoption and reach through stars, forks, and followers.",
		weights: {
			stars: 0.5,
			forks: 0.2,
			followers: 0.3,
		},
		mode: "level",
	},
	maintainer: {
		id: "maintainer",
		version: "1.0.0",
		name: "Maintainer",
		shortName: "Maintainer",
		question: "Who keeps projects and collaboration moving?",
		description:
			"Emphasizes merged work, reviews, issues, and contribution across repositories.",
		weights: {
			mergedPullRequests: 0.3,
			reviews: 0.25,
			issues: 0.15,
			externalRepos: 0.15,
			pullRequests: 0.1,
			publicContributions: 0.05,
		},
		mode: "level",
	},
	rising: {
		id: "rising",
		version: "1.0.0",
		name: "Rising",
		shortName: "Rising",
		question: "Who is accelerating fastest?",
		description:
			"Compares the current public activity window with the preceding equivalent period.",
		weights: {
			commits: 0.35,
			publicContributions: 0.25,
			mergedPullRequests: 0.15,
			pullRequests: 0.1,
			reviews: 0.1,
			issues: 0.05,
		},
		mode: "momentum",
	},
} as const satisfies Record<LensId, LensDefinition>;

export function isLensId(value: string): value is LensId {
	return value in rankingLenses;
}

export function getLens(value: string): LensDefinition {
	return isLensId(value) ? rankingLenses[value] : rankingLenses.balanced;
}

export function getLensMetricEntries(lens: LensDefinition) {
	return Object.entries(lens.weights) as Array<[RankingMetric, number]>;
}
