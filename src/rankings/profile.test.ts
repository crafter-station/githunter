import { getBundledRankingProfile } from "./profile";

describe("bundled ranking profiles", () => {
	it("finds profiles case-insensitively across every lens", () => {
		const result = getBundledRankingProfile("railly");

		expect(result?.profile.login).toBe("Railly");
		expect(result?.rankings).toHaveLength(5);
		expect(
			result?.rankings.find(({ lens }) => lens.id === "balanced")?.entry.rank,
		).toBe(1);
	});

	it("returns null outside the bundled cohort", () => {
		expect(getBundledRankingProfile("not-a-real-ranking-user")).toBeNull();
	});
});
