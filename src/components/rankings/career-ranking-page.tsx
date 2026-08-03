import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { CareerTable } from "@/components/rankings/career-table";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingHeroStats } from "@/components/rankings/ranking-hero-stats";
import { getRankingScope, isRankingScope } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { getLadderStandings } from "@/rankings/season-store";
import { getSeason } from "@/rankings/seasons";
import type { LensId } from "@/rankings/types";
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
	const scopeInfo = getRankingScope(scope);
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
			: `GitHub careers in ${scopeInfo.name}.`;
	const description =
		mode === "form"
			? "A rolling four-season view that rewards sustained momentum without erasing new challengers."
			: `Season points, championships, podiums, and the permanent public record of GitHub builders in ${scopeInfo.name}.`;

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
			<PublicHeader scope={scope} />
			<main>
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								{scopeInfo.name} / {mode === "form" ? "form" : "all-time"}
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
						scope={scope}
					/>
					<CareerTable standings={standings} mode={mode} />
				</div>
			</main>
			<Footer scope={scope} />
		</div>
	);
}
