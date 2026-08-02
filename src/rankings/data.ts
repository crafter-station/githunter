import peruDataset from "./data/peru-baseline.json";
import type { RankingDataset } from "./types";

export const bundledDatasets = {
	peru: peruDataset as RankingDataset,
};

export type RankingScope = keyof typeof bundledDatasets;

export function isRankingScope(value: string): value is RankingScope {
	return value in bundledDatasets;
}

export function getBundledDataset(scope: RankingScope) {
	return bundledDatasets[scope];
}
