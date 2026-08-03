import {
	isGithubLogin,
	matchesRankingScopeLocation,
	normalizeGithubLogin,
} from "./candidates";
import type { RankingScope } from "./scopes";

describe("ranking candidate usernames", () => {
	it("normalizes GitHub handles", () => {
		expect(normalizeGithubLogin(" @Railly ")).toBe("railly");
	});

	it("rejects values that are not GitHub usernames", () => {
		expect(isGithubLogin("cuevaio")).toBe(true);
		expect(isGithubLogin("bad/user")).toBe(false);
		expect(isGithubLogin("-invalid")).toBe(false);
	});

	it.each([
		["peru", "Lima, Perú"],
		["colombia", "Medellín, Colombia"],
		["venezuela", "Caracas, Venezuela"],
		["bolivia", "Cochabamba, Bolivia"],
		["chile", "Santiago, Chile"],
		["ecuador", "Quito, Ecuador"],
		["argentina", "Córdoba, Argentina"],
		["brazil", "São Paulo, Brasil"],
		["mexico", "Ciudad de México"],
	] satisfies Array<[RankingScope, string]>)(
		"maps public locations to the %s ranking",
		(scope, location) => {
			expect(matchesRankingScopeLocation(location, scope)).toBe(true);
			expect(matchesRankingScopeLocation("Berlin, Germany", scope)).toBe(false);
		},
	);

	it.each([
		["argentina", "Cordoba, Colombia"],
		["chile", "Santiago de Cali (Colombia)"],
		["bolivia", "Chile, San Pedro de la Paz"],
		["chile", "Santiago del Estero, Argentina"],
	] satisfies Array<[RankingScope, string]>)(
		"prioritizes explicit countries over ambiguous cities for %s",
		(scope, location) => {
			expect(matchesRankingScopeLocation(location, scope)).toBe(false);
		},
	);

	it("allows a profile that explicitly declares two launch countries", () => {
		expect(matchesRankingScopeLocation("Peru, Argentina", "peru")).toBe(true);
		expect(matchesRankingScopeLocation("Peru, Argentina", "argentina")).toBe(
			true,
		);
	});
});
