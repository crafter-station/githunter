import { getBundledDataset } from "./data";
import { rankingLenses } from "./lenses";
import { buildRankingSnapshot, scoreProfiles } from "./score";
import type { LensDefinition, RankingMetrics, RankingProfile } from "./types";

const emptyMetrics: RankingMetrics = {
	commits: 0,
	publicContributions: 0,
	mergedPullRequests: 0,
	pullRequests: 0,
	reviews: 0,
	issues: 0,
	stars: 0,
	forks: 0,
	followers: 0,
	externalRepos: 0,
};

function profile(
	login: string,
	metrics: Partial<RankingMetrics>,
	previousMetrics?: Partial<RankingMetrics>,
): RankingProfile {
	return {
		login,
		name: login,
		location: "Peru",
		avatarUrl: `https://avatars.githubusercontent.com/${login}`,
		metrics: { ...emptyMetrics, ...metrics },
		previousMetrics,
	};
}

describe("ranking lenses", () => {
	it.each(Object.values(rankingLenses))("$id weights sum to one", (lens) => {
		const sum = Object.values(lens.weights).reduce(
			(total, weight) => total + weight,
			0,
		);
		expect(sum).toBeCloseTo(1, 8);
	});

	it("keeps the bundled balanced snapshot reproducible", () => {
		const snapshot = buildRankingSnapshot(
			getBundledDataset("peru"),
			rankingLenses.balanced,
		);
		expect(snapshot.entries).toHaveLength(snapshot.cohort.scored);
		expect(snapshot.entries[0]?.profile.login.toLowerCase()).toBe("railly");
		expect(snapshot.entries[0]?.score).toBe(97.27);
		expect(snapshot.lens.version).toBe("1.0.0");
		expect(snapshot.entries.every((entry) => entry.confidence === 100)).toBe(
			true,
		);
	});

	it("keeps distinct lenses meaningfully distinct", () => {
		const dataset = getBundledDataset("peru");
		const impact = buildRankingSnapshot(dataset, rankingLenses["oss-impact"]);
		const rising = buildRankingSnapshot(dataset, rankingLenses.rising);
		expect(
			impact.entries.find((entry) => entry.profile.login === "Railly")?.rank,
		).toBe(9);
		expect(
			rising.entries.find((entry) => entry.profile.login === "Railly")?.rank,
		).toBe(3);
		expect(impact.entries[0]?.profile.login).toBe("sergiodxa");
	});

	it("uses percentiles so an extreme outlier cannot add extra score", () => {
		const lens: LensDefinition = {
			id: "oss-impact",
			version: "test",
			name: "Test",
			shortName: "Test",
			question: "Test",
			description: "Test",
			weights: { stars: 1 },
			mode: "level",
		};
		const ordinary = scoreProfiles(
			[
				profile("a", { stars: 100 }),
				profile("b", { stars: 10 }),
				profile("c", { stars: 1 }),
			],
			lens,
		);
		const extreme = scoreProfiles(
			[
				profile("a", { stars: 1_000_000 }),
				profile("b", { stars: 10 }),
				profile("c", { stars: 1 }),
			],
			lens,
		);
		expect(extreme.map((entry) => entry.score)).toEqual(
			ordinary.map((entry) => entry.score),
		);
	});

	it("ranks acceleration from equivalent periods", () => {
		const entries = scoreProfiles(
			[
				profile("accelerating", { commits: 300 }, { commits: 100 }),
				profile("flat", { commits: 300 }, { commits: 300 }),
				profile("slowing", { commits: 100 }, { commits: 300 }),
			],
			{
				...rankingLenses.rising,
				weights: { commits: 1 },
			},
		);
		expect(entries.map((entry) => entry.profile.login)).toEqual([
			"accelerating",
			"flat",
			"slowing",
		]);
	});

	it("lowers confidence when comparison evidence is absent", () => {
		const [entry] = scoreProfiles([profile("new", { commits: 100 })], {
			...rankingLenses.rising,
			weights: { commits: 1 },
		});
		expect(entry?.confidence).toBe(0);
		expect(entry?.score).toBe(0);
	});

	it("reports movement against the preceding persisted rank order", () => {
		const lens: LensDefinition = {
			id: "oss-impact",
			version: "test",
			name: "Test",
			shortName: "Test",
			question: "Test",
			description: "Test",
			weights: { stars: 1 },
			mode: "level",
		};
		const baseDataset = {
			scope: "peru",
			generatedAt: "2026-08-01T00:00:00.000Z",
			period: {
				from: "2025-08-02T00:00:00.000Z",
				to: "2026-08-01T23:59:59.999Z",
			},
			cohort: { definition: "Test", candidates: 2, scored: 2 },
			sources: ["Test"],
			limitations: [],
			profiles: [profile("a", { stars: 10 }), profile("b", { stars: 1 })],
		};
		const previous = buildRankingSnapshot(baseDataset, lens);
		const current = buildRankingSnapshot(
			{
				...baseDataset,
				generatedAt: "2026-08-02T00:00:00.000Z",
				profiles: [profile("a", { stars: 1 }), profile("b", { stars: 10 })],
			},
			lens,
			previous.entries,
		);

		expect(
			current.entries.map(({ profile: rankedProfile, rankChange }) => ({
				login: rankedProfile.login,
				rankChange,
			})),
		).toEqual([
			{ login: "b", rankChange: 1 },
			{ login: "a", rankChange: -1 },
		]);
	});

	it("does not invent a percentage increase from a zero baseline", () => {
		const [entry] = scoreProfiles(
			[profile("new", { commits: 500 }, { commits: 0 })],
			{ ...rankingLenses.rising, weights: { commits: 1 } },
		);
		expect(entry?.breakdown[0]?.changePercent).toBeNull();
	});
});
