import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingHeroStats } from "@/components/rankings/ranking-hero-stats";
import { RankingTable } from "@/components/rankings/ranking-table";
import { getRankingScope, isRankingScope } from "@/rankings/data";
import { getRankingSeasons } from "@/rankings/season-store";
import { getSeason } from "@/rankings/seasons";
import { getRankingCanonical, getRankingSeo, siteUrl } from "@/rankings/seo";
import { getRankingSnapshot } from "@/rankings/store";
import type { LensId } from "@/rankings/types";
import { notFound } from "next/navigation";

export async function RankingReportPage({
	scope,
	lens,
}: {
	scope: string;
	lens: LensId;
}) {
	if (!isRankingScope(scope)) notFound();
	const [snapshot, seasons] = await Promise.all([
		getRankingSnapshot(scope, lens),
		getRankingSeasons(scope),
	]);
	const scopeInfo = getRankingScope(scope);
	const season = getSeason(new Date(snapshot.generatedAt));
	const seo = getRankingSeo(lens, scope);
	const canonicalPath = getRankingCanonical(scope, lens);
	const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
	const heading =
		lens === "balanced" ? `${scopeInfo.name} GitHub Rankings` : seo.heading;
	const description =
		lens === "balanced"
			? `Live ${season.label} standings for public GitHub builders in ${scopeInfo.name}. Search the complete indexed cohort, compare form, and follow the historical record.`
			: seo.description;
	const structuredData = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: heading,
			description,
			url: canonicalUrl,
			dateModified: snapshot.generatedAt,
			isPartOf: {
				"@type": "WebSite",
				name: "GitHunter",
				url: siteUrl,
			},
			mainEntity: {
				"@type": "ItemList",
				name: seo.heading,
				numberOfItems: snapshot.entries.length,
				itemListOrder: "https://schema.org/ItemListOrderAscending",
				itemListElement: snapshot.entries.slice(0, 10).map((entry) => ({
					"@type": "ListItem",
					position: entry.rank,
					item: {
						"@type": "Person",
						name: entry.profile.name || entry.profile.login,
						url: new URL(
							`/developer/${entry.profile.login}`,
							siteUrl,
						).toString(),
						image: entry.profile.avatarUrl,
						sameAs: `https://github.com/${entry.profile.login}`,
					},
				})),
			},
		},
		{
			"@context": "https://schema.org",
			"@type": "BreadcrumbList",
			itemListElement: [
				{
					"@type": "ListItem",
					position: 1,
					name: "GitHunter",
					item: siteUrl,
				},
				{
					"@type": "ListItem",
					position: 2,
					name: `${scopeInfo.name} GitHub rankings`,
					item: new URL(`/${scope}`, siteUrl).toString(),
				},
				...(lens === "balanced"
					? []
					: [
							{
								"@type": "ListItem",
								position: 3,
								name: snapshot.lens.name,
								item: canonicalUrl,
							},
						]),
			],
		},
	];

	return (
		<div className={`vbg-report ${styles.report}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#ranking">
				Skip to ranking
			</a>
			<PublicHeader scope={scope} />
			<main>
				<script type="application/ld+json">
					{JSON.stringify(structuredData)}
				</script>
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								{scopeInfo.name} / {snapshot.lens.shortName}
							</div>
							<h1>{heading}</h1>
							<p className={styles.heroCopy}>{description}</p>
						</div>
						<RankingHeroStats
							items={[
								{
									label: "Public cohort",
									value: `${snapshot.cohort.scored} profiles`,
								},
								{ label: "Current season", value: season.label },
								{ label: "Method", value: `Lens v${snapshot.lens.version}` },
							]}
						/>
					</div>
				</section>

				<div className={`${styles.content} ${styles.body}`}>
					<LadderNavigation
						active="current"
						season={season}
						seasons={seasons}
						lensId={lens}
						scope={scope}
					/>

					<RankingTable
						key={`${season.id}-${lens}`}
						initialEntries={snapshot.entries.slice(0, 50)}
						lensId={lens}
						lensName={snapshot.lens.shortName}
						scope={scope}
						scopeName={snapshot.scopeName}
						total={snapshot.entries.length}
						season={season}
					/>
				</div>
			</main>
			<Footer scope={scope} />
		</div>
	);
}
