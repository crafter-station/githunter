import styles from "@/app/rankings/[scope]/historical-record.module.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { LatamSignalField } from "@/components/home/latam-signal-field";
import { isRankingScope } from "@/rankings/data";
import { buildHistoricalRecord } from "@/rankings/history";
import { metricLabels, rankingLenses } from "@/rankings/lenses";
import { buildSignalProfiles } from "@/rankings/signals";
import { getRankingSnapshot } from "@/rankings/store";
import { ArrowDown, ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatNumber(value: number) {
	return new Intl.NumberFormat("en-US").format(value);
}

function formatWindow(period: { from: string; to: string }) {
	const formatter = new Intl.DateTimeFormat("en", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
	return `${formatter.format(new Date(period.from))} – ${formatter.format(new Date(period.to))}`;
}

export default async function HistoricalRecordPage({
	scope,
}: {
	scope: string;
}) {
	if (!isRankingScope(scope)) notFound();

	const snapshot = await getRankingSnapshot(scope, "balanced");
	const history = buildHistoricalRecord({
		period: snapshot.period,
		previousPeriod: snapshot.previousPeriod,
		profiles: snapshot.entries.map((entry) => entry.profile),
	});
	if (!history) notFound();
	const profiles = buildSignalProfiles(snapshot.entries);

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
						<div className={styles.heroContent}>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								Peru / historical record
							</div>
							<h1>A public record of GitHub work in Peru.</h1>
							<p className="vbg-lede">
								See how public contribution changes over time, then choose the
								lens that matches what you mean by impact.
							</p>
							<div className={styles.actions}>
								<Link
									href="#historical-record"
									className={`${styles.action} ${styles.actionPrimary}`}
								>
									Explore the record <ArrowDown aria-hidden="true" />
								</Link>
								<Link
									href={`/rankings/${scope}/balanced`}
									className={styles.action}
								>
									Open current rankings <ArrowRight aria-hidden="true" />
								</Link>
							</div>
						</div>
						<LatamSignalField
							className={styles.heroField}
							profiles={profiles}
						/>
					</div>
				</section>

				<section id="historical-record" className={styles.section}>
					<div className={styles.content}>
						<div className={styles.sectionHeader}>
							<div className={styles.reading}>
								<h2 className="vbg-heading-24">
									Two complete years. One comparable record.
								</h2>
								<p>
									Cohort totals across the same {history.profiles} public
									profiles. This is a view of the ecosystem, not a ranking of
									individuals.
								</p>
							</div>
							<p className="vbg-meta">
								{history.profiles} profiles in the record
							</p>
						</div>

						<div className={styles.periods}>
							<div className={styles.period}>
								<span className="vbg-label">Prior window</span>
								<span className="vbg-meta">
									{formatWindow(history.previousPeriod)}
								</span>
							</div>
							<div className={`${styles.period} ${styles.periodCurrent}`}>
								<span className="vbg-label">Current window</span>
								<span className="vbg-meta">{formatWindow(history.period)}</span>
							</div>
						</div>

						<figure className="vbg-chart">
							<div className={`vbg-table-wrap ${styles.tableWrap}`}>
								<table>
									<caption className="vbg-visually-hidden">
										Aggregate public GitHub activity across two comparable
										annual windows
									</caption>
									<thead>
										<tr>
											<th scope="col">Metric</th>
											<th scope="col">Prior window</th>
											<th scope="col">Current window</th>
											<th scope="col">Change</th>
										</tr>
									</thead>
									<tbody>
										{history.metrics.map((metric) => {
											const maximum = Math.max(metric.current, metric.previous);
											return (
												<tr key={metric.metric}>
													<th scope="row">{metricLabels[metric.metric]}</th>
													<td data-label="Prior window">
														<span className="vbg-numeric">
															{formatNumber(metric.previous)}
														</span>
														<span className={styles.bar} aria-hidden="true">
															<span
																className={styles.barPrevious}
																style={{
																	width: `${(metric.previous / maximum) * 100}%`,
																}}
															/>
														</span>
													</td>
													<td data-label="Current window">
														<span className="vbg-numeric">
															{formatNumber(metric.current)}
														</span>
														<span className={styles.bar} aria-hidden="true">
															<span
																className={styles.barCurrent}
																style={{
																	width: `${(metric.current / maximum) * 100}%`,
																}}
															/>
														</span>
													</td>
													<td data-label="Change" className="vbg-numeric">
														{metric.changePercent === null
															? "No baseline"
															: `+${metric.changePercent}%`}
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
							<figcaption className="vbg-caption">
								Activity increased across all three comparable signals. This
								record describes public volume, not the quality or substance of
								each contribution.
							</figcaption>
						</figure>

						<p className="vbg-note">
							Stars, forks, followers, and external repositories are
							current-state signals, not historical change. They are excluded
							from this comparison.
						</p>
					</div>
				</section>

				<section id="methodology" className={styles.section}>
					<div className={styles.content}>
						<div className={styles.reading}>
							<h2 className="vbg-heading-24">
								Choose the question before the winner.
							</h2>
							<p>
								There is no hidden universal score. Each lens publishes the
								question, metrics, weights, evidence window, and limitations
								used to order the same public cohort.
							</p>
						</div>

						<div className={styles.lensList}>
							{Object.values(rankingLenses).map((lens) => (
								<Link
									key={lens.id}
									href={`/rankings/${scope}/${lens.id}`}
									className={styles.lensRow}
								>
									<span className="vbg-heading-16">{lens.shortName}</span>
									<span>{lens.question}</span>
									<ArrowRight aria-hidden="true" />
								</Link>
							))}
						</div>

						<div className={styles.metadata}>
							<p className="vbg-meta">
								Generated{" "}
								{new Date(snapshot.generatedAt).toLocaleDateString("en-US", {
									day: "numeric",
									month: "long",
									year: "numeric",
									timeZone: "UTC",
								})}
							</p>
							<a href={`/api/rankings/${scope}/balanced`}>
								Open the reproducible JSON <ArrowRight aria-hidden="true" />
							</a>
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
