import { EmptyState } from "@/components/EmptyState";
import { Header } from "@/components/header";
import {
	EmptyRepositoryIcon,
	GitHubSadFaceIcon,
} from "@/components/icons/EmptyStateIcons";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { redis } from "@/redis";
import {
	ArrowLeft,
	ArrowUpRight,
	BarChart,
	ChevronRight,
	Filter,
	Github,
	MapPin,
	Sparkles,
	Star,
	Users,
	Wrench,
	Zap,
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

	// Format for display
	const formattedQuery = slug.replace(/-/g, " ");
	const locationText =
		searchParams.city && searchParams.country
			? `${searchParams.city}, ${searchParams.country}`
			: searchParams.city || searchParams.country || null;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />

			<main className="container mx-auto flex-1 px-4 py-8">
				<div className="mx-auto w-full max-w-5xl">
					{/* Search Header */}
					<div className="mb-8">
						<div className="mb-2 flex items-center gap-2">
							<Link
								href="/"
								className="text-muted-foreground hover:text-foreground"
							>
								<ArrowLeft className="size-4" />
							</Link>
							<h1 className="font-medium text-2xl capitalize">
								{formattedQuery}
							</h1>
						</div>

						{/* Search Metadata */}
						<div className="mt-4 flex flex-wrap items-center gap-3">
							{locationText && (
								<Badge
									variant="outline"
									className="flex items-center gap-1.5 px-2 py-1"
								>
									<MapPin className="size-3" />
									{locationText}
								</Badge>
							)}

							{searchParams.techStack.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{searchParams.techStack.map((tech) => (
										<Badge key={tech} variant="secondary" className="px-2 py-1">
											{tech}
										</Badge>
									))}
								</div>
							)}

							{searchParams.roles.length > 0 && (
								<Badge
									variant="outline"
									className="flex items-center gap-1.5 px-2 py-1"
								>
									<Sparkles className="size-3" />
									{searchParams.roles[0]}
									{searchParams.roles.length > 1 &&
										` +${searchParams.roles.length - 1}`}
								</Badge>
							)}
						</div>
					</div>

					{/* Results Count */}
					<div className="mb-6 flex items-center justify-between">
						<h2 className="text-muted-foreground text-sm">
							Found{" "}
							<span className="font-medium text-foreground">
								{usersSorted.length}
							</span>{" "}
							developers
						</h2>

						<Button variant="outline" size="sm" className="gap-1.5">
							<Filter className="size-3.5" />
							Filters
						</Button>
					</div>

					{/* Results Grid */}
					{usersSorted.length > 0 ? (
						<div className="flex flex-col space-y-2">
							{usersSorted.map((user) => (
								<div
									key={user.id}
									className="group flex items-center rounded-md border border-border bg-card p-3 transition-colors hover:border-border/80 hover:bg-card/80"
								>
									<div className="flex flex-1 items-center gap-3">
										{/* Avatar */}
										<div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
											<img
												src={user.avatarUrl}
												alt={`${user.username}'s avatar`}
												className="h-full w-full object-cover"
											/>
										</div>

										{/* Basic Info */}
										<div className="min-w-0 flex-1">
											<div className="flex items-center gap-1.5">
												<h3 className="truncate font-medium">
													{user.fullname || user.username}
												</h3>
												{user.country && (
													<span className="flex items-center gap-1 text-muted-foreground text-xs">
														<CountryFlag
															countryCode={
																user.country === "Peru" ? "PE" : "US"
															}
														/>
														{user.country}
													</span>
												)}
											</div>
											<div className="flex items-center gap-2 text-muted-foreground text-xs">
												{user.username && (
													<span className="flex items-center gap-1 truncate">
														<Github className="h-3 w-3" />
														{user.username}
													</span>
												)}
												{user.stack && user.stack.length > 0 && (
													<span className="flex items-center gap-1">
														<Wrench className="h-3 w-3" />
														<span className="truncate">
															{user.stack.slice(0, 3).join(", ")}
														</span>
														{user.stack.length > 3 && (
															<span>+{user.stack.length - 3}</span>
														)}
													</span>
												)}
											</div>
										</div>
									</div>

									{/* Stats */}
									<div className="flex items-center gap-4 text-sm">
										{user.stars > 0 && (
											<div className="flex items-center gap-1">
												<Star className="h-4 w-4 fill-amber-500 text-amber-500" />
												<span>
													{user.stars > 1000
														? `${(user.stars / 1000).toFixed(1)}k`
														: user.stars}
												</span>
											</div>
										)}
										{user.followers > 0 && (
											<div className="flex items-center gap-1 text-muted-foreground">
												<Users className="h-4 w-4" />
												<span>
													{user.followers > 1000
														? `${(user.followers / 1000).toFixed(1)}k`
														: user.followers}
												</span>
											</div>
										)}
										{user.contributions > 0 && (
											<div className="hidden items-center gap-1 text-muted-foreground md:flex">
												<BarChart className="h-4 w-4" />
												<span>
													{user.contributions > 1000
														? `${(user.contributions / 1000).toFixed(1)}k`
														: user.contributions}
												</span>
											</div>
										)}
										<div className="hidden items-center gap-1 text-emerald-600 md:flex">
											<Zap className="h-4 w-4" />
											<span>{Math.floor(70 + Math.random() * 30)}</span>
										</div>
									</div>

									{/* Actions */}
									<div className="ml-4 flex items-center gap-2">
										<Button
											variant="ghost"
											size="icon"
											className="h-8 w-8 text-muted-foreground hover:text-foreground"
											asChild
										>
											<Link href={`/developer/${user.username}`}>
												<ChevronRight className="h-4 w-4" />
												<span className="sr-only">View local profile</span>
											</Link>
										</Button>
										<Button
											variant="outline"
											size="icon"
											className="h-8 w-8"
											asChild
										>
											<Link
												href={`https://github.com/${user.username}`}
												target="_blank"
												rel="noopener noreferrer"
											>
												<ArrowUpRight className="h-4 w-4" />
												<span className="sr-only">View GitHub profile</span>
											</Link>
										</Button>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="rounded-md border border-dashed p-8">
							<EmptyState
								title="No developers found"
								description="Looks like these developers are hiding their code too well."
								titleSize="xl"
								icon={<EmptyRepositoryIcon />}
								codeSnippet={{
									command: "git clone developers/with-different-skills",
								}}
								actionButton={{
									label: "Try with different search",
									href: "/",
									icon: <ArrowLeft className="size-3.5" />,
									variant: "outline",
									size: "sm",
								}}
							/>
						</div>
					)}
				</div>
			</main>

			{/* Footer */}
			<footer className="mt-auto border-t border-dashed py-4">
				<div className="container mx-auto px-4">
					<p className="text-center text-muted-foreground text-xs">
						© {new Date().getFullYear()} GitHunter · Find top GitHub talent
					</p>
				</div>
			</footer>
		</div>
	);
}
