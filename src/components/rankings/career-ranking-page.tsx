import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { CareerTable } from "@/components/rankings/career-table";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingHeroStats } from "@/components/rankings/ranking-hero-stats";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { getRankingScope, isRankingScope } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { getLadderStandings } from "@/rankings/season-store";
import { firstOfficialSeasonId, getSeason } from "@/rankings/seasons";
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
	const formUnavailable = mode === "form" && seasons.length < 2;
	const allTimeUnavailable = mode === "all-time" && closedSeasons === 0;
	const historyUnavailable = formUnavailable || allTimeUnavailable;
	const title =
		mode === "form"
			? formUnavailable
				? "Form needs more than one season."
				: "Who is in form right now?"
			: allTimeUnavailable
				? "The permanent record starts with an official season."
				: `GitHub careers in ${scopeInfo.name}.`;
	const description =
		mode === "form"
			? formUnavailable
				? `Only one ${scopeInfo.name} season is available. Form will open after another comparable quarter is indexed.`
				: "A rolling four-season view that rewards sustained momentum without erasing new challengers."
			: allTimeUnavailable
				? `Preseason and reconstructed quarters inform Form, but they do not manufacture championships or career points. All-time opens after ${firstOfficialSeasonId} closes.`
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
									label: historyUnavailable ? "Status" : "Leader",
									value: historyUnavailable
										? formUnavailable
											? "Needs history"
											: "Not started"
										: champion
											? `@${champion.profile.login}`
											: "Open",
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
					{historyUnavailable ? (
						<section id="ranking" className="py-6">
							<Empty className="border">
								<EmptyHeader>
									<EmptyTitle>
										{formUnavailable
											? "Not enough history for Form"
											: "No official career standings yet"}
									</EmptyTitle>
									<EmptyDescription>
										{formUnavailable ? (
											<>
												Form compares at least two equivalent quarters. Use
												Season for the current standings while the history is
												indexed.
											</>
										) : (
											<>
												The first all-time points will be awarded when{" "}
												{firstOfficialSeasonId} closes. Until then, use Season
												for the live quarter or Form for reconstructed momentum.
											</>
										)}
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</section>
					) : (
						<CareerTable standings={standings} mode={mode} />
					)}
				</div>
			</main>
			<Footer scope={scope} />
		</div>
	);
}
