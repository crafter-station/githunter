import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import type { RankingSeason } from "@/rankings/types";
import Link from "next/link";

export function LadderNavigation({
	scope,
	active,
	season,
}: {
	scope: string;
	active: "current" | "form" | "all-time" | "season";
	season: RankingSeason;
}) {
	return (
		<div className={styles.ladderBar}>
			<nav aria-label="Ladder standings" className={styles.ladderNav}>
				<Link
					href={`/${scope}`}
					aria-current={active === "current" ? "page" : undefined}
				>
					Current season
				</Link>
				<Link
					href={`/${scope}/form`}
					aria-current={active === "form" ? "page" : undefined}
				>
					Form
				</Link>
				<Link
					href={`/${scope}/overall`}
					aria-current={active === "all-time" ? "page" : undefined}
				>
					All-time
				</Link>
				<Link
					href={`/${scope}/seasons/${season.id.toLowerCase()}`}
					aria-current={active === "season" ? "page" : undefined}
				>
					Seasons
				</Link>
			</nav>
			<span className={styles.seasonPill} data-status={season.status}>
				{season.label} · {season.status}
			</span>
		</div>
	);
}
