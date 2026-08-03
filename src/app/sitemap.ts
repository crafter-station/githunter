import { getBundledDataset } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { serializeRankingFilters } from "@/rankings/query-state";
import { getSeason } from "@/rankings/seasons";
import { getRankingCanonical, siteUrl } from "@/rankings/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
	const dataset = getBundledDataset("peru");
	const lastModified = new Date(dataset.generatedAt);
	const rankingPages = Object.values(rankingLenses).map((lens) => ({
		url: new URL(getRankingCanonical("peru", lens.id), siteUrl).toString(),
		lastModified,
		changeFrequency: "daily" as const,
		priority: lens.id === "balanced" ? 1 : 0.9,
	}));
	const profilePages = dataset.profiles.map((profile) => ({
		url: new URL(`/developer/${profile.login}`, siteUrl).toString(),
		lastModified,
		changeFrequency: "weekly" as const,
		priority: 0.7,
	}));
	const season = getSeason(lastModified);
	const seasonPages = ["2026-q1", "2026-q2", season.id.toLowerCase()].map(
		(seasonId) => ({
			url: new URL(
				serializeRankingFilters("/peru", {
					view: "season",
					season: seasonId.toUpperCase(),
				}),
				siteUrl,
			).toString(),
			lastModified,
			changeFrequency:
				seasonId === season.id.toLowerCase()
					? ("daily" as const)
					: ("monthly" as const),
			priority: 0.8,
		}),
	);
	const ladderPages = [
		{
			path: serializeRankingFilters("/peru", { view: "form" }),
			priority: 0.85,
		},
		{
			path: serializeRankingFilters("/peru", { view: "all-time" }),
			priority: 0.85,
		},
	].map(({ path, priority }) => ({
		url: new URL(path, siteUrl).toString(),
		lastModified,
		changeFrequency: "daily" as const,
		priority,
	}));

	return [
		{
			url: siteUrl,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		...rankingPages,
		...ladderPages,
		...seasonPages,
		...profilePages,
	];
}
