import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { rankingLenses } from "@/rankings/lenses";
import type { LensId } from "@/rankings/types";
import type { RankingSeason } from "@/rankings/types";
import { Check, ChevronDown } from "lucide-react";
import Link from "next/link";

function lensHref({
	scope,
	active,
	season,
	lensId,
}: {
	scope: string;
	active: "current" | "form" | "all-time" | "season";
	season: RankingSeason;
	lensId: LensId;
}) {
	if (active === "form") return `/${scope}/form?lens=${lensId}`;
	if (active === "all-time") return `/${scope}/overall?lens=${lensId}`;
	if (active === "season") {
		return `/${scope}/seasons/${season.id.toLowerCase()}?lens=${lensId}`;
	}
	return lensId === "balanced" ? `/${scope}` : `/rankings/${scope}/${lensId}`;
}

export function LadderNavigation({
	scope,
	active,
	season,
	seasons,
	lensId,
}: {
	scope: string;
	active: "current" | "form" | "all-time" | "season";
	season: RankingSeason;
	seasons: RankingSeason[];
	lensId: LensId;
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
			</nav>
			<div className={styles.ladderTools}>
				<details className={styles.filterMenu}>
					<summary data-active={active === "season" ? "true" : undefined}>
						<span className={styles.filterValue}>
							<span className={styles.filterPrefix}>Season</span>
							<strong>{season.label}</strong>
						</span>
						<span className={styles.seasonStatus} data-status={season.status}>
							{season.status}
						</span>
						<ChevronDown aria-hidden="true" />
					</summary>
					<nav aria-label="Seasons">
						{seasons.map((item) => (
							<Link
								key={item.id}
								href={`/${scope}/seasons/${item.id.toLowerCase()}?lens=${lensId}`}
								aria-current={item.id === season.id ? "page" : undefined}
							>
								<span>
									{item.label}
									<small>{item.status}</small>
								</span>
								{item.id === season.id ? <Check aria-hidden="true" /> : null}
							</Link>
						))}
					</nav>
				</details>
				<details className={styles.filterMenu}>
					<summary>
						<span className={styles.filterValue}>
							<span className={styles.filterPrefix}>Lens</span>
							<strong>{rankingLenses[lensId].shortName}</strong>
						</span>
						<ChevronDown aria-hidden="true" />
					</summary>
					<nav aria-label="Ranking lenses">
						{Object.values(rankingLenses).map((lens) => (
							<Link
								key={lens.id}
								href={lensHref({ scope, active, season, lensId: lens.id })}
								aria-current={lens.id === lensId ? "page" : undefined}
							>
								<span>{lens.shortName}</span>
								{lens.id === lensId ? <Check aria-hidden="true" /> : null}
							</Link>
						))}
					</nav>
				</details>
			</div>
		</div>
	);
}
