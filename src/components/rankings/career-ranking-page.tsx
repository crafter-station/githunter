import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { CareerTable } from "@/components/rankings/career-table";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingHeroStats } from "@/components/rankings/ranking-hero-stats";
import { isRankingScope } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { getLadderStandings } from "@/rankings/season-store";
import { getSeason } from "@/rankings/seasons";
import type { LensId } from "@/rankings/types";
import { History, Trophy } from "lucide-react";
import { notFound } from "next/navigation";

export async function CareerRankingPage({
	scope,
	lensId,
	mode,
}: {
	scope: string;
	lensId: LensId;
	mode: "all-time" | "form";
}) {
	if (!isRankingScope(scope)) notFound();
	const { seasons, standings } = await getLadderStandings({
		scope,
		lensId,
		mode,
	});
	const season = seasons[0] ?? getSeason();
	const champion = standings[0];
	const closedSeasons = seasons.filter(
		(item) => item.status === "closed",
	).length;
	const title =
		mode === "form"
			? "Who is in form right now?"
			: "The GitHub careers of Peru.";
	const description =
		mode === "form"
			? "A rolling four-season view that rewards sustained momentum without erasing new challengers."
			: "Season points, championships, podiums, and the permanent public record of GitHub builders in Peru.";

	return (
		<div className={`vbg-report ${styles.report}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#ranking">
				Skip to standings
			</a>
			<PublicHeader />
			<main>
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								Peru / {mode === "form" ? "form" : "all-time"}
							</div>
							<h1>{title}</h1>
							<p className={styles.heroCopy}>{description}</p>
						</div>
						<RankingHeroStats
							items={[
								{
									label: "Leader",
									value: champion ? `@${champion.profile.login}` : "Open",
								},
								{ label: "Official seasons", value: String(closedSeasons) },
								{ label: "Lens", value: rankingLenses[lensId].shortName },
							]}
						/>
					</div>
				</section>

				<div className={`${styles.content} ${styles.body}`}>
					<LadderNavigation
						active={mode}
						season={season}
						seasons={seasons}
						lensId={lensId}
					/>
					<CareerTable standings={standings} mode={mode} />
					<section className={styles.evidenceGrid}>
						<div>
							<Trophy aria-hidden="true" />
							<h2>Championship record</h2>
							<p>
								Every closed quarter preserves its cohort, ruleset, score,
								winner, and full standings. A later methodology change never
								rewrites a past champion.
							</p>
						</div>
						<div>
							<History aria-hidden="true" />
							<h2>Career versus form</h2>
							<p>
								All-time rewards accumulated official season scores. Form uses
								the latest four available seasons so newer builders can compete
								without fabricated historical points.
							</p>
						</div>
					</section>
				</div>
			</main>
			<Footer />
		</div>
	);
}
