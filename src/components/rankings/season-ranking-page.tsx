import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingTable } from "@/components/rankings/ranking-table";
import { isRankingScope } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import { getSeasonLeaderboard } from "@/rankings/season-store";
import type { LensId } from "@/rankings/types";
import { CalendarDays, ShieldCheck, Trophy } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function SeasonRankingPage({
	scope,
	seasonId,
	lensId,
}: {
	scope: string;
	seasonId: string;
	lensId: LensId;
}) {
	if (!isRankingScope(scope)) notFound();
	const leaderboard = await getSeasonLeaderboard({ scope, seasonId, lensId });
	if (!leaderboard) notFound();
	const { season, results } = leaderboard;
	const lens = rankingLenses[lensId];
	const champion = results[0];

	return (
		<div className={`vbg-report ${styles.report}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#ranking">
				Skip to season ranking
			</a>
			<PublicHeader />
			<main>
				<section className={styles.hero}>
					<div className={`${styles.content} ${styles.heroGrid}`}>
						<div>
							<div className={styles.signalLabel}>
								<span aria-hidden="true" />
								Peru / {season.label}
							</div>
							<h1>{season.label} season standings.</h1>
							<p className={styles.heroCopy}>
								The complete {lens.shortName} record for this quarter. Closed
								seasons are immutable; active and preseason standings remain
								provisional.
							</p>
						</div>
						<div className={styles.heroMeta}>
							<div>
								<Trophy aria-hidden="true" />
								<span>
									{season.status === "closed" ? "Champion" : "Leader"}
								</span>
								<strong>{champion ? `@${champion.username}` : "Open"}</strong>
							</div>
							<div>
								<CalendarDays aria-hidden="true" />
								<span>Window</span>
								<strong>
									{season.startsAt} / {season.endsAt}
								</strong>
							</div>
							<div>
								<ShieldCheck aria-hidden="true" />
								<span>Ruleset</span>
								<strong>v{season.rulesetVersion}</strong>
							</div>
						</div>
					</div>
				</section>
				<div className={`${styles.content} ${styles.body}`}>
					<LadderNavigation scope={scope} active="season" season={season} />
					<nav aria-label="Season lenses" className={styles.lensNav}>
						{Object.values(rankingLenses).map((definition) => (
							<Link
								key={definition.id}
								href={`/${scope}/seasons/${season.id.toLowerCase()}?lens=${definition.id}`}
								aria-current={definition.id === lensId ? "page" : undefined}
							>
								{definition.shortName}
							</Link>
						))}
					</nav>
					<RankingTable
						initialEntries={results.map((result) => result.entry)}
						lensId={lensId}
						lensName={lens.shortName}
						scope={scope}
						scopeName="Peru"
						total={results.length}
						season={season}
					/>
				</div>
			</main>
			<Footer />
		</div>
	);
}
