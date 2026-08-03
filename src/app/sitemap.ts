import { getBundledDataset } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { serializeRankingFilters } from "@/rankings/query-state";
import { getSeason } from "@/rankings/seasons";
import { getRankingCanonical, siteUrl } from "@/rankings/seo";
import { getAvailableScopes, getRankingSnapshot } from "@/rankings/store";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const scopes = getAvailableScopes();
	const scopePages = scopes.flatMap((scope) => {
		const dataset = getBundledDataset(scope);
		const lastModified = new Date(dataset.generatedAt);
		const season = getSeason(lastModified);
		const seasonIds =
			scope === "peru" ? ["2026-Q1", "2026-Q2", season.id] : [season.id];
		return [
			...Object.values(rankingLenses).map((lens) => ({
				url: new URL(getRankingCanonical(scope, lens.id), siteUrl).toString(),
				lastModified,
				changeFrequency: "daily" as const,
				priority: lens.id === "balanced" ? 1 : 0.9,
			})),
			...[
				{ view: "form" as const, priority: 0.85 },
				{ view: "all-time" as const, priority: 0.85 },
			].map(({ view, priority }) => ({
				url: new URL(
					serializeRankingFilters(`/${scope}`, { view }),
					siteUrl,
				).toString(),
				lastModified,
				changeFrequency: "daily" as const,
				priority,
			})),
			...seasonIds.map((seasonId) => ({
				url: new URL(
					serializeRankingFilters(`/${scope}`, {
						view: "season",
						season: seasonId,
					}),
					siteUrl,
				).toString(),
				lastModified,
				changeFrequency:
					seasonId === season.id ? ("daily" as const) : ("monthly" as const),
				priority: 0.8,
			})),
		];
	});
	const profilePages = new Map<string, MetadataRoute.Sitemap[number]>();
	for (const scope of scopes) {
		const snapshot = await getRankingSnapshot(scope, "balanced");
		for (const entry of snapshot.entries) {
			const url = new URL(
				`/developer/${entry.profile.login}`,
				siteUrl,
			).toString();
			profilePages.set(url.toLowerCase(), {
				url,
				lastModified: new Date(snapshot.generatedAt),
				changeFrequency: "weekly",
				priority: 0.7,
			});
		}
	}

	return [
		{
			url: siteUrl,
			lastModified: new Date(),
			changeFrequency: "weekly",
			priority: 0.9,
		},
		{
			url: new URL("/methodology", siteUrl).toString(),
			lastModified: new Date(),
			changeFrequency: "monthly",
			priority: 0.8,
		},
		...scopePages,
		...profilePages.values(),
	];
}
