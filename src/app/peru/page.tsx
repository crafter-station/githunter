import { CareerRankingPage } from "@/components/rankings/career-ranking-page";
import { RankingReportPage } from "@/components/rankings/ranking-report-page";
import { SeasonRankingPage } from "@/components/rankings/season-ranking-page";
import {
	loadRankingFilters,
	serializeRankingFilters,
} from "@/rankings/query-state";
import { getSeason, isSeasonId } from "@/rankings/seasons";
import { getRankingSeo, siteUrl } from "@/rankings/seo";
import type { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
	const filters = await loadRankingFilters(searchParams);
	const requestedSeason = filters.season?.toUpperCase();
	const seasonId =
		requestedSeason && isSeasonId(requestedSeason)
			? requestedSeason
			: getSeason().id;
	const canonical = serializeRankingFilters("/peru", {
		...filters,
		season: filters.view === "season" ? seasonId : null,
	});
	const seo = getRankingSeo(filters.lens);
	const title =
		filters.view === "form"
			? "Peru GitHub Form Ranking | GitHunter"
			: filters.view === "all-time"
				? "Peru GitHub All-Time Ranking | GitHunter"
				: filters.view === "season"
					? `${seasonId} Peru GitHub Season | GitHunter`
					: seo.title;
	const description =
		filters.view === "form"
			? "Track the strongest four-quarter form among public GitHub developers in Peru."
			: filters.view === "all-time"
				? "Explore career points, championships, podiums, and the historical GitHub ladder for Peru."
				: filters.view === "season"
					? `Explore the complete ${seasonId} GitHub Ladder standings for Peru.`
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

export default async function PeruPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	const filters = await loadRankingFilters(searchParams);
	if (filters.view === "form" || filters.view === "all-time") {
		return (
			<CareerRankingPage
				scope="peru"
				lensId={filters.lens}
				mode={filters.view}
			/>
		);
	}
	if (filters.view === "season") {
		const seasonId = filters.season?.toUpperCase() ?? getSeason().id;
		return (
			<SeasonRankingPage
				scope="peru"
				seasonId={isSeasonId(seasonId) ? seasonId : getSeason().id}
				lensId={filters.lens}
			/>
		);
	}
	return <RankingReportPage scope="peru" lens={filters.lens} />;
}
