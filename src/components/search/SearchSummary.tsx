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
	Code,
	GitFork,
	LightbulbIcon,
	Search,
	Sparkles,
	Star,
	Terminal,
	TrendingUp,
	Trophy,
	User,
	Users,
	Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
				return <Star className="h-4 w-4 text-[#E87701] dark:text-[#FFC799]" />;
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

	if (error) {
		return (
			<Card className="mb-6">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Sparkles className="h-5 w-5 text-primary" />
						Search Summary
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-red-500">{error}</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="mb-6">
			<CardHeader className="pb-2">
				<CardTitle className="flex items-center gap-2">
					<Sparkles className="h-5 w-5 text-primary" />
					Search Summary
				</CardTitle>
			</CardHeader>
			<CardContent>
				{loading ? (
					<div className="space-y-2">
						<Skeleton className="h-4 w-[90%]" />
						<Skeleton className="h-4 w-[75%]" />
						<Skeleton className="h-4 w-[80%]" />
						<Skeleton className="mt-4 h-20 w-full" />
						<Skeleton className="mt-4 h-4 w-[60%]" />
					</div>
				) : summaryData ? (
					<div className="space-y-5">
						{/* Headline and Overview */}
						<div className="space-y-3">
							<h1 className="flex items-center gap-2 font-semibold text-2xl text-foreground tracking-tight">
								<Search className="h-5 w-5 text-primary" />
								{summaryData.headline}
							</h1>

							<div className="flex flex-wrap items-center gap-2">
								<Badge
									variant="secondary"
									className="flex items-center gap-1 px-2 py-1"
								>
									<Users className="h-3.5 w-3.5" />
									{summaryData.totalDevelopers} developers
								</Badge>

								{summaryData.location && (
									<Badge
										variant="outline"
										className="flex items-center gap-1 px-2 py-1"
									>
										<svg
											width="14"
											height="14"
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
										className="flex items-center gap-1 px-2 py-1"
									>
										<Terminal className="h-3 w-3" />
										{tech}
									</Badge>
								))}

								{summaryData.techStack.length > 3 && (
									<Badge variant="outline" className="px-2 py-1">
										+{summaryData.techStack.length - 3} more
									</Badge>
								)}
							</div>
						</div>

						{/* Top Developers Section */}
						<div className="space-y-3 rounded-lg bg-muted/30 p-4">
							<h2 className="flex items-center gap-2 font-semibold text-lg">
								<Trophy className="h-4 w-4 text-amber-500" />
								Top Developers
							</h2>

							<div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
								{summaryData.topDevelopers.slice(0, 3).map((dev, i) => (
									<div
										key={`dev-${dev.username}`}
										className="rounded-md border bg-card p-3 shadow-sm"
									>
										<div className="flex items-start gap-2">
											<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
												<User className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="min-w-0 flex-1">
												<div className="flex items-center justify-between">
													<h3 className="truncate font-medium text-sm">
														{dev.fullname || dev.username}
													</h3>
													<Badge
														variant="secondary"
														className="px-1.5 py-0 text-xs"
													>
														{i === 0 ? "1st" : i === 1 ? "2nd" : "3rd"}
													</Badge>
												</div>
												<p className="text-muted-foreground text-xs">
													@{dev.username}
												</p>

												{dev.location && (
													<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
														<svg
															className="h-3 w-3"
															width="14"
															height="14"
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
														{dev.location}
													</p>
												)}

												<div className="mt-2 flex items-center gap-2">
													<div className="flex items-center gap-1 text-xs">
														<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
														{dev.stars}
													</div>
													<div className="flex items-center gap-1 text-xs">
														<Users className="h-3.5 w-3.5 text-muted-foreground" />
														{dev.followers}
													</div>
													<div className="flex items-center gap-1 text-xs">
														<GitFork className="h-3.5 w-3.5 text-muted-foreground" />
														{dev.repositories}
													</div>
												</div>
											</div>
										</div>

										{/* Highlight Metric */}
										<div className="mt-3 rounded bg-muted/30 px-2 py-1.5 text-xs">
											<div className="flex items-center gap-1.5">
												<Zap className="h-3.5 w-3.5 text-yellow-500" />
												<span className="font-medium">Top Metric:</span>
												<span className="flex flex-1 items-center gap-1">
													{getMetricIcon(dev.highlightMetric.type)}
													<span className="font-medium">
														{dev.highlightMetric.value}
													</span>
													{dev.highlightMetric.type}
												</span>
											</div>
											<p className="mt-1 text-muted-foreground">
												{dev.highlightMetric.description}
											</p>
										</div>

										{/* Skills */}
										{dev.topSkills.length > 0 && (
											<div className="mt-2 flex flex-wrap gap-1">
												{dev.topSkills.slice(0, 3).map((skill) => (
													<span
														key={`skill-${dev.username}-${skill}`}
														className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
													>
														{skill}
													</span>
												))}
												{dev.topSkills.length > 3 && (
													<span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
														+{dev.topSkills.length - 3}
													</span>
												)}
											</div>
										)}
									</div>
								))}
							</div>

							{summaryData.topDevelopers.length > 3 && (
								<Button
									variant="ghost"
									size="sm"
									className="mt-1 w-full text-xs"
									onClick={() => setExpanded(!expanded)}
								>
									{expanded ? (
										<>
											Show less <ChevronUp className="ml-1 h-3 w-3" />
										</>
									) : (
										<>
											Show {summaryData.topDevelopers.length - 3} more
											developers <ChevronDown className="ml-1 h-3 w-3" />
										</>
									)}
								</Button>
							)}

							{/* Show more developers button section */}
							{expanded && (
								<div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
									{summaryData.topDevelopers.slice(3).map((dev, i) => (
										<div
											key={`expanded-dev-${dev.username}`}
											className="fade-in slide-in-from-bottom-1 animate-in rounded-md border bg-card p-3 opacity-0 shadow-sm"
											style={{
												animationDelay: `${i * 100}ms`,
												animationFillMode: "forwards",
											}}
										>
											<div className="flex items-start gap-2">
												<div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted">
													<User className="h-4 w-4 text-muted-foreground" />
												</div>
												<div className="min-w-0 flex-1">
													<div className="flex items-center justify-between">
														<h3 className="truncate font-medium text-sm">
															{dev.fullname || dev.username}
														</h3>
														<Badge
															variant="secondary"
															className="px-1.5 py-0 text-xs"
														>
															{i + 4}th
														</Badge>
													</div>
													<p className="text-muted-foreground text-xs">
														@{dev.username}
													</p>

													{dev.location && (
														<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
															<svg
																className="h-3 w-3"
																width="14"
																height="14"
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
															{dev.location}
														</p>
													)}

													<div className="mt-2 flex items-center gap-2">
														<div className="flex items-center gap-1 text-xs">
															<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
															{dev.stars}
														</div>
														<div className="flex items-center gap-1 text-xs">
															<Users className="h-3.5 w-3.5 text-muted-foreground" />
															{dev.followers}
														</div>
														<div className="flex items-center gap-1 text-xs">
															<GitFork className="h-3.5 w-3.5 text-muted-foreground" />
															{dev.repositories}
														</div>
													</div>
												</div>
											</div>

											{/* Highlight Metric */}
											<div className="mt-3 rounded bg-muted/30 px-2 py-1.5 text-xs">
												<div className="flex items-center gap-1.5">
													<Zap className="h-3.5 w-3.5 text-yellow-500" />
													<span className="font-medium">Top Metric:</span>
													<span className="flex flex-1 items-center gap-1">
														{getMetricIcon(dev.highlightMetric.type)}
														<span className="font-medium">
															{dev.highlightMetric.value}
														</span>
														{dev.highlightMetric.type}
													</span>
												</div>
												<p className="mt-1 text-muted-foreground">
													{dev.highlightMetric.description}
												</p>
											</div>

											{/* Skills */}
											{dev.topSkills.length > 0 && (
												<div className="mt-2 flex flex-wrap gap-1">
													{dev.topSkills.slice(0, 3).map((skill) => (
														<span
															key={`expanded-skill-${dev.username}-${skill}`}
															className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] text-primary"
														>
															{skill}
														</span>
													))}
													{dev.topSkills.length > 3 && (
														<span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
															+{dev.topSkills.length - 3}
														</span>
													)}
												</div>
											)}
										</div>
									))}
								</div>
							)}
						</div>

						{/* Insights Section */}
						<div className="space-y-3 rounded-lg bg-muted/30 p-4">
							<h2 className="flex items-center gap-2 font-semibold text-lg">
								<LightbulbIcon className="h-4 w-4 text-yellow-500" />
								Insights
							</h2>

							{/* Common Technologies */}
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Common Technologies</h3>
								<div className="flex flex-wrap gap-1.5">
									{summaryData.insights.commonTechnologies.map((tech) => (
										<Badge
											key={`insight-tech-${tech}`}
											variant="secondary"
											className="flex items-center gap-1"
										>
											<Code className="h-3.5 w-3.5" />
											{tech}
										</Badge>
									))}
								</div>
							</div>

							{/* Most Impressive Metric */}
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Most Impressive</h3>
								<div className="rounded-md border bg-card p-3">
									<div className="flex items-center gap-2">
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
											{getMetricIcon(
												summaryData.insights.mostImpressiveMetric.type,
											)}
										</div>
										<div className="flex-1">
											<div className="flex items-center justify-between">
												<p className="font-medium text-sm">
													@{summaryData.insights.mostImpressiveMetric.username}
												</p>
												<span className="font-bold text-sm">
													{summaryData.insights.mostImpressiveMetric.value}{" "}
													{summaryData.insights.mostImpressiveMetric.type}
												</span>
											</div>
											<p className="mt-0.5 text-muted-foreground text-xs">
												{summaryData.insights.mostImpressiveMetric.description}
											</p>
										</div>
									</div>
								</div>
							</div>

							{/* Suggestion */}
							<div className="mt-3 rounded-lg border border-primary/20 bg-primary/5 p-3">
								<div className="flex gap-2">
									<LightbulbIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
									<p className="text-muted-foreground text-sm">
										{summaryData.insights.suggestion}
									</p>
								</div>
							</div>
						</div>

						{/* Markdown Summary - Initially masked */}
						<div className="relative space-y-3">
							<div className="flex items-center justify-between">
								<h2 className="flex items-center gap-2 font-semibold text-lg">
									<Sparkles className="h-4 w-4 text-primary" />
									Detailed Summary
								</h2>
								<Button
									variant="ghost"
									size="sm"
									className="text-xs"
									onClick={() => setExpanded(!expanded)}
								>
									{expanded ? (
										<>
											Collapse <ChevronUp className="ml-1 h-3 w-3" />
										</>
									) : (
										<>
											Expand <ChevronDown className="ml-1 h-3 w-3" />
										</>
									)}
								</Button>
							</div>

							<div
								className={cn(
									"prose dark:prose-invert relative max-w-none text-sm",
									!expanded &&
										"mask-b-from-transparent mask-b-from-70% mask-b-to-white dark:mask-b-to-black max-h-56 overflow-hidden",
								)}
							>
								<ReactMarkdown
									remarkPlugins={[remarkGfm]}
									components={{
										h1: ({ node, ...props }) => (
											<h1
												className="mb-3 flex items-center gap-2 font-semibold text-foreground text-xl tracking-tight"
												{...props}
											>
												<Search className="h-4 w-4 text-primary" />
												{props.children}
											</h1>
										),
										h2: ({ node, ...props }) => (
											<h2
												className="mt-5 mb-2 font-semibold text-foreground text-lg tracking-tight"
												{...props}
											/>
										),
										h3: ({ node, ...props }) => (
											<h3
												className="mt-3 mb-2 font-medium text-base text-foreground"
												{...props}
											/>
										),
										p: ({ node, ...props }) => (
											<p
												className="mb-3 text-muted-foreground text-sm"
												{...props}
											/>
										),
										strong: ({ node, ...props }) => (
											<strong
												className="font-semibold text-foreground"
												{...props}
											/>
										),
										table: ({ node, ...props }) => (
											<div className="my-3 w-full overflow-auto rounded-lg border">
												<table
													className="w-full caption-bottom text-xs"
													{...props}
												/>
											</div>
										),
										thead: ({ node, ...props }) => (
											<thead className="border-b bg-muted/50" {...props} />
										),
										tbody: ({ node, ...props }) => (
											<tbody className="divide-y" {...props} />
										),
										tr: ({ node, ...props }) => (
											<tr
												className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
												{...props}
											/>
										),
										th: ({ node, ...props }) => (
											<th
												className="h-8 px-3 text-left align-middle font-medium text-muted-foreground"
												{...props}
											/>
										),
										td: ({ node, ...props }) => (
											<td
												className="p-2 align-middle [&:has([role=checkbox])]:pr-0"
												{...props}
											/>
										),
										ul: ({ node, ...props }) => (
											<ul
												className="my-3 list-disc space-y-1 pl-5 text-muted-foreground text-sm"
												{...props}
											/>
										),
										ol: ({ node, ...props }) => (
											<ol
												className="my-3 list-decimal space-y-1 pl-5 text-muted-foreground text-sm"
												{...props}
											/>
										),
										li: ({ node, ...props }) => (
											<li className="my-0.5" {...props} />
										),
										a: ({ node, href, ...props }) => (
											<a
												className="font-medium text-primary underline underline-offset-4"
												href={href}
												target="_blank"
												rel="noopener noreferrer"
												{...props}
											/>
										),
										blockquote: ({ node, ...props }) => (
											<blockquote
												className="my-3 border-border border-l-4 pl-4 text-muted-foreground italic"
												{...props}
											/>
										),
										code: ({ node, className, ...props }) => {
											// Check if it's an inline code block based on the className
											const isInline =
												!className || !className.includes("language-");
											return isInline ? (
												<code
													className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs"
													{...props}
												/>
											) : (
												<code
													className="block rounded-md bg-muted p-3 font-mono text-xs"
													{...props}
												/>
											);
										},
										hr: ({ node, ...props }) => (
											<hr className="my-4 border-border" {...props} />
										),
										// Custom components for specific text patterns in the markdown
										text: ({ node, children }) => {
											// Check for special patterns and add icons accordingly
											const text = String(children);

											// Match "X developers found" or "Found X developers"
											if (
												/(\d+) developers found|Found (\d+) developers/.test(
													text,
												)
											) {
												return (
													<span className="inline-flex items-center gap-1.5">
														<Users className="h-3.5 w-3.5 text-muted-foreground" />
														{text}
													</span>
												);
											}

											// Match star counts
											if (/\b\d+ stars\b/.test(text)) {
												return (
													<span className="inline-flex items-center gap-1.5">
														<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
														{text}
													</span>
												);
											}

											// Match follower counts
											if (/\b\d+ followers\b/.test(text)) {
												return (
													<span className="inline-flex items-center gap-1.5">
														<Users className="h-3.5 w-3.5 text-muted-foreground" />
														{text}
													</span>
												);
											}

											// Match contribution counts
											if (/\b\d+ contributions\b/.test(text)) {
												return (
													<span className="inline-flex items-center gap-1.5">
														<BarChart className="h-3.5 w-3.5 text-muted-foreground" />
														{text}
													</span>
												);
											}

											// Match repository counts
											if (/\b\d+ repositories\b/.test(text)) {
												return (
													<span className="inline-flex items-center gap-1.5">
														<GitFork className="h-3.5 w-3.5 text-muted-foreground" />
														{text}
													</span>
												);
											}

											// Default rendering
											return <>{children}</>;
										},
									}}
								>
									{summaryData.markdownSummary}
								</ReactMarkdown>
							</div>

							{!expanded && (
								<div className="absolute right-0 bottom-0 left-0 flex justify-center">
									<Button
										variant="ghost"
										size="sm"
										className="text-xs"
										onClick={() => setExpanded(true)}
									>
										Show Full Summary <ChevronDown className="ml-1 h-3 w-3" />
									</Button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="p-4 text-center text-muted-foreground">
						No summary data available
					</div>
				)}
			</CardContent>
		</Card>
	);
}
