import {
	ArrowLeft,
	BarChart,
	Code2,
	ExternalLink,
	GitFork,
	Star,
	Terminal,
	Trophy,
	Users,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/footer";
import GitHunterLogo from "@/components/githunter-logo";
import { Header } from "@/components/header";
import {
	EmptyRepositoryIcon,
	GitHubSadFaceIcon,
} from "@/components/icons/EmptyStateIcons";
import { SearchBox } from "@/components/search";
import { SpokenDigest } from "@/components/search/SpokenDigest";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { UserButton } from "@/components/user-button";
import { cn } from "@/lib/utils";

import { getCountryCode } from "@/lib/country-codes";
import { redis } from "@/redis";

import { CompareFloatingPanel } from "@/components/compare-floating-panel";
import { CompareSelectButton } from "@/components/compare-select-button";
import { CollapsibleSummary } from "@/components/search/CollapsibleSummary";
import { getQueryParams } from "./get-query-params";
import { queryUsers } from "./query-users";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

export default async function SearchPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const searchParams = await getQueryParams(slug);

	if (Object.keys(searchParams).length === 0) {
		return (
			<div className="flex min-h-screen flex-col bg-background">
				<Header />
				<main className="container mx-auto flex flex-1 flex-col items-center justify-center px-4 py-12">
					<EmptyState
						title="Oops! Developer Not Found"
						subtitle="404: Git Confusion"
						description="Looks like we couldn't find any devs matching this query. They might be busy fixing merge conflicts or debugging in production."
						icon={<GitHubSadFaceIcon />}
						fullPage={true}
						codeSnippet={{
							command: "git checkout developers",
							error:
								"pathspec 'developers' did not match any file(s) known to git",
						}}
						actionButton={{
							label: "Return to Home Branch",
							href: "/",
							icon: <ArrowLeft className="size-4" />,
						}}
					/>
				</main>
			</div>
		);
	}

	const { paginatedUsers, totalUsers, totalPages } = await queryUsers(
		slug,
		searchParams,
		1,
	);

	// Delete the cached summary each time is revalidated
	await redis.del(`search-summary:${slug}`);

	await Promise.all(
		paginatedUsers.map(
			(user, index) =>
				index < 10 &&
				redis.hset(`rank:${user.username}`, {
					[slug]: index + 1,
				}),
		),
	);

	// Format for display
	const formattedQuery = slug.replace(/-/g, " ");

	// Get top developers for summary
	const topDevelopers = paginatedUsers.slice(0, 3).map((user) => ({
		username: user.username,
		fullname: user.fullname || user.username,
		stars: user.stars,
		repositories: user.repos?.length || 0,
		followers: user.followers,
	}));

	// Get tech stack from all users
	const techStack = Array.from(
		new Set(paginatedUsers.flatMap((user) => user.stack || []).filter(Boolean)),
	).slice(0, 5);

	// Get location if available
	const location = paginatedUsers[0]?.country || null;

	return (
		<div className="min-h-screen bg-white dark:bg-[#121212]">
			{/* Search bar - Similar to search engines */}
			<div className="sticky top-0 z-10 border-b border-dashed bg-background py-3">
				<div className="flex items-center justify-between px-4 md:mx-3">
					<div className="flex w-full items-center gap-2 md:gap-12">
						<Link href="/" className="flex items-center gap-2">
							<div className="rounded-sm border border-border p-1.5">
								<GitHunterLogo className="size-4 " />
							</div>
							<span className="hidden font-medium text-lg tracking-tight md:block">
								GitHunter
							</span>
						</Link>

						<div className="relative max-w-2xl flex-1">
							<SearchBox initialQuery={formattedQuery} variant="compact" />
						</div>
					</div>

					<UserButton />
				</div>
			</div>

			<main className="container mx-auto min-h-[calc(100dvh-10rem)] px-4 py-4">
				{/* Search Summary - AI generated overview of results */}
				<div className="mb-4 py-3">
					<div className="flex flex-wrap items-center gap-1.5">
						<Badge
							variant="secondary"
							className="flex items-center gap-1 px-2 py-0.5 text-xs"
						>
							<Users className="h-3 w-3" />
							{totalUsers} developers
						</Badge>

						{location && (
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
								{location}
							</Badge>
						)}

						{techStack.slice(0, 3).map((tech) => (
							<Badge
								key={`tech-${tech}`}
								variant="outline"
								className="flex items-center gap-1 px-2 py-0.5 text-xs"
							>
								<Terminal className="h-3 w-3" />
								{tech}
							</Badge>
						))}

						{techStack.length > 3 && (
							<Badge variant="outline" className="px-2 py-0.5 text-xs">
								+{techStack.length - 3} more
							</Badge>
						)}
					</div>
				</div>

				{/* Summary Card */}
				<CollapsibleSummary>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<SpokenDigest slug={slug} />
						{/* Right Column - Top Developers */}
						<div className="space-y-3">
							<div className="mb-2 flex items-center gap-2">
								<Trophy className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />
								<h2 className="font-medium text-sm">Top Developers</h2>
							</div>

							<div className="grid grid-cols-1 gap-2">
								{topDevelopers.map((dev, i) => {
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
														{dev.fullname}
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
					</div>
				</CollapsibleSummary>

				{/* Results List */}
				{paginatedUsers.length > 0 ? (
					<div className="space-y-6">
						{paginatedUsers.map((user) => (
							<div
								key={user.id}
								className="group border-border/40 border-b pb-6"
							>
								{/* Grid layout */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
									{/* Contenido del usuario (3/4 width on md+ screens) */}
									<div className="md:col-span-3">
										<div className="group relative">
											{/* Avatar y contenido */}
											<div className="flex items-start gap-3">
												{/* Avatar */}
												<Link
													href={`/developer/${user.username}`}
													className="flex-shrink-0"
												>
													<div className="h-10 w-10 overflow-hidden rounded-full border border-border">
														<img
															src={user.avatarUrl}
															alt={`${user.username}'s avatar`}
															className="h-full w-full object-cover"
														/>
													</div>
												</Link>

												{/* Content */}
												<div className="min-w-0 flex-1">
													{/* Title row with name & country */}
													<div className="mb-1 flex items-center gap-2">
														<Link
															href={`/developer/${user.username}`}
															className="font-medium text-[#2300A7] text-xl hover:underline dark:text-[#75A9FF]"
														>
															{user.fullname || user.username}
														</Link>
														{user.country && (
															<span className="flex items-center">
																<CountryFlag
																	countryCode={
																		getCountryCode(user.country) || "us"
																	}
																	size="sm"
																/>
															</span>
														)}
													</div>

													{/* GitHub username */}
													<div className="mb-1 text-[#008080] text-sm dark:text-[#98FEE3]">
														<Link
															href={`https://github.com/${user.username}`}
															target="_blank"
															rel="noopener noreferrer"
															className="flex max-w-max items-center gap-1 font-medium hover:underline"
														>
															github.com/{user.username}
															<ExternalLink className="h-3 w-3 text-muted-foreground" />
														</Link>
													</div>

													{/* About section */}
													{user.about && (
														<p className="mb-2 line-clamp-2 overflow-hidden text-ellipsis text-foreground text-sm">
															{user.about}
														</p>
													)}

													{/* Tech stack as small pills */}
													{user.stack && user.stack.length > 0 && (
														<div className="mb-2 flex flex-wrap gap-1">
															{user.stack.slice(0, 4).map((tech) => (
																<span
																	key={tech}
																	className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300"
																>
																	{tech}
																</span>
															))}
															{user.stack.length > 4 && (
																<span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300">
																	+{user.stack.length - 4}
																</span>
															)}
														</div>
													)}

													{/* Stats row */}
													<div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
														{user.stars > 0 && (
															<div className="flex items-center gap-1">
																<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
																<span>{user.stars.toLocaleString()} stars</span>
															</div>
														)}
														{user.followers > 0 && (
															<div className="flex items-center gap-1">
																<Users className="h-3.5 w-3.5" />
																<span>
																	{user.followers.toLocaleString()} followers
																</span>
															</div>
														)}
														{user.contributions > 0 && (
															<div className="flex items-center gap-1">
																<BarChart className="h-3.5 w-3.5" />
																<span>
																	{user.contributions.toLocaleString()}{" "}
																	contributions
																</span>
															</div>
														)}
													</div>
												</div>
											</div>

											{/* Botón de comparación con posición absoluta */}
											<CompareSelectButton
												username={user.username}
												fullname={user.fullname || user.username}
											/>
										</div>
									</div>

									{/* Repository column (1/4 width on md+ screens) */}
									<div className="md:col-span-1">
										{user.repos && user.repos.length > 0 ? (
											<div className="space-y-2">
												<h3 className="mb-1 font-medium text-muted-foreground text-xs uppercase">
													Top Repository
												</h3>
												{user.repos.slice(0, 1).map((repo) => (
													<div
														key={repo.fullName}
														className="rounded-md border bg-muted/10 p-3 transition-colors hover:bg-muted/20"
													>
														<h4 className="truncate font-medium text-sm">
															<Link
																href={`https://github.com/${repo.fullName}`}
																target="_blank"
																rel="noopener noreferrer"
																className="flex items-center gap-1.5 text-[#2300A7] hover:underline dark:text-[#75A9FF]"
															>
																<Code2 className="h-3.5 w-3.5" />
																{repo.fullName.split("/")[1]}
															</Link>
														</h4>
														{repo.description && (
															<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
																{repo.description}
															</p>
														)}
														<div className="mt-2 flex items-center gap-3 text-muted-foreground text-xs">
															<div className="flex items-center gap-1">
																<Star className="h-3 w-3 text-[#E87701] dark:text-[#FFC799]" />
																<span>{repo.stars}</span>
															</div>
															<div className="flex items-center gap-1">
																<GitFork className="h-3 w-3" />
																<span>{Math.floor(repo.stars * 0.4)}</span>
															</div>
														</div>
														{repo.techStack && repo.techStack.length > 0 && (
															<div className="mt-2 flex flex-wrap gap-1">
																{repo.techStack.slice(0, 2).map((tech) => (
																	<span
																		key={tech}
																		className="inline-flex rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300"
																	>
																		{tech}
																	</span>
																))}
															</div>
														)}
													</div>
												))}
											</div>
										) : (
											<div className="flex h-full flex-col items-center justify-center rounded-md border bg-muted/10 p-3 text-center">
												<p className="text-muted-foreground text-xs">
													No repository data available
												</p>
											</div>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="mx-auto max-w-[660px] rounded-lg border border-dashed p-8">
						<EmptyState
							title="No developers found"
							description="Try adjusting your search criteria to find more developers."
							titleSize="xl"
							icon={<EmptyRepositoryIcon />}
							codeSnippet={{
								command: "git clone developers/with-different-skills",
							}}
							actionButton={{
								label: "New search",
								href: "/",
								icon: <ArrowLeft className="size-3.5" />,
								variant: "outline",
								size: "sm",
							}}
						/>
					</div>
				)}
				{/* Pagination component */}
				{totalPages > 1 && (
					<div className="mt-8 flex justify-center">
						<Pagination
							currentPage={1}
							totalPages={totalPages}
							baseUrl={`/search/${slug}/p`}
							firstPageUrl={`/search/${slug}`}
						/>
					</div>
				)}

				{/* Panel flotante para comparar */}
				<CompareFloatingPanel />
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const formattedQuery = slug.replace(/-/g, " ");

	const title = `${formattedQuery} | GitHunter`;
	const description =
		"Find top GitHub developers. Discover talented programmers, view stats, repositories and more.";
	const ogImageUrl = `/api/og/search?q=${encodeURIComponent(formattedQuery)}`;

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [ogImageUrl],
			url: `/search/${slug}`,
			siteName: "GitHunter",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [`${ogImageUrl}/opengraph-image`],
		},
		keywords: formattedQuery.split(" ").filter(Boolean),
	};
}

export async function generateStaticParams() {
	// Use scan with a pattern match to get all search keys
	const searchKeys = [];
	let cursor = "0";

	do {
		const [nextCursor, keys] = await redis.scan(cursor, { match: "search:*" });
		cursor = nextCursor;
		searchKeys.push(...keys);
	} while (cursor !== "0");

	// Extract the slug from each key (remove the "search:" prefix)
	return searchKeys.map((key) => ({
		slug: key.replace("search:", ""),
	}));
}

// Helper function to determine top metric for each developer
function getTopMetric(dev: {
	stars: number;
	repositories: number;
	followers: number;
}) {
	// Compare metrics to find the highest relative to typical values
	const metrics = [
		{
			name: "stars",
			value: dev.stars,
			icon: <Star className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />,
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
}
