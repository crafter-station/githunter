import { CareerRankingPage } from "@/components/rankings/career-ranking-page";
import { RankingReportPage } from "@/components/rankings/ranking-report-page";
import { SeasonRankingPage } from "@/components/rankings/season-ranking-page";
import { type RankingScope, getRankingScope } from "@/rankings/data";
import {
	loadRankingFilters,
	serializeRankingFilters,
} from "@/rankings/query-state";
import { getSeason, isSeasonId } from "@/rankings/seasons";
import { getRankingSeo, siteUrl } from "@/rankings/seo";
import type { Metadata } from "next";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function getCountryRankingMetadata(
	scope: RankingScope,
	searchParams: SearchParams,
): Promise<Metadata> {
	const filters = await loadRankingFilters(searchParams);
	const scopeInfo = getRankingScope(scope);
	const requestedSeason = filters.season?.toUpperCase();
	const seasonId =
		requestedSeason && isSeasonId(requestedSeason)
			? requestedSeason
			: getSeason().id;
	const canonical = serializeRankingFilters(`/${scope}`, {
		...filters,
		season: filters.view === "season" ? seasonId : null,
	});
	const seo = getRankingSeo(filters.lens, scope);
	const title =
		filters.view === "form"
			? `${scopeInfo.name} GitHub Form Ranking | GitHunter`
			: filters.view === "all-time"
				? `${scopeInfo.name} GitHub All-Time Ranking | GitHunter`
				: filters.view === "season"
					? `${seasonId} ${scopeInfo.name} GitHub Season | GitHunter`
					: seo.title;
	const description =
		filters.view === "form"
			? `Track the strongest four-quarter form among public GitHub developers in ${scopeInfo.name}.`
			: filters.view === "all-time"
				? `Explore career points, championships, podiums, and the historical GitHub record for ${scopeInfo.name}.`
				: filters.view === "season"
					? `Explore the complete ${seasonId} GitHub season standings for ${scopeInfo.name}.`
					: seo.description;
	return {
		title: { absolute: title },
		description,
		alternates: { canonical },
		openGraph: {
			title,
			description,
			url: new URL(canonical, siteUrl).toString(),
			type: "website",
		},
		twitter: { card: "summary", title, description },
	};
}

export async function CountryRankingRoute({
	scope,
	searchParams,
}: {
	scope: RankingScope;
	searchParams: SearchParams;
}) {
	const filters = await loadRankingFilters(searchParams);
	if (filters.view === "form" || filters.view === "all-time") {
		return (
			<CareerRankingPage
				scope={scope}
				lensId={filters.lens}
				mode={filters.view}
			/>
		);
	}
	if (filters.view === "season") {
		const seasonId = filters.season?.toUpperCase() ?? getSeason().id;
		return (
			<SeasonRankingPage
				scope={scope}
				seasonId={isSeasonId(seasonId) ? seasonId : getSeason().id}
				lensId={filters.lens}
			/>
		);
	}
	return <RankingReportPage scope={scope} lens={filters.lens} />;
}
