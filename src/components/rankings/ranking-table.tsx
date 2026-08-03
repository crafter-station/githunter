"use client";

import { RankingTableToolbar } from "@/components/rankings/ranking-table-toolbar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { metricLabels } from "@/rankings/lenses";
import type {
	LensId,
	RankingCandidateEvaluation,
	RankingEntry,
	RankingSeason,
} from "@/rankings/types";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

function compactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: value >= 1000 ? "compact" : "standard",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

function confidenceLabel(confidence: number) {
	if (confidence >= 95) return "High confidence";
	if (confidence >= 70) return "Medium confidence";
	return "Low confidence";
}

function initials(value: string) {
	return value
		.split(/\s+/)
		.slice(0, 2)
		.map((part) => part[0])
		.join("")
		.toUpperCase();
}

export function RankingTable({
	initialEntries,
	lensId,
	lensName,
	scope,
	scopeName,
	total,
	season,
}: {
	initialEntries: RankingEntry[];
	lensId: LensId;
	lensName: string;
	scope: string;
	scopeName: string;
	total: number;
	season: RankingSeason;
}) {
	const [entries, setEntries] = useState(initialEntries);
	const [query, setQuery] = useQueryState(
		"q",
		parseAsString
			.withDefault("")
			.withOptions({ history: "replace", clearOnDefault: true }),
	);
	const [visible, setVisible] = useState(50);
	const [loadedAll, setLoadedAll] = useState(initialEntries.length >= total);
	const [loading, setLoading] = useState(false);
	const [loadError, setLoadError] = useState("");
	const [evaluation, setEvaluation] =
		useState<RankingCandidateEvaluation | null>(null);
	const [evaluating, setEvaluating] = useState(false);
	const loadingPromise = useRef<Promise<void> | null>(null);

	const loadAll = useCallback(() => {
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
	}, [lensId, loadedAll, scope]);

	useEffect(() => {
		if (query.trim()) void loadAll();
	}, [loadAll, query]);

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
	const evaluatedRanking = evaluation?.rankings?.find(
		(item) => item.lens.id === lensId,
	);

	const evaluateCandidate = async () => {
		setEvaluating(true);
		setLoadError("");
		try {
			const response = await fetch(`/api/rankings/${scope}/candidates`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ username: query }),
			});
			const result = (await response.json()) as RankingCandidateEvaluation & {
				error?: string;
			};
			if (!result.status) throw new Error(result.error ?? "Evaluation failed");
			setEvaluation(result);
		} catch {
			setLoadError("This GitHub account could not be evaluated. Try again.");
		} finally {
			setEvaluating(false);
		}
	};

	const showMore = shown.length < filtered.length || !loadedAll;

	return (
		<section
			id="ranking"
			aria-labelledby="ranking-filter-title"
			className="flex min-w-0 max-w-full flex-col gap-4 py-6"
		>
			<Card className="min-w-0 max-w-full gap-0 overflow-hidden py-0">
				<RankingTableToolbar
					id="ranking-filter"
					status={season.label}
					meta={`${season.status} · ${total} developers`}
					title={`${scopeName} ranking`}
					description="Search the indexed cohort or evaluate an account that is not listed."
					query={query}
					placeholder="Search GitHub username"
					onQueryChange={(value) => {
						void setQuery(value);
						setEvaluation(null);
						setVisible(50);
					}}
				/>
				<CardContent className="p-0">
					{shown.length > 0 ? (
						<Table className="table-fixed lg:table-auto">
							<TableHeader>
								<TableRow>
									<TableHead className="w-14 lg:w-20">Rank</TableHead>
									<TableHead>Developer</TableHead>
									<TableHead className="hidden lg:table-cell">
										Strongest signals
									</TableHead>
									<TableHead className="hidden w-36 lg:table-cell">
										Confidence
									</TableHead>
									<TableHead className="w-20 text-right lg:w-24">
										Score
									</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{shown.map((entry) => {
									const strongest = [...entry.breakdown]
										.sort((left, right) => right.points - left.points)
										.slice(0, 3);
									const displayName = entry.profile.name || entry.profile.login;
									return (
										<TableRow key={`${lensId}-${entry.profile.login}`}>
											<TableCell className="overflow-hidden">
												<div className="flex items-baseline gap-2">
													<strong className="tabular-nums">
														#{entry.rank}
													</strong>
													{entry.rankChange !== null &&
														entry.rankChange !== 0 && (
															<span className="text-muted-foreground text-xs tabular-nums">
																{entry.rankChange > 0 ? "↑" : "↓"}
																{Math.abs(entry.rankChange)}
															</span>
														)}
												</div>
											</TableCell>
											<TableCell>
												<Link
													href={`/developer/${entry.profile.login}`}
													aria-label={`View ${displayName} ranking profile`}
													className="flex min-w-0 items-center gap-3"
												>
													<Avatar className="size-9 rounded-md">
														<AvatarImage src={entry.profile.avatarUrl} alt="" />
														<AvatarFallback className="rounded-md">
															{initials(displayName)}
														</AvatarFallback>
													</Avatar>
													<span className="flex min-w-0 flex-col">
														<span className="truncate font-medium">
															{displayName}
														</span>
														<span className="truncate text-muted-foreground text-xs">
															@{entry.profile.login}
															{entry.profile.location
																? ` · ${entry.profile.location}`
																: ""}
														</span>
													</span>
												</Link>
											</TableCell>
											<TableCell className="hidden lg:table-cell">
												<div className="flex flex-wrap gap-2">
													{strongest.map((metric) => (
														<Badge key={metric.metric} variant="outline">
															{metricLabels[metric.metric]}{" "}
															{compactNumber(metric.raw)}
															{lensId === "rising" &&
															metric.changePercent !== null
																? ` · ${metric.changePercent > 0 ? "+" : ""}${metric.changePercent}%`
																: ""}
														</Badge>
													))}
												</div>
											</TableCell>
											<TableCell className="hidden lg:table-cell">
												<span className="text-muted-foreground text-xs">
													{confidenceLabel(entry.confidence)}
												</span>
											</TableCell>
											<TableCell className="text-right">
												<strong className="tabular-nums">
													{entry.score.toFixed(2)}
												</strong>
											</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					) : query.trim() ? (
						<Empty>
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Sparkles aria-hidden="true" />
								</EmptyMedia>
								<EmptyTitle>
									{loading
										? "Searching the complete index"
										: `@${query.replace(/^@/, "")} is not indexed`}
								</EmptyTitle>
								<EmptyDescription>
									Calculate a provisional position against the same cohort and
									ruleset used by the public ladder.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button
									type="button"
									disabled={loading || evaluating || !loadedAll}
									onClick={evaluateCandidate}
								>
									{evaluating ? "Calculating" : "Calculate my rank"}
									<ArrowRight data-icon="inline-end" aria-hidden="true" />
								</Button>
							</EmptyContent>
						</Empty>
					) : null}
				</CardContent>
				{showMore ? (
					<CardFooter className="justify-center py-3">
						<Button
							size="sm"
							variant="outline"
							disabled={loading}
							onClick={async () => {
								await loadAll();
								setVisible((value) => value + 50);
							}}
						>
							{loading ? "Loading ranking" : "Show 50 more"}
						</Button>
					</CardFooter>
				) : null}
			</Card>

			{evaluation ? (
				<Card>
					<CardHeader>
						<Badge variant="secondary">{evaluation.status}</Badge>
						<CardTitle>@{evaluation.username}</CardTitle>
						<CardDescription>{evaluation.message}</CardDescription>
					</CardHeader>
					<CardContent className="flex flex-wrap items-center gap-3">
						{evaluatedRanking ? (
							<Badge variant="outline">
								{lensName} · #{evaluatedRanking.entry.rank} ·{" "}
								{evaluatedRanking.entry.score.toFixed(2)}
							</Badge>
						) : null}
						{evaluation.profile && evaluation.rankings ? (
							<Button asChild variant="outline">
								<Link href={`/developer/${evaluation.profile.login}`}>
									Open ladder profile
									<ArrowUpRight data-icon="inline-end" aria-hidden="true" />
								</Link>
							</Button>
						) : null}
					</CardContent>
				</Card>
			) : null}

			{loadError ? (
				<Alert variant="destructive">
					<AlertTitle>Ranking unavailable</AlertTitle>
					<AlertDescription>{loadError}</AlertDescription>
				</Alert>
			) : null}
		</section>
	);
}
