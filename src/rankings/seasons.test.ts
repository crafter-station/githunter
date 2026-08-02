import { getBundledDataset } from "./data";
import { rankingLenses } from "./lenses";
import { buildRankingSnapshot } from "./score";
import { buildCareerStandings, getSeason } from "./seasons";
import type { RankingSeason, RankingSeasonResult } from "./types";

const snapshot = buildRankingSnapshot(
	getBundledDataset("peru"),
	rankingLenses.balanced,
);
const [first, second] = snapshot.entries;

function season(id: string, status: RankingSeason["status"]): RankingSeason {
	return {
		id,
		label: id.replace("-", " "),
		startsAt: "2026-01-01",
		endsAt: "2026-03-31",
		status,
		rulesetVersion: "1.0.0",
		closedAt: status === "closed" ? "2026-04-01T00:00:00.000Z" : null,
	};
}

function result({
	seasonId,
	entry,
	rank,
	score,
}: {
	seasonId: string;
	entry: typeof first;
	rank: number;
	score: number;
}): RankingSeasonResult {
	return {
		seasonId,
		scope: "peru",
		lensId: "balanced",
		lensVersion: "1.0.0",
		username: entry.profile.login,
		rank,
		score,
		confidence: 100,
		cohortSize: 2,
		entry: { ...entry, rank, score },
	};
}

describe("GitHub Ladder seasons", () => {
	it("marks the launch quarter as preseason and Q4 as official", () => {
		expect(getSeason(new Date("2026-08-02T00:00:00.000Z")).status).toBe(
			"preseason",
		);
		expect(getSeason(new Date("2026-10-02T00:00:00.000Z")).status).toBe(
			"active",
		);
	});

	it("separates career points from four-season form", () => {
		const seasons = [season("2026-Q3", "active"), season("2026-Q2", "closed")];
		const results = [
			result({ seasonId: "2026-Q2", entry: first, rank: 1, score: 90 }),
			result({ seasonId: "2026-Q3", entry: first, rank: 2, score: 70 }),
			result({ seasonId: "2026-Q2", entry: second, rank: 2, score: 80 }),
			result({ seasonId: "2026-Q3", entry: second, rank: 1, score: 100 }),
		];
		const allTime = buildCareerStandings({
			results,
			seasons,
			mode: "all-time",
		});
		const form = buildCareerStandings({ results, seasons, mode: "form" });

		expect(allTime[0].profile.login).toBe(first.profile.login);
		expect(allTime[0].careerPoints).toBe(90);
		expect(allTime[0].championships).toBe(1);
		expect(form[0].profile.login).toBe(second.profile.login);
		expect(form[0].formScore).toBe(90);
	});
});
