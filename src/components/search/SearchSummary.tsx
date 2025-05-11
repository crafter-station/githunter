"use client";

import type { SearchSummaryData } from "@/app/search/[slug]/query-users";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
	BarChart,
	ChevronDown,
	ChevronUp,
	GitFork,
	Sparkles,
	Star,
	Terminal,
	TrendingUp,
	Trophy,
	Users,
	Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";

interface SearchSummaryProps {
	slug: string;
}

export default function SearchSummary({ slug }: SearchSummaryProps) {
	const [summaryData, setSummaryData] = useState<SearchSummaryData | null>(
		null,
	);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [expanded, setExpanded] = useState(false);
	const [isPlaying, setIsPlaying] = useState(false);

	useEffect(() => {
		async function fetchSummary() {
			try {
				setLoading(true);
				const response = await fetch("/api/search/summary", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ slug }),
				});

				if (!response.ok) {
					throw new Error(`Server responded with ${response.status}`);
				}
				const data = await response.json();
				setSummaryData(data);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching search summary:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load search summary",
				);
				setLoading(false);
			}
		}

		if (slug) {
			fetchSummary();
		}
	}, [slug]);

	// Helper function to get the icon for a metric type
	const getMetricIcon = (type: string) => {
		switch (type) {
			case "stars":
				return <Star className="h-4 w-4 text-amber-500 dark:text-amber-400" />;
			case "followers":
				return <Users className="h-4 w-4 text-blue-500" />;
			case "repositories":
				return <GitFork className="h-4 w-4 text-green-500" />;
			case "contributions":
				return <BarChart className="h-4 w-4 text-purple-500" />;
			default:
				return <TrendingUp className="h-4 w-4 text-muted-foreground" />;
		}
	};

	// Function to play the spoken digest with ElevenLabs
	const playSpokenDigest = async () => {
		if (!summaryData) return;

		try {
			setIsPlaying(true);
			// This would connect to your ElevenLabs API endpoint
			await fetch("/api/tts/play", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					text: summaryData.spokenDigest,
				}),
			});
		} catch (error) {
			console.error("Failed to play audio:", error);
		} finally {
			setIsPlaying(false);
		}
	};

	// Function to determine the top metric for each developer
	const getTopMetric = (dev: SearchSummaryData["topDevelopers"][number]) => {
		// Compare metrics to find the highest relative to typical values
		const metrics = [
			{
				name: "stars",
				value: dev.stars,
				icon: (
					<Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
				),
				threshold: 100,
			},
			{
				name: "repositories",
				value: dev.repositories,
				icon: <GitFork className="h-3.5 w-3.5 text-green-500" />,
				threshold: 30,
			},
			{
				name: "followers",
				value: dev.followers,
				icon: <Users className="h-3.5 w-3.5 text-blue-500" />,
				threshold: 50,
			},
		];

		// Sort by value relative to typical threshold
		return metrics.sort(
			(a, b) => b.value / b.threshold - a.value / a.threshold,
		)[0];
	};

	if (error) {
		return (
			<>
				{/* Search Metadata */}
				<div className="mb-4 border-border/40 border-b py-3">
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge
							variant="secondary"
							className="flex items-center gap-1 px-2 py-0.5 text-xs"
						>
							<Users className="h-3 w-3" />0 developers
						</Badge>
						<Badge variant="outline" className="px-2 py-0.5 text-xs">
							Error loading data
						</Badge>
					</div>
				</div>

				{/* Error Card */}
				<Card className="mb-4">
					<CardHeader className="py-3">
						<CardTitle className="flex items-center gap-2 text-base">
							<Sparkles className="h-4 w-4 text-primary" />
							Search Summary
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-red-500 text-sm">{error}</p>
					</CardContent>
				</Card>
			</>
		);
	}

	return (
		<>
			{/* Search Metadata - Always Visible */}
			{!loading && summaryData && (
				<div className="mb-4 border-border/40 border-b py-3">
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge
							variant="secondary"
							className="flex items-center gap-1 px-2 py-0.5 text-xs"
						>
							<Users className="h-3 w-3" />
							{summaryData.totalDevelopers} developers
						</Badge>

						{summaryData.location && (
							<Badge
								variant="outline"
								className="flex items-center gap-1 px-2 py-0.5 text-xs"
							>
								<svg
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									aria-hidden="true"
									aria-label="Location"
								>
									<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
									<circle cx="12" cy="10" r="3" />
								</svg>
								{summaryData.location}
							</Badge>
						)}

						{summaryData.techStack.slice(0, 3).map((tech) => (
							<Badge
								key={`tech-${tech}`}
								variant="outline"
								className="flex items-center gap-1 px-2 py-0.5 text-xs"
							>
								<Terminal className="h-3 w-3" />
								{tech}
							</Badge>
						))}

						{summaryData.techStack.length > 3 && (
							<Badge variant="outline" className="px-2 py-0.5 text-xs">
								+{summaryData.techStack.length - 3} more
							</Badge>
						)}
					</div>
				</div>
			)}

			{/* Summary Card */}
			<Card className="mb-4 overflow-hidden py-0">
				<div className="relative">
					<div
						className={cn(
							"overflow-hidden transition-all duration-500 ease-in-out",
							expanded ? "max-h-[800px]" : "max-h-[180px]",
						)}
					>
						<CardHeader className="px-4 pt-3 pb-2">
							<div className="flex flex-wrap items-center gap-2">
								<div className="flex items-center gap-2">
									<Sparkles className="h-4 w-4 text-primary" />
									<CardTitle className="text-base">Search Summary</CardTitle>
								</div>

								{!loading && summaryData && (
									<Button
										variant="outline"
										size="sm"
										className="ml-auto flex h-7 items-center gap-1.5 px-3 text-xs"
										onClick={playSpokenDigest}
										disabled={isPlaying}
									>
										{isPlaying ? "Playing" : "Listen"}
										<Volume2
											className={cn(
												"h-3.5 w-3.5",
												isPlaying && "animate-pulse",
											)}
										/>
									</Button>
								)}
							</div>
						</CardHeader>

						<CardContent
							className={cn(
								"grid gap-4 px-4 pt-0 pb-3",
								expanded ? "md:grid-cols-2" : "grid-cols-1 md:grid-cols-2",
							)}
						>
							{loading ? (
								<div className="space-y-2 py-3">
									<Skeleton className="h-4 w-[90%]" />
									<Skeleton className="h-4 w-[75%]" />
								</div>
							) : summaryData ? (
								<>
									{/* Digest */}
									<div className="mb-4 space-y-3">
										<div className="rounded-lg border bg-muted/10">
											<div className="p-3">
												<p className="text-muted-foreground text-xs leading-relaxed">
													{summaryData.spokenDigest}
												</p>
											</div>
										</div>
									</div>

									{/* Top Developers Section */}
									<div className="w-full space-y-3">
										<div className="mb-2 flex items-center gap-2">
											<Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
											<h2 className="font-medium text-sm">Top Developers</h2>
										</div>

										<div className="grid grid-cols-1 gap-2">
											{summaryData.topDevelopers.slice(0, 3).map((dev, i) => {
												const topMetric = getTopMetric(dev);
												const rankColors = [
													"bg-amber-500 dark:bg-amber-500/80", // 1st place
													"bg-slate-400 dark:bg-slate-400/80", // 2nd place
													"bg-orange-400 dark:bg-orange-400/80", // 3rd place
												];

												return (
													<div
														key={`dev-${dev.username}`}
														className={cn(
															"flex items-center rounded-md border bg-card p-2 shadow-sm",
															i === 0 &&
																"sm:border-amber-200/70 sm:bg-amber-50/50 dark:sm:border-amber-800/30 dark:sm:bg-amber-950/20",
															i === 1 &&
																"sm:border-slate-200/70 sm:bg-slate-50/50 dark:sm:border-slate-800/30 dark:sm:bg-slate-950/20",
															i === 2 &&
																"sm:border-orange-200/70 sm:bg-orange-50/50 dark:sm:border-orange-800/30 dark:sm:bg-orange-950/20",
														)}
													>
														{/* Rank Badge */}
														<div className="mr-2 flex-shrink-0">
															<div
																className={cn(
																	"flex h-6 w-6 items-center justify-center rounded-full font-semibold text-[10px] text-white",
																	rankColors[i],
																)}
															>
																{i + 1}
																{i === 0 ? "st" : i === 1 ? "nd" : "rd"}
															</div>
														</div>

														<div className="flex-1 overflow-hidden">
															<div className="overflow-hidden">
																<p className="truncate font-medium text-xs">
																	{dev.fullname || dev.username}
																</p>
																<p className="truncate text-[10px] text-muted-foreground">
																	@{dev.username}
																</p>
															</div>
														</div>

														<div className="flex flex-col items-end border-l pl-2 text-right">
															<div className="flex items-center gap-1">
																{topMetric.icon}
																<span className="font-medium text-xs">
																	{topMetric.value}
																</span>
															</div>
															<span className="text-[10px] text-muted-foreground">
																{topMetric.name}
															</span>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</>
							) : (
								<div className="p-3 text-center text-muted-foreground text-xs">
									No summary available
								</div>
							)}
						</CardContent>
					</div>

					{/* Mask overlay for entire card content */}
					{!expanded && summaryData && !loading && (
						<div
							className="absolute inset-0 bg-gradient-to-b"
							style={{
								background:
									"linear-gradient(to bottom, transparent 10%, var(--background) 95%)",
								pointerEvents: "none",
							}}
							aria-hidden="true"
						/>
					)}

					{/* Clickable overlay for expanding */}
					{!expanded && summaryData && !loading && (
						<div
							className="absolute inset-0 cursor-pointer"
							onClick={() => setExpanded(true)}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									setExpanded(true);
								}
							}}
							role="button"
							tabIndex={0}
							aria-label="Expand summary"
						/>
					)}

					{/* Expand/collapse toggle */}
					<div className="absolute right-0 bottom-0 left-0 flex justify-center pb-2">
						<Button
							variant="ghost"
							size="sm"
							className="z-10 h-7 w-7 rounded-full border bg-background/90 p-0 shadow-sm backdrop-blur-sm"
							onClick={() => setExpanded(!expanded)}
						>
							{expanded ? (
								<ChevronUp className="h-3.5 w-3.5" />
							) : (
								<ChevronDown className="h-3.5 w-3.5" />
							)}
						</Button>
					</div>
				</div>
			</Card>
		</>
	);
}
