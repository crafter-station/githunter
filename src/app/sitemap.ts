import { getBundledDataset } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
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

	return [
		{
			url: siteUrl,
			lastModified,
			changeFrequency: "weekly",
			priority: 0.9,
		},
		...rankingPages,
		...profilePages,
	];
}
