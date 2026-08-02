import { buildHistoricalRecord } from "./history";
import type { RankingMetrics, RankingProfile } from "./types";

const metrics: RankingMetrics = {
	commits: 100,
	publicContributions: 120,
	mergedPullRequests: 10,
	pullRequests: 12,
	reviews: 3,
	issues: 4,
	stars: 50,
	forks: 5,
	followers: 20,
	externalRepos: 2,
};

const profile: RankingProfile = {
	login: "builder",
	name: "Builder",
	location: "Peru",
	avatarUrl: "https://avatars.githubusercontent.com/builder",
	metrics,
	previousMetrics: {
		commits: 50,
		publicContributions: 80,
		mergedPullRequests: 4,
	},
};

describe("historical record", () => {
	it("compares only metrics captured in both windows", () => {
		const record = buildHistoricalRecord({
			period: { from: "2025-08-03", to: "2026-08-02" },
			previousPeriod: { from: "2024-08-03", to: "2025-08-02" },
			profiles: [profile],
		});

		expect(record?.metrics).toEqual([
			{ metric: "commits", current: 100, previous: 50, changePercent: 100 },
			{
				metric: "publicContributions",
				current: 120,
				previous: 80,
				changePercent: 50,
			},
			{
				metric: "mergedPullRequests",
				current: 10,
				previous: 4,
				changePercent: 150,
			},
		]);
	});

	it("requires a preceding comparable period", () => {
		expect(
			buildHistoricalRecord({
				period: { from: "2025-08-03", to: "2026-08-02" },
				profiles: [profile],
			}),
		).toBeNull();
	});
});
