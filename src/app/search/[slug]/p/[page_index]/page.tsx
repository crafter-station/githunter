import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/footer";
import GitHunterLogo from "@/components/githunter-logo";
import { Header } from "@/components/header";
import {
	EmptyRepositoryIcon,
	GitHubSadFaceIcon,
} from "@/components/icons/EmptyStateIcons";
import { SearchBox } from "@/components/search";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { UserButton } from "@/components/user-button";
import { getCountryCode } from "@/lib/country-codes";
import {
	ArrowLeft,
	BarChart,
	Code2,
	ExternalLink,
	GitFork,
	Star,
	Terminal,
	Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getQueryParams } from "../../get-query-params";
import { queryUsers } from "../../query-users";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

export async function generateStaticParams() {
	return [];
}

export default async function SearchPagePaginated({
	params,
}: {
	params: Promise<{ slug: string; page_index: string }>;
}) {
	const { slug, page_index } = await params;
	const pageIndex = Number.parseInt(page_index, 10) || 1;

	if (pageIndex < 1) {
		return notFound();
	}
	if (pageIndex > 10) {
		return notFound();
	}

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
		pageIndex,
	);

	// Format for display
	const formattedQuery = slug.replace(/-/g, " ");

	// Get tech stack from all users (like main page)
	const techStack = Array.from(
		new Set(paginatedUsers.flatMap((user) => user.stack || []).filter(Boolean)),
	).slice(0, 5);

	// Get location if available (like main page)
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
				{/* Search metadata/tags */}
				<div className="mb-4 border-border/40 border-b py-3">
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

						{totalPages > 1 && (
							<span className="text-muted-foreground text-sm">
								(Page {pageIndex} of {totalPages})
							</span>
						)}
					</div>
				</div>

				{/* Results List */}
				{paginatedUsers.length > 0 ? (
					<div className="space-y-6">
						{paginatedUsers.map((user) => (
							<div
								key={user.id}
								className="group border-border/40 border-b pb-6"
							>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
									{/* Main content (3/4 width on md+ screens) */}
									<div className="md:col-span-3">
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

												{/* About section instead of tech stack */}
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
									</div>

									{/* Repository column (1/4 width on md+ screens) */}
									<div className="flex flex-col md:col-span-1">
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
							currentPage={pageIndex}
							totalPages={totalPages}
							baseUrl={`/search/${slug}/p`}
							firstPageUrl={`/search/${slug}`}
						/>
					</div>
				)}
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
