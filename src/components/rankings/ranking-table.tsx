"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { metricLabels } from "@/rankings/lenses";
import type { LensId, RankingEntry } from "@/rankings/types";
import { ArrowUpRight, Search } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

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
	entries,
	lensId,
}: {
	entries: RankingEntry[];
	lensId: LensId;
}) {
	const [query, setQuery] = useState("");
	const [visible, setVisible] = useState(50);
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
		<section aria-labelledby="full-ranking" className="space-y-4">
			<div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
				<div>
					<p className="font-mono text-amber-700 text-xs uppercase tracking-[0.18em] dark:text-amber-300">
						Full cohort
					</p>
					<h2 id="full-ranking" className="mt-1 font-semibold text-2xl">
						All ranked developers
					</h2>
				</div>
				<label
					htmlFor="ranking-filter"
					className="relative block w-full sm:w-72"
				>
					<span className="sr-only">Filter developers</span>
					<Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
					<Input
						id="ranking-filter"
						value={query}
						onChange={(event) => {
							setQuery(event.target.value);
							setVisible(50);
						}}
						placeholder="Search name or location"
						className="pl-9"
					/>
				</label>
			</div>

			<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
				<div className="overflow-x-auto">
					<table className="w-full min-w-[860px] border-collapse text-left">
						<thead className="border-b bg-muted/50 text-muted-foreground text-xs uppercase tracking-wider">
							<tr>
								<th className="w-16 px-5 py-3 font-medium">Rank</th>
								<th className="px-4 py-3 font-medium">Developer</th>
								<th className="px-4 py-3 font-medium">Strongest signals</th>
								<th className="w-28 px-4 py-3 text-right font-medium">
									Confidence
								</th>
								<th className="w-28 px-5 py-3 text-right font-medium">Score</th>
							</tr>
						</thead>
						<tbody className="divide-y">
							{shown.map((entry) => {
								const strongest = [...entry.breakdown]
									.sort((left, right) => right.points - left.points)
									.slice(0, 3);
								return (
									<tr
										key={`${lensId}-${entry.profile.login}`}
										className="group transition-colors hover:bg-muted/35"
									>
										<td className="px-5 py-4 align-middle">
											<span className="font-mono font-semibold text-lg tabular-nums">
												{entry.rank}
											</span>
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
										<td className="px-4 py-4 align-middle">
											<a
												href={`https://github.com/${entry.profile.login}`}
												target="_blank"
												rel="noreferrer"
												aria-label={`${entry.profile.name || entry.profile.login} on GitHub, opens in a new tab`}
												className="flex min-w-56 items-center gap-3"
											>
												<Image
													src={entry.profile.avatarUrl}
													alt=""
													width={40}
													height={40}
													className="rounded-full border bg-muted"
												/>
												<span className="min-w-0">
													<span className="flex items-center gap-1 font-medium group-hover:underline">
														{entry.profile.name || entry.profile.login}
														<ArrowUpRight className="size-3.5 text-muted-foreground" />
													</span>
													<span className="block truncate text-muted-foreground text-sm">
														@{entry.profile.login}
														{entry.profile.location
															? ` · ${entry.profile.location}`
															: ""}
													</span>
												</span>
											</a>
										</td>
										<td className="px-4 py-4 align-middle">
											<div className="flex flex-wrap gap-1.5">
												{strongest.map((metric) => (
													<span
														key={metric.metric}
														className="rounded-full border bg-background px-2.5 py-1 text-xs"
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
										<td className="px-4 py-4 text-right align-middle">
											<span className="text-muted-foreground text-sm">
												{confidenceLabel(entry.confidence)}
											</span>
										</td>
										<td className="px-5 py-4 text-right align-middle">
											<span className="font-mono font-semibold text-lg tabular-nums">
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
					<p className="px-6 py-12 text-center text-muted-foreground">
						No developers match “{query}”.
					</p>
				)}
			</div>

			{shown.length < filtered.length && (
				<div className="flex justify-center">
					<Button
						variant="outline"
						onClick={() => setVisible((value) => value + 50)}
					>
						Show 50 more
					</Button>
				</div>
			)}
		</section>
	);
}
