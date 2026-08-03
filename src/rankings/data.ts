import argentinaDataset from "./data/argentina-baseline.json";
import boliviaDataset from "./data/bolivia-baseline.json";
import brazilDataset from "./data/brazil-baseline.json";
import chileDataset from "./data/chile-baseline.json";
import colombiaDataset from "./data/colombia-baseline.json";
import ecuadorDataset from "./data/ecuador-baseline.json";
import mexicoDataset from "./data/mexico-baseline.json";
import peruDataset from "./data/peru-baseline.json";
import venezuelaDataset from "./data/venezuela-baseline.json";
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
	venezuela: venezuelaDataset as RankingDataset,
	bolivia: boliviaDataset as RankingDataset,
	chile: chileDataset as RankingDataset,
	ecuador: ecuadorDataset as RankingDataset,
	argentina: argentinaDataset as RankingDataset,
	brazil: brazilDataset as RankingDataset,
	mexico: mexicoDataset as RankingDataset,
} satisfies Record<RankingScope, RankingDataset>;

export { getRankingScope, isRankingScope, rankingScopes };
export type { RankingScope };

export function getBundledDataset(scope: RankingScope) {
	return bundledDatasets[scope];
}
