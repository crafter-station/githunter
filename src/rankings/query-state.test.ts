import {
	loadRankingFilters,
	normalizeRankingFilterState,
	rankingCountryHref,
	serializeRankingFilters,
} from "./query-state";

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

	it.each([
		["current", "2026-Q2", null],
		["season", "2026-Q2", "2026-Q2"],
		["form", "2026-Q2", null],
		["all-time", "2026-Q2", null],
	] as const)(
		"normalizes the %s time state without attaching invalid seasons",
		(view, season, expectedSeason) => {
			expect(
				normalizeRankingFilterState({ view, lens: "balanced", season }),
			).toEqual({ view, lens: "balanced", season: expectedSeason });
		},
	);

	it("preserves aggregate views across countries and resets country archives", () => {
		expect(
			rankingCountryHref("colombia", "view=form&lens=builder&season=2026-Q2"),
		).toBe("/colombia?view=form&lens=builder");
		expect(
			rankingCountryHref("colombia", "view=season&season=2026-Q2&lens=builder"),
		).toBe("/colombia?lens=builder");
	});
});
