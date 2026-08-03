export const rankingScopes = {
	peru: { name: "Peru", adjective: "Peruvian", locale: "en-PE" },
	colombia: { name: "Colombia", adjective: "Colombian", locale: "en-CO" },
} as const;

export type RankingScope = keyof typeof rankingScopes;

export function isRankingScope(value: string): value is RankingScope {
	return value in rankingScopes;
}

export function getRankingScope(scope: RankingScope) {
	return rankingScopes[scope];
}
