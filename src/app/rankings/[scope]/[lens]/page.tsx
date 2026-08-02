import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RankingTable } from "@/components/rankings/ranking-table";
import { isRankingScope } from "@/rankings/data";
import { isLensId, metricLabels, rankingLenses } from "@/rankings/lenses";
import { getRankingSnapshot } from "@/rankings/store";
import type { RankingEntry } from "@/rankings/types";
import {
	ArrowUpRight,
	CalendarDays,
	CheckCircle2,
	Database,
	Github,
	Info,
	ShieldCheck,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./ranking-page.module.css";

export const revalidate = 3600;

function compactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: value >= 1000 ? "compact" : "standard",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(value));
}

function TopDeveloper({ entry }: { entry: RankingEntry }) {
	const strongest = [...entry.breakdown]
		.sort((left, right) => right.points - left.points)
		.slice(0, 2);
	return (
		<Link
			href={`/developer/${entry.profile.login}`}
			aria-label={`View ${entry.profile.name || entry.profile.login} ranking profile`}
			className={styles.topDeveloper}
		>
			<span className={styles.topRank}>#{entry.rank}</span>
			<div className={styles.topIdentity}>
				<Image
					src={entry.profile.avatarUrl}
					alt=""
					width={56}
					height={56}
					className={styles.avatar}
					priority={entry.rank === 1}
				/>
				<div>
					<h3>
						{entry.profile.name || entry.profile.login}
						<ArrowUpRight aria-hidden="true" />
					</h3>
					<p>@{entry.profile.login}</p>
				</div>
			</div>
			<div className={styles.topFooter}>
				<div className={styles.topSignals}>
					{strongest.map((metric) => (
						<span key={metric.metric}>
							{metricLabels[metric.metric]}{" "}
							<strong>{compactNumber(metric.raw)}</strong>
						</span>
					))}
				</div>
				<div className={styles.topScore}>
					<strong>{entry.score.toFixed(2)}</strong>
					<span>score</span>
				</div>
			</div>
		</Link>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}): Promise<Metadata> {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) return {};
	const definition = rankingLenses[lens];
	return {
		title: `${definition.shortName} GitHub ranking in Peru | GitHunter`,
		description: `${definition.question} An evidence-backed ranking with transparent metrics, weights, and freshness.`,
		alternates: { canonical: `/rankings/${scope}/${lens}` },
	};
}

export default async function RankingPage({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}) {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) notFound();
	const snapshot = await getRankingSnapshot(scope, lens);
	const top = snapshot.entries.slice(0, 3);
	const weights = Object.entries(snapshot.lens.weights).sort(
		([, left], [, right]) => (right ?? 0) - (left ?? 0),
	);

	return (
		<div className={`vbg-report ${styles.report}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#main">
				Skip to content
			</a>
			<Header noSearch />
			<main id="main">
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								Peru / {snapshot.lens.shortName}
							</div>
							<h1>Public work. Explicit rules.</h1>
							<p className={styles.heroCopy}>
								GitHunter ranks observable GitHub work through versioned lenses,
								not a hidden universal score.
							</p>
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
								<span>Method version</span>
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
								href={`/rankings/${scope}/${definition.id}`}
								aria-current={definition.id === lens ? "page" : undefined}
							>
								{definition.shortName}
							</Link>
						))}
					</nav>

					<section aria-labelledby="lens-title" className={styles.lensIntro}>
						<div className={styles.reading}>
							<p className={styles.sectionLabel}>Current lens</p>
							<h2 id="lens-title">{snapshot.lens.name}</h2>
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

					<section aria-labelledby="leaders-title" className={styles.leaders}>
						<div className={styles.sectionHeading}>
							<p className={styles.sectionLabel}>Leaders</p>
							<h2 id="leaders-title">Top 3 in {snapshot.scopeName}</h2>
						</div>
						<div className={styles.topGrid}>
							{top.map((entry) => (
								<TopDeveloper key={entry.profile.login} entry={entry} />
							))}
						</div>
					</section>

					<RankingTable entries={snapshot.entries} lensId={lens} />

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
