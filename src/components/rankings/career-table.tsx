"use client";

import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Input } from "@/components/ui/input";
import type { CareerStanding } from "@/rankings/types";
import { ArrowUpRight, Search, Trophy } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

export function CareerTable({
	standings,
	mode,
}: {
	standings: CareerStanding[];
	mode: "all-time" | "form";
}) {
	const [query, setQuery] = useState("");
	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return standings;
		return standings.filter((standing) =>
			[standing.profile.login, standing.profile.name, standing.profile.location]
				.join(" ")
				.toLowerCase()
				.includes(normalized),
		);
	}, [query, standings]);

	return (
		<section id="ranking" className={styles.rankingSection}>
			<div className={styles.rankingHeading}>
				<div>
					<p className={styles.sectionLabel}>
						{standings.length} ladder careers
					</p>
					<h2>{mode === "form" ? "Four-quarter form" : "Career standings"}</h2>
					<p className={styles.rankingCopy}>
						{mode === "form"
							? "Average score across the latest four available seasons."
							: "Career points are the sum of official season scores. Before the first official close, standings remain projected."}
					</p>
				</div>
				<label htmlFor="career-filter" className={styles.search}>
					<span className="sr-only">Search ladder careers</span>
					<Search aria-hidden="true" />
					<Input
						id="career-filter"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Find a GitHub career"
						className={styles.searchInput}
					/>
				</label>
			</div>
			<div className={styles.rankingTableFrame}>
				<div className={styles.rankingTableScroll}>
					<table className={`${styles.rankingTable} ${styles.careerTable}`}>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Developer</th>
								<th>{mode === "form" ? "Form" : "Career points"}</th>
								<th>Seasons</th>
								<th>Titles</th>
								<th>Current</th>
							</tr>
						</thead>
						<tbody>
							{filtered.map((standing) => (
								<tr key={standing.profile.login} className={styles.rankingRow}>
									<td>
										<span className={styles.rankNumber}>{standing.rank}</span>
									</td>
									<td>
										<Link
											href={`/developer/${standing.profile.login}`}
											className={styles.developerLink}
										>
											<Image
												src={standing.profile.avatarUrl}
												alt=""
												width={40}
												height={40}
												className={styles.tableAvatar}
											/>
											<span className={styles.developerName}>
												<span>
													{standing.profile.name || standing.profile.login}
													<ArrowUpRight aria-hidden="true" />
												</span>
												<span>@{standing.profile.login}</span>
											</span>
										</Link>
									</td>
									<td>
										<span className={styles.scoreNumber}>
											{mode === "form"
												? standing.formScore.toFixed(2)
												: standing.careerPoints.toFixed(2)}
										</span>
										{standing.provisional && (
											<small className={styles.provisionalLabel}>
												Projected
											</small>
										)}
									</td>
									<td className="vbg-numeric">{standing.seasons}</td>
									<td>
										<span className={styles.titleCount}>
											<Trophy aria-hidden="true" /> {standing.championships}
										</span>
									</td>
									<td className="vbg-numeric">
										{standing.currentRank ? `#${standing.currentRank}` : "—"}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				{filtered.length === 0 && (
					<p className={styles.emptyRanking}>
						No ladder career matches “{query}”.
					</p>
				)}
			</div>
		</section>
	);
}
