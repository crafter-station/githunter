export const rankingScopes = {
	peru: { name: "Peru", adjective: "Peruvian", locale: "en-PE" },
	colombia: { name: "Colombia", adjective: "Colombian", locale: "en-CO" },
	venezuela: { name: "Venezuela", adjective: "Venezuelan", locale: "en-VE" },
	bolivia: { name: "Bolivia", adjective: "Bolivian", locale: "en-BO" },
	chile: { name: "Chile", adjective: "Chilean", locale: "en-CL" },
	ecuador: { name: "Ecuador", adjective: "Ecuadorian", locale: "en-EC" },
	argentina: { name: "Argentina", adjective: "Argentine", locale: "en-AR" },
	brazil: { name: "Brazil", adjective: "Brazilian", locale: "en-BR" },
	mexico: { name: "Mexico", adjective: "Mexican", locale: "en-MX" },
} as const;

export type RankingScope = keyof typeof rankingScopes;

export function isRankingScope(value: string): value is RankingScope {
	return value in rankingScopes;
}

export function getRankingScope(scope: RankingScope) {
	return rankingScopes[scope];
}
