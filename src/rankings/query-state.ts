import {
	createLoader,
	createSerializer,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";
import { lensIds } from "./types";

export const rankingViews = ["current", "form", "all-time", "season"] as const;

export type RankingView = (typeof rankingViews)[number];

export const rankingFilterParsers = {
	view: parseAsStringLiteral(rankingViews).withDefault("current"),
	lens: parseAsStringLiteral(lensIds).withDefault("balanced"),
	season: parseAsString,
};

export const loadRankingFilters = createLoader(rankingFilterParsers);
export const serializeRankingFilters = createSerializer(rankingFilterParsers);
