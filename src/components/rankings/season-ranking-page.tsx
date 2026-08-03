import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { LadderNavigation } from "@/components/rankings/ladder-navigation";
import { RankingHeroStats } from "@/components/rankings/ranking-hero-stats";
import { RankingTable } from "@/components/rankings/ranking-table";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { isRankingScope } from "@/rankings/data";
import { rankingLenses } from "@/rankings/lenses";
import {
	getRankingSeasons,
	getSeasonLeaderboard,
} from "@/rankings/season-store";
import type { LensId } from "@/rankings/types";
import { DatabaseZap } from "lucide-react";
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
	const [leaderboard, seasons] = await Promise.all([
		getSeasonLeaderboard({ scope, seasonId, lensId }),
		getRankingSeasons(scope),
	]);
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
							<h1>
								{season.status === "reconstructed" ? "Reconstructed " : ""}
								{season.label} standings.
							</h1>
							<p className={styles.heroCopy}>
								{season.status === "reconstructed"
									? "Public activity was rebuilt from GitHub's dated contribution record. Historical adoption signals were excluded, and this quarter does not award an official championship."
									: `The complete ${lens.shortName} record for this quarter. Closed seasons are immutable; active and preseason standings remain provisional.`}
							</p>
						</div>
						<RankingHeroStats
							items={[
								{
									label: season.status === "closed" ? "Champion" : "Leader",
									value: champion ? `@${champion.username}` : "Open",
								},
								{
									label: "Window",
									value: `${season.startsAt} / ${season.endsAt}`,
								},
								{ label: "Ruleset", value: `v${season.rulesetVersion}` },
							]}
						/>
					</div>
				</section>
				<div className={`${styles.content} ${styles.body}`}>
					<LadderNavigation
						active="season"
						season={season}
						seasons={seasons}
						lensId={lensId}
					/>
					{results.length > 0 ? (
						<RankingTable
							key={`${season.id}-${lensId}`}
							initialEntries={results.map((result) => result.entry)}
							lensId={lensId}
							lensName={lens.shortName}
							scope={scope}
							scopeName="Peru"
							total={results.length}
							season={season}
						/>
					) : (
						<Empty className="border">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<DatabaseZap aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>
									{lens.shortName} cannot be reconstructed objectively
								</EmptyTitle>
								<EmptyDescription>
									This lens depends on historical stars, forks, and followers.
									GitHub exposes their current totals, not their values at the
									end of {season.label}.
								</EmptyDescription>
							</EmptyHeader>
						</Empty>
					)}
				</div>
			</main>
			<Footer />
		</div>
	);
}
