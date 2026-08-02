import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { RankingTable } from "@/components/rankings/ranking-table";
import { isRankingScope } from "@/rankings/data";
import { metricLabels, rankingLenses } from "@/rankings/lenses";
import { getRankingCanonical, getRankingSeo, siteUrl } from "@/rankings/seo";
import { getRankingSnapshot } from "@/rankings/store";
import type { LensId } from "@/rankings/types";
import {
	CalendarDays,
	CheckCircle2,
	Database,
	Github,
	Info,
	ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(value));
}

export async function RankingReportPage({
	scope,
	lens,
}: {
	scope: string;
	lens: LensId;
}) {
	if (!isRankingScope(scope)) notFound();
	const snapshot = await getRankingSnapshot(scope, lens);
	const seo = getRankingSeo(lens);
	const canonicalPath = getRankingCanonical(scope, lens);
	const canonicalUrl = new URL(canonicalPath, siteUrl).toString();
	const weights = Object.entries(snapshot.lens.weights).sort(
		([, left], [, right]) => (right ?? 0) - (left ?? 0),
	);
	const structuredData = [
		{
			"@context": "https://schema.org",
			"@type": "CollectionPage",
			name: seo.heading,
			description: seo.description,
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
					name: "Peru GitHub rankings",
					item: new URL("/peru", siteUrl).toString(),
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
			<PublicHeader />
			<main>
				<script type="application/ld+json">
					{JSON.stringify(structuredData)}
				</script>
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								Peru / {snapshot.lens.shortName}
							</div>
							<h1>{seo.heading}</h1>
							<p className={styles.heroCopy}>{seo.description}</p>
						</div>
						<div className={styles.heroMeta}>
							<div>
								<Database aria-hidden="true" />
								<span>Public cohort</span>
								<strong>{snapshot.cohort.scored} profiles</strong>
							</div>
							<div>
								<CalendarDays aria-hidden="true" />
								<span>Last generated</span>
								<strong>{formatDate(snapshot.generatedAt)}</strong>
							</div>
							<div>
								<ShieldCheck aria-hidden="true" />
								<span>Method</span>
								<strong>Lens v{snapshot.lens.version}</strong>
							</div>
						</div>
					</div>
				</section>

				<div className={`${styles.content} ${styles.body}`}>
					<nav aria-label="Ranking lenses" className={styles.lensNav}>
						{Object.values(rankingLenses).map((definition) => (
							<Link
								key={definition.id}
								href={getRankingCanonical(scope, definition.id)}
								aria-current={definition.id === lens ? "page" : undefined}
							>
								{definition.shortName}
							</Link>
						))}
					</nav>

					<RankingTable
						initialEntries={snapshot.entries.slice(0, 50)}
						lensId={lens}
						lensName={snapshot.lens.shortName}
						scope={scope}
						scopeName={snapshot.scopeName}
						total={snapshot.entries.length}
					/>

					<section
						id="methodology"
						aria-labelledby="lens-title"
						className={styles.lensIntro}
					>
						<div className={styles.reading}>
							<p className={styles.sectionLabel}>How this ranking works</p>
							<h2 id="lens-title">{snapshot.lens.name} lens</h2>
							<p className={styles.question}>{snapshot.lens.question}</p>
							<p>{snapshot.lens.description}</p>
						</div>
						<div className={styles.weights}>
							<p className={styles.sectionLabel}>Weight profile</p>
							{weights.map(([metric, weight]) => (
								<div key={metric} className={styles.weightRow}>
									<span>
										{metricLabels[metric as keyof typeof metricLabels]}
									</span>
									<span
										className={styles.weightTrack}
										role="img"
										aria-label={`${metricLabels[metric as keyof typeof metricLabels]} weight ${(weight ?? 0) * 100} percent`}
									>
										<span style={{ width: `${(weight ?? 0) * 100}%` }} />
									</span>
									<strong>{(weight ?? 0) * 100}%</strong>
								</div>
							))}
						</div>
					</section>

					<section className={styles.evidenceGrid}>
						<div>
							<CheckCircle2 aria-hidden="true" />
							<h2>How the score works</h2>
							<p>
								Each metric is converted to a cohort percentile before applying
								the published weight. This limits outliers and keeps different
								units comparable. Confidence reflects the evidence windows
								available to a lens. An observed zero remains a real zero.
							</p>
						</div>
						<div>
							<Info aria-hidden="true" />
							<h2>Evidence boundary</h2>
							<p>
								Public activity runs from {formatDate(snapshot.period.from)} to{" "}
								{formatDate(snapshot.period.to)}. GitHub location is
								self-reported, and private work is excluded. The cohort combines
								follower discovery with public activity rankings and removes
								clear location contradictions and cross-country spam.
							</p>
						</div>
					</section>

					<details className={styles.details}>
						<summary>Sources, limitations, and API</summary>
						<div className={styles.detailsGrid}>
							<div>
								<h3>Sources</h3>
								<ul>
									{snapshot.sources.map((source) => (
										<li key={source}>{source}</li>
									))}
								</ul>
							</div>
							<div>
								<h3>Limitations</h3>
								<ul>
									{snapshot.limitations.map((limitation) => (
										<li key={limitation}>{limitation}</li>
									))}
								</ul>
							</div>
						</div>
						<a href={`/api/rankings/${scope}/${lens}`}>
							<Github aria-hidden="true" />
							Open the reproducible JSON snapshot
						</a>
					</details>
				</div>
			</main>
			<Footer />
		</div>
	);
}
