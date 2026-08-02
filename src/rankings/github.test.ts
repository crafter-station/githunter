import { createEvidenceWindows, readBatchProfiles } from "./github";

describe("GitHub ranking evidence windows", () => {
	it("creates adjacent non-overlapping UTC calendar years", () => {
		const windows = createEvidenceWindows(new Date("2026-08-02T09:05:42.993Z"));
		expect(windows.generatedAt).toBe("2026-08-02T09:05:42.993Z");
		expect(windows.period).toEqual({
			from: "2025-08-03T00:00:00.000Z",
			to: "2026-08-02T23:59:59.999Z",
		});
		expect(windows.previousPeriod).toEqual({
			from: "2024-08-03T00:00:00.000Z",
			to: "2025-08-02T23:59:59.999Z",
		});
		expect(new Date(windows.previousPeriod.to).getTime() + 1).toBe(
			new Date(windows.period.from).getTime(),
		);
	});

	it("keeps valid users when GitHub reports a partial batch error", () => {
		const contributions = {
			contributionCalendar: { totalContributions: 12 },
			restrictedContributionsCount: 2,
			totalCommitContributions: 8,
			totalIssueContributions: 1,
			totalPullRequestContributions: 2,
			totalPullRequestReviewContributions: 1,
		};
		const profiles = readBatchProfiles(
			{
				data: {
					u0: {
						login: "valid",
						name: "Valid User",
						location: "Peru",
						avatarUrl: "https://avatars.githubusercontent.com/valid",
						followers: { totalCount: 3 },
						repositories: {
							nodes: [{ stargazerCount: 5, forkCount: 2 }],
						},
						repositoriesContributedTo: { totalCount: 4 },
						current: contributions,
						previous: contributions,
					},
					u1: null,
					m0: { issueCount: 2 },
					pm0: { issueCount: 1 },
				},
				errors: [{ message: "Could not resolve to a User" }],
			},
			["valid", "renamed"],
		);

		expect(profiles).toHaveLength(1);
		expect(profiles[0]?.login).toBe("valid");
		expect(profiles[0]?.metrics.publicContributions).toBe(10);
	});
});
