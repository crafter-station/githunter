import { loadRankingFilters, serializeRankingFilters } from "./query-state";

describe("ranking query state", () => {
	it("parses composed view, lens, and season filters", () => {
		expect(
			loadRankingFilters({
				view: "season",
				lens: "builder",
				season: "2026-Q2",
			}),
		).toEqual({ view: "season", lens: "builder", season: "2026-Q2" });
	});

	it("serializes defaults away while preserving composed filters", () => {
		expect(
			serializeRankingFilters("/peru", {
				view: "season",
				lens: "maintainer",
				season: "2026-Q1",
			}),
		).toBe("/peru?view=season&lens=maintainer&season=2026-Q1");
		expect(
			serializeRankingFilters("/peru", {
				view: "current",
				lens: "balanced",
			}),
		).toBe("/peru");
	});
});
