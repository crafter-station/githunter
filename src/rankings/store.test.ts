import { getBundledDataset } from "./data";
import { rankingLenses } from "./lenses";
import { buildRankingSnapshot } from "./score";
import { isRankingSnapshot, selectFreshestSnapshot } from "./store";

describe("ranking snapshot selection", () => {
	it("keeps a newer bundled snapshot over stale remote caches", () => {
		const bundled = buildRankingSnapshot(
			getBundledDataset("peru"),
			rankingLenses.balanced,
		);
		const staleRemote = {
			...bundled,
			generatedAt: "2026-01-01T00:00:00.000Z",
			cache: "redis" as const,
		};

		expect(selectFreshestSnapshot([staleRemote, bundled])).toBe(bundled);
	});

	it("prefers a newer version-compatible remote snapshot", () => {
		const bundled = buildRankingSnapshot(
			getBundledDataset("peru"),
			rankingLenses.balanced,
		);
		const newerRemote = {
			...bundled,
			generatedAt: "2027-01-01T00:00:00.000Z",
			cache: "database" as const,
		};

		expect(selectFreshestSnapshot([bundled, newerRemote])).toBe(newerRemote);
	});

	it("rejects malformed or mismatched cached snapshots", () => {
		const snapshot = buildRankingSnapshot(
			getBundledDataset("peru"),
			rankingLenses.balanced,
		);
		expect(isRankingSnapshot(snapshot, "peru", "balanced", "1.0.0")).toBe(true);
		expect(
			isRankingSnapshot(
				{ ...snapshot, entries: [{ rank: 1 }] },
				"peru",
				"balanced",
				"1.0.0",
			),
		).toBe(false);
		expect(isRankingSnapshot(snapshot, "peru", "balanced", "2.0.0")).toBe(
			false,
		);
	});
});
