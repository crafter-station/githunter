import colombiaDataset from "./data/colombia-baseline.json";
import peruDataset from "./data/peru-baseline.json";
import {
	type RankingScope,
	getRankingScope,
	isRankingScope,
	rankingScopes,
} from "./scopes";
import type { RankingDataset } from "./types";

export const bundledDatasets = {
	peru: peruDataset as RankingDataset,
	colombia: colombiaDataset as RankingDataset,
};

export { getRankingScope, isRankingScope, rankingScopes };
export type { RankingScope };

export function getBundledDataset(scope: RankingScope) {
	return bundledDatasets[scope];
}
