"use client";

import styles from "@/app/rankings/[scope]/[lens]/ranking-page.module.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { metricLabels } from "@/rankings/lenses";
import type { LensId, RankingEntry } from "@/rankings/types";
import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

function compactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: value >= 1000 ? "compact" : "standard",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

function confidenceLabel(confidence: number) {
	if (confidence >= 95) return "High";
	if (confidence >= 70) return "Medium";
	return "Low";
}

export function RankingTable({
	initialEntries,
	lensId,
	lensName,
	scope,
	scopeName,
	total,
}: {
	initialEntries: RankingEntry[];
	lensId: LensId;
	lensName: string;
	scope: string;
	scopeName: string;
	total: number;
}) {
	const [entries, setEntries] = useState(initialEntries);
	const [query, setQuery] = useState("");
	const [visible, setVisible] = useState(50);
	const [loadedAll, setLoadedAll] = useState(initialEntries.length >= total);
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState("");
	const loadingPromise = useRef<Promise<void> | null>(null);

	const loadAll = () => {
		if (loadedAll) return Promise.resolve();
		if (loadingPromise.current) return loadingPromise.current;
		setLoading(true);
		setLoadError("");
		loadingPromise.current = fetch(`/api/rankings/${scope}/${lensId}`)
			.then((response) => {
				if (!response.ok) throw new Error("Unable to load the full ranking");
				return response.json() as Promise<{ entries: RankingEntry[] }>;
			})
			.then((snapshot) => {
				setEntries(snapshot.entries);
				setLoadedAll(true);
			})
			.catch(() => {
				setLoadError("The full ranking could not be loaded. Try again.");
			})
			.finally(() => {
				setLoading(false);
				loadingPromise.current = null;
			});
		return loadingPromise.current;
	};

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return entries;
		return entries.filter((entry) =>
			[entry.profile.login, entry.profile.name, entry.profile.location]
				.join(" ")
				.toLowerCase()
				.includes(normalized),
		);
	}, [entries, query]);
	const shown = filtered.slice(0, visible);

	return (
		<section
			id="ranking"
			aria-labelledby="full-ranking"
			className={styles.rankingSection}
		>
			<div className={styles.rankingHeading}>
				<div>
					<p className={styles.sectionLabel}>{total} public profiles</p>
					<h2 id="full-ranking">
						{scopeName} {lensName} ranking
					</h2>
				</div>
				<label htmlFor="ranking-filter" className={styles.search}>
					<span className="sr-only">Filter developers</span>
					<Search aria-hidden="true" />
					<Input
						id="ranking-filter"
						value={query}
						onChange={(event) => {
							const value = event.target.value;
							setQuery(value);
							setVisible(50);
							if (value.trim()) void loadAll();
						}}
						placeholder="Search this ranking"
						className={styles.searchInput}
					/>
				</label>
			</div>

			<div className={styles.rankingTableFrame}>
				<div className={styles.rankingTableScroll}>
					<table className={styles.rankingTable}>
						<thead>
							<tr>
								<th>Rank</th>
								<th>Developer</th>
								<th>Strongest signals</th>
								<th>Confidence</th>
								<th>Score</th>
							</tr>
						</thead>
						<tbody>
							{shown.map((entry) => {
								const strongest = [...entry.breakdown]
									.sort((left, right) => right.points - left.points)
									.slice(0, 3);
								return (
									<tr
										key={`${lensId}-${entry.profile.login}`}
										className={styles.rankingRow}
									>
										<td>
											<span className={styles.rankNumber}>{entry.rank}</span>
											{entry.rankChange !== null && entry.rankChange !== 0 && (
												<span
													className={
														entry.rankChange > 0
															? "ml-1 text-emerald-600 text-xs"
															: "ml-1 text-rose-600 text-xs"
													}
													aria-label={`Moved ${entry.rankChange > 0 ? "up" : "down"} ${Math.abs(entry.rankChange)} places`}
												>
													{entry.rankChange > 0 ? "↑" : "↓"}
													{Math.abs(entry.rankChange)}
												</span>
											)}
										</td>
										<td>
											<Link
												href={`/developer/${entry.profile.login}`}
												aria-label={`View ${entry.profile.name || entry.profile.login} ranking profile`}
												className={styles.developerLink}
											>
												<Image
													src={entry.profile.avatarUrl}
													alt=""
													width={40}
													height={40}
													className={styles.tableAvatar}
												/>
												<span className={styles.developerName}>
													<span>
														{entry.profile.name || entry.profile.login}
														<ArrowUpRight aria-hidden="true" />
													</span>
													<span>
														@{entry.profile.login}
														{entry.profile.location
															? ` · ${entry.profile.location}`
															: ""}
													</span>
												</span>
											</Link>
										</td>
										<td>
											<div className={styles.strongestSignals}>
												{strongest.map((metric) => (
													<span
														key={metric.metric}
														className={styles.signalMetric}
													>
														<span className="text-muted-foreground">
															{metricLabels[metric.metric]}
														</span>{" "}
														<span className="font-medium tabular-nums">
															{compactNumber(metric.raw)}
														</span>
														{lensId === "rising" &&
															metric.changePercent !== null && (
																<span
																	className={
																		metric.changePercent >= 0
																			? "ml-1 text-emerald-600"
																			: "ml-1 text-rose-600"
																	}
																>
																	{metric.changePercent > 0 ? "+" : ""}
																	{metric.changePercent}%
																</span>
															)}
													</span>
												))}
											</div>
										</td>
										<td>
											<span className="text-muted-foreground text-sm">
												{confidenceLabel(entry.confidence)}
											</span>
										</td>
										<td>
											<span className={styles.scoreNumber}>
												{entry.score.toFixed(2)}
											</span>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
				{shown.length === 0 && (
					<p className={styles.emptyRanking}>No developers match “{query}”.</p>
				)}
			</div>

			{(shown.length < filtered.length || !loadedAll) && (
				<div className={styles.showMore}>
					<Button
						variant="outline"
						className={styles.showMoreButton}
						disabled={loading}
						onClick={async () => {
							await loadAll();
							setVisible((value) => value + 50);
						}}
					>
						{loading ? "Loading ranking…" : "Show 50 more"}
					</Button>
				</div>
			)}
			{loadError && <output className={styles.loadError}>{loadError}</output>}
		</section>
	);
}
