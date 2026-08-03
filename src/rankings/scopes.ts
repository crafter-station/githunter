export const rankingScopes = {
	peru: { name: "Peru", adjective: "Peruvian", locale: "en-PE", code: "pe" },
	colombia: {
		name: "Colombia",
		adjective: "Colombian",
		locale: "en-CO",
		code: "co",
	},
	venezuela: {
		name: "Venezuela",
		adjective: "Venezuelan",
		locale: "en-VE",
		code: "ve",
	},
	bolivia: {
		name: "Bolivia",
		adjective: "Bolivian",
		locale: "en-BO",
		code: "bo",
	},
	chile: { name: "Chile", adjective: "Chilean", locale: "en-CL", code: "cl" },
	ecuador: {
		name: "Ecuador",
		adjective: "Ecuadorian",
		locale: "en-EC",
		code: "ec",
	},
	argentina: {
		name: "Argentina",
		adjective: "Argentine",
		locale: "en-AR",
		code: "ar",
	},
	brazil: {
		name: "Brazil",
		adjective: "Brazilian",
		locale: "en-BR",
		code: "br",
	},
	mexico: {
		name: "Mexico",
		adjective: "Mexican",
		locale: "en-MX",
		code: "mx",
	},
} as const;

export type RankingScope = keyof typeof rankingScopes;

export function isRankingScope(value: string): value is RankingScope {
	return value in rankingScopes;
}

export function getRankingScope(scope: RankingScope) {
	return rankingScopes[scope];
}
