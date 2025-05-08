import { EmptyState } from "@/components/EmptyState";
import { Footer } from "@/components/footer";
import GitHunterLogo from "@/components/githunter-logo";
import { Header } from "@/components/header-2";
import {
	EmptyRepositoryIcon,
	GitHubSadFaceIcon,
} from "@/components/icons/EmptyStateIcons";
import { SearchBox } from "@/components/search";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { UserButton } from "@/components/user-button";
import { getCountryCode } from "@/lib/country-codes";
import { redis } from "@/redis";
import {
	ArrowLeft,
	BarChart,
	Code2,
	ExternalLink,
	GitFork,
	MapPin,
	Sparkles,
	Star,
	Users,
	Wrench,
} from "lucide-react";
import Link from "next/link";
import { getQueryParams } from "./get-query-params";
import { queryUsers } from "./query-users";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

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

	const usersSorted = await queryUsers(searchParams);
	console.log({ usersSorted });

	// Format for display
	const formattedQuery = slug.replace(/-/g, " ");
	const locationText =
		searchParams.city && searchParams.country
			? `${searchParams.city}, ${searchParams.country}`
			: searchParams.city || searchParams.country || null;

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
				{/* Search metadata/filters */}
				<div className="mb-4 border-b pb-3 text-muted-foreground text-sm">
					<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
						<div className="flex items-center">
							<span className="mr-2 font-medium text-foreground">
								{usersSorted.length} results
							</span>
							<span>for developers</span>
						</div>

						{locationText && (
							<div className="flex items-center gap-1.5">
								<MapPin className="size-3.5" />
								{locationText}
							</div>
						)}

						{searchParams.techStack.length > 0 && (
							<div className="flex items-center gap-1.5">
								<Wrench className="size-3.5" />
								{searchParams.techStack.slice(0, 2).join(", ")}
								{searchParams.techStack.length > 2 &&
									` +${searchParams.techStack.length - 2}`}
							</div>
						)}

						{searchParams.roles.length > 0 && (
							<div className="flex items-center gap-1.5">
								<Sparkles className="size-3.5" />
								{searchParams.roles[0]}
								{searchParams.roles.length > 1 &&
									` +${searchParams.roles.length - 1}`}
							</div>
						)}
					</div>
				</div>

				{/* Results List */}
				{usersSorted.length > 0 ? (
					<div className="space-y-6">
						{usersSorted.map((user) => (
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
			</main>

			{/* Footer */}
			<Footer />
		</div>
	);
}
