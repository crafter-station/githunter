import { config } from "dotenv";
config({ path: ".env.test" });

import { describe, expect, it } from "@jest/globals";
import {
	GithubService,
	type RepoDetails,
	type RepoSummary,
	type UserProfile,
} from "../src/services/github-scrapper";

describe("GithubService Integration Tests", () => {
	const repo = new GithubService();
	// You can override these in .env.test if needed
	const TEST_USER = process.env.TEST_GITHUB_USER || "octocat";
	const TEST_REPO = process.env.TEST_REPO_NAME || "Hello-World";

	it("should fetch a valid user profile", async () => {
		const profile: UserProfile = await repo.getUserInfo(TEST_USER);
		console.log(
			`getUserInfo(${TEST_USER}) = `,
			JSON.stringify(profile, null, 2),
		);

		expect(profile.login.toLowerCase()).toBe(TEST_USER.toLowerCase());
		expect(typeof profile.publicRepos).toBe("number");
		expect(typeof profile.starsCount).toBe("number");
		expect(profile.publicRepos).toBeGreaterThanOrEqual(0);
	});

	it("should calculate total stars for the user", async () => {
		// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
		const stars: number = await (repo as any).getTotalStars(TEST_USER);
		console.log(`getTotalStars(${TEST_USER}) = `, stars);

		expect(typeof stars).toBe("number");
		expect(stars).toBeGreaterThanOrEqual(0);
	});

	it("should fetch the top N repositories by stars", async () => {
		const top5: RepoSummary[] = await repo.getTopRepos(TEST_USER, 5);
		console.log(`getTopRepos(${TEST_USER}, 5) = `, top5);

		expect(Array.isArray(top5)).toBe(true);
		expect(top5).toHaveLength(5);

		for (const r of top5) {
			expect(r.name).toBeTruthy();
			expect(typeof r.stars).toBe("number");
		}
	});

	it("should fetch repository details including readme, languages, and file tree", async () => {
		const details: RepoDetails = await repo.getRepoDetails(
			TEST_USER,
			TEST_REPO,
		);
		console.log(
			`getRepoDetails(${TEST_USER}, ${TEST_REPO}) = `,
			JSON.stringify(details, null, 2),
		);

		expect(typeof details.readme).toBe("string");
		expect(Array.isArray(details.languages)).toBe(true);
		expect(typeof details.tree).toBe("string");
		expect(details.tree.length).toBeGreaterThan(0);
	});

	it("should fetch the top N repositories by stars including organization repositories", async () => {
		const top5: RepoSummary[] = await repo.getTopReposIncludingOrgs(
			TEST_USER,
			5,
		);
		console.log(`getTopReposIncludingOrgs(${TEST_USER}, 5) = `, top5);

		expect(Array.isArray(top5)).toBe(true);
		expect(top5).toHaveLength(5);

		for (const r of top5) {
			expect(r.name).toBeTruthy();
			expect(typeof r.stars).toBe("number");
		}
	});
});
