import {
	createLoader,
	createSerializer,
	parseAsString,
	parseAsStringLiteral,
} from "nuqs/server";
import { lensIds } from "./types";

export const rankingViews = ["current", "form", "all-time", "season"] as const;

export type RankingView = (typeof rankingViews)[number];

export function rankingViewUsesSeason(view: RankingView) {
	return view === "current" || view === "season";
}

export function normalizeRankingFilterState({
	view,
	lens,
	season,
}: {
	view: RankingView;
	lens: (typeof lensIds)[number];
	season?: string | null;
}) {
	return {
		view,
		lens,
		season: view === "season" ? (season ?? null) : null,
	};
}

export function rankingCountryHref(scope: string, query: string) {
	const params = new URLSearchParams(query);
	const view = params.get("view") ?? "current";
	if (view === "season") {
		params.delete("view");
		params.delete("season");
	} else {
		params.delete("season");
	}
	const value = params.toString();
	return value ? `/${scope}?${value}` : `/${scope}`;
}

export const rankingFilterParsers = {
	view: parseAsStringLiteral(rankingViews).withDefault("current"),
	lens: parseAsStringLiteral(lensIds).withDefault("balanced"),
	season: parseAsString,
};

export const loadRankingFilters = createLoader(rankingFilterParsers);
export const serializeRankingFilters = createSerializer(rankingFilterParsers);
