import { isGithubLogin, normalizeGithubLogin } from "./candidates";

describe("ranking candidate usernames", () => {
	it("normalizes GitHub handles", () => {
		expect(normalizeGithubLogin(" @Railly ")).toBe("railly");
	});

	it("rejects values that are not GitHub usernames", () => {
		expect(isGithubLogin("cuevaio")).toBe(true);
		expect(isGithubLogin("bad/user")).toBe(false);
		expect(isGithubLogin("-invalid")).toBe(false);
	});
});
