import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RepoCardSection } from "@/components/profile/RepoCardSection";
import { CountryFlag } from "@/components/ui/CountryFlag";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserSkillsRadar from "@/components/user-skills-radar";
import type { RepoOfUser } from "@/core/models/user";
import { getSimilarUsers, getUserByUsername } from "@/db/query/user";
import { getCountryCode } from "@/lib/country-codes";
import { redis } from "@/redis";
import { BookCopy, Code, Pin, Star, User, Users } from "lucide-react";
import {
	BarChart,
	Building2,
	ExternalLink,
	Github,
	Globe,
	Linkedin,
	MapPin,
	Share2,
	Twitter,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

interface DeveloperPageProps {
	params: Promise<{ username: string }>;
}

interface SocialLink {
	name: string;
	url: string;
	icon: ReactNode;
}

function getUserContributions(repos: RepoOfUser[]) {
	if (!repos || !repos.length)
		return { issues: 0, pullRequests: 0, commits: 0 };

	return repos.reduce(
		(acc, repo) => ({
			issues: acc.issues + (repo.contribution?.issuesCount || 0),
			pullRequests:
				acc.pullRequests + (repo.contribution?.pullRequestsCount || 0),
			commits: acc.commits + (repo.contribution?.commitsCount || 0),
		}),
		{ issues: 0, pullRequests: 0, commits: 0 },
	);
}

// Determine if repo is from an organization
// function isOrgRepo(fullName: string, username: string) {
// 	const owner = fullName.split("/")[0];
// 	return owner !== username;
// }

export async function generateStaticParams() {
	return [];
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
	const { username } = await params;

	const userData = await getUserByUsername(username);

	if (!userData) {
		notFound();
	}

	// Determine if repo is from an organization
	const isOrgRepo = (fullName: string) => {
		const owner = fullName.split("/")[0];
		return owner !== userData.username;
	};

	// Calculate contributions after checking userData is not null
	const contributions = getUserContributions(userData.repos);

	const similarUsers = await getSimilarUsers(userData.id, 3);
	const rank =
		(await redis.hgetall<Record<string, number>>(`rank:${username}`)) || {};

	// Format social links
	const socialLinks: SocialLink[] = [
		{
			name: "GitHub",
			url: `https://github.com/${userData.username}`,
			icon: <Github className="h-4 w-4" />,
		},
		userData.website && {
			name: "Website",
			url: userData.website,
			icon: <Globe className="h-4 w-4" />,
		},
		userData.twitter && {
			name: "Twitter",
			url: userData.twitter,
			icon: <Twitter className="h-4 w-4" />,
		},
		userData.linkedin && {
			name: "LinkedIn",
			url: userData.linkedin,
			icon: <Linkedin className="h-4 w-4" />,
		},
	].filter(Boolean) as SocialLink[];

	// Organizations the user belongs to
	const orgSet = new Set<string>();
	for (const repo of userData.repos || []) {
		const repoOwner = repo.fullName.split("/")[0];
		if (repoOwner !== userData.username) {
			orgSet.add(repoOwner);
		}
	}
	const organizations = Array.from(orgSet);

	// Get repositories for display
	const userRepos = userData.repos || [];
	const pinnedRepos = userData.pinnedRepos || [];

	// Filter out pinned repos from user repos
	const uniqueUserRepos = userRepos.filter(
		(repo) =>
			!pinnedRepos.some((pinnedRepo) => pinnedRepo.fullName === repo.fullName),
	);

	// Get duplicate repos from pinned repos
	const duplicateRepos = pinnedRepos.filter((pinnedRepo) =>
		userRepos.some((repo) => repo.fullName === pinnedRepo.fullName),
	);

	// Identify if it's a duplicate repo
	const isDuplicateRepo = (fullName: string) =>
		duplicateRepos.some((repo) => repo.fullName === fullName);

	const visibleRepos = uniqueUserRepos.slice(0, 6); // Show first 6 repos

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />
			<main className="flex-1">
				<div className="mx-auto w-full px-4 py-2 lg:px-10 lg:py-8">
					<div className="grid grid-cols-1 gap-6 md:grid-cols-12">
						{/* Left column - Profile sidebar */}
						<div className="md:col-span-3">
							<div className="md:sticky md:top-20">
								<Card className="overflow-hidden pt-0">
									<CardHeader className="p-0">
										<div className="relative border-border/50 border-b bg-muted p-4 text-center dark:border-border/20 dark:bg-muted/20">
											<div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-background shadow-sm">
												<Image
													src={userData.avatarUrl}
													alt={`${userData.fullname}'s profile picture`}
													width={96}
													height={96}
													className="h-full w-full object-cover"
													priority
												/>
											</div>
											<h1 className="mt-3 font-semibold text-[#2300A7] text-xl dark:text-[#75A9FF]">
												{userData.fullname}
											</h1>
											<div className="flex items-center justify-center gap-1 text-[#008080] text-sm dark:text-[#98FEE3]">
												<Link
													href={`https://github.com/${userData.username}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center gap-0.5 hover:underline"
												>
													@{userData.username}
													<ExternalLink className="h-3 w-3 text-muted-foreground" />
												</Link>
											</div>

											{/* Social links */}
											<div className="mt-3 flex flex-wrap justify-center space-x-2">
												{/* Share button */}
												<Button
													size="sm"
													variant="ghost"
													className="h-8 w-8 p-0"
													aria-label="Share profile"
												>
													<Share2 className="h-4 w-4" />
												</Button>

												{socialLinks.map((link) => (
													<Button
														asChild
														key={link.name}
														size="sm"
														variant="ghost"
														className="h-8 w-8 p-0"
													>
														<a
															href={link.url}
															target="_blank"
															rel="noopener noreferrer"
															aria-label={`Visit ${userData.username}'s ${link.name}`}
														>
															{link.icon}
														</a>
													</Button>
												))}
											</div>
										</div>
									</CardHeader>

									<CardContent className="p-4">
										{/* Stats grid */}
										<div className="mb-4 grid grid-cols-2 gap-2">
											<div className="rounded-md bg-muted/20 p-2 text-center">
												<div className="font-semibold text-lg text-primary">
													{userData.stars}
												</div>
												<div className="text-muted-foreground text-xs">
													Stars
												</div>
											</div>
											<div className="rounded-md bg-muted/20 p-2 text-center">
												<div className="font-semibold text-lg text-primary">
													{userData.repositories}
												</div>
												<div className="text-muted-foreground text-xs">
													Repos
												</div>
											</div>
											<div className="rounded-md bg-muted/20 p-2 text-center">
												<div className="font-semibold text-lg text-primary">
													{userData.followers}
												</div>
												<div className="text-muted-foreground text-xs">
													Followers
												</div>
											</div>
											<div className="rounded-md bg-muted/20 p-2 text-center">
												<div className="font-semibold text-lg text-primary">
													{userData.following}
												</div>
												<div className="text-muted-foreground text-xs">
													Following
												</div>
											</div>
										</div>

										{/* Location */}
										{(userData.city || userData.country) && (
											<div className="mb-3 flex items-center gap-2 text-sm">
												{getCountryCode(userData.country) ? (
													<CountryFlag
														countryCode={
															getCountryCode(userData.country) || "us"
														}
														size="sm"
													/>
												) : (
													<MapPin className="h-4 w-4 text-muted-foreground" />
												)}
												<span className="text-muted-foreground">
													{[userData.city, userData.country]
														.filter(Boolean)
														.join(", ")}
												</span>
											</div>
										)}

										{/* Contributions */}
										<div className="mb-3 flex items-center gap-2 text-sm">
											<BarChart className="h-4 w-4 text-muted-foreground" />
											<span className="text-muted-foreground">
												{userData.contributions.toLocaleString()} contributions
											</span>
										</div>

										{/* Organizations */}
										{organizations.length > 0 && (
											<div className="mb-4">
												<h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase">
													Organizations
												</h3>
												<div className="space-y-1">
													{organizations.slice(0, 3).map((org) => (
														<a
															key={org}
															href={`https://github.com/${org}`}
															target="_blank"
															rel="noopener noreferrer"
															className="flex items-center rounded-md bg-muted/20 p-2 text-sm transition-colors hover:bg-muted/30"
														>
															<Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
															<span>{org}</span>
														</a>
													))}
													{organizations.length > 3 && (
														<div className="text-right text-muted-foreground text-xs">
															+{organizations.length - 3} more
														</div>
													)}
												</div>
											</div>
										)}

										{/* Potential Roles */}
										{userData.potentialRoles &&
											userData.potentialRoles.length > 0 && (
												<div>
													<h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase">
														Potential Roles
													</h3>
													<div className="flex flex-wrap gap-1">
														{userData.potentialRoles.map((role) => (
															<span
																key={role}
																className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300"
															>
																{role}
															</span>
														))}
													</div>
												</div>
											)}
									</CardContent>
								</Card>
							</div>
						</div>

						{/* Middle and Right columns */}
						<div className="md:col-span-9">
							{/* Top section with 2 columns layout */}
							<div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
								{/* Left column - About and Tech Stack stacked vertically */}
								<div className="flex flex-col gap-6">
									{/* About section */}
									<Card className="flex-1 gap-0">
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center font-medium text-lg">
												<User className="mr-2 h-4 w-4 text-primary" />
												About
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="text-muted-foreground text-sm">
												{userData.about || "No information available"}
											</p>
										</CardContent>
									</Card>

									{/* Stack section */}
									<Card className="flex-1">
										<CardHeader className="pb-2">
											<CardTitle className="flex items-center font-medium text-lg">
												<Code className="mr-2 h-4 w-4 text-primary" />
												Tech Stack
											</CardTitle>
										</CardHeader>
										<CardContent>
											<div className="flex flex-wrap gap-2">
												{userData.stack && userData.stack.length > 0 ? (
													userData.stack.map((tech) => (
														<span
															key={tech}
															className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs"
														>
															{tech}
														</span>
													))
												) : (
													<p className="text-muted-foreground text-sm">
														No tech stack information available
													</p>
												)}
											</div>
										</CardContent>
									</Card>
								</div>

								{/* Right column - GitHub Metrics */}
								<div>
									<UserSkillsRadar
										metrics={{
											followers: userData.followers,
											stars: userData.stars,
											repositories: userData.repositories,
											issues: contributions.issues,
											pullRequests: contributions.pullRequests,
											commits: contributions.commits,
										}}
										className="h-full"
									/>
								</div>
							</div>

							{/* Bottom section - Full width sections */}
							<div className="w-full space-y-6">
								{/* Pinned Repositories */}
								{pinnedRepos.length > 0 && (
									<Card className="w-full">
										<CardHeader>
											<CardTitle className="flex items-center font-medium text-lg">
												<Pin className="mr-2 h-4 w-4 text-primary" />
												Pinned Repositories
											</CardTitle>
										</CardHeader>
										<CardContent>
											<RepoCardSection
												repositories={pinnedRepos}
												isOrgRepo={isOrgRepo}
												isDuplicateRepo={isDuplicateRepo}
											/>
										</CardContent>
									</Card>
								)}

								{/* Recent Repositories */}

								{/* Contributed Recent Repositories */}
								{visibleRepos.length > 0 && (
									<Card className="w-full">
										<CardHeader>
											<CardTitle className="flex items-center font-medium text-lg">
												<BookCopy className="mr-2 h-4 w-4 text-primary" />
												Contributed Recent Repositories
											</CardTitle>
										</CardHeader>
										<CardContent>
											<RepoCardSection
												repositories={visibleRepos}
												isOrgRepo={isOrgRepo}
												isDuplicateRepo={isDuplicateRepo}
											/>
										</CardContent>
									</Card>
								)}

								{/* Suggested Profiles and Rank in two columns */}
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									{/* Suggested Profiles */}
									{similarUsers.length > 0 && (
										<Card className="w-full">
											<CardHeader>
												<CardTitle className="flex items-center font-medium text-lg">
													<Users className="mr-2 h-4 w-4 text-primary" />
													Suggested Profiles
												</CardTitle>
											</CardHeader>
											<CardContent>
												<div className="grid grid-cols-1 gap-4">
													{similarUsers.map((similarUser) => (
														<Link
															href={`/developer/${similarUser.username}`}
															key={similarUser.id}
															className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/10 p-2 transition-colors hover:bg-muted/20"
														>
															<div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-border/50">
																<Image
																	src={similarUser.avatarUrl}
																	alt={`${similarUser.fullname}'s profile picture`}
																	width={40}
																	height={40}
																	className="h-full w-full object-cover"
																/>
															</div>
															<div className="min-w-0 flex-1">
																<div className="flex items-center justify-between">
																	<div className="flex items-center gap-1.5">
																		<h3 className="truncate font-medium text-sm">
																			{similarUser.fullname}
																		</h3>
																		{similarUser.country && (
																			<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
																				{getCountryCode(similarUser.country) ? (
																					<CountryFlag
																						countryCode={
																							getCountryCode(
																								similarUser.country,
																							) || ""
																						}
																						size="sm"
																					/>
																				) : (
																					<MapPin className="h-3 w-3" />
																				)}
																			</div>
																		)}
																	</div>
																	<div className="flex items-center gap-1 text-muted-foreground text-xs">
																		<Star className="h-3 w-3 text-[#E87701] dark:text-[#FFC799]" />
																		<span>{similarUser.stars}</span>
																	</div>
																</div>
																<div className="flex items-center justify-between">
																	<p className="truncate text-muted-foreground text-xs">
																		@{similarUser.username}
																	</p>
																</div>
															</div>
														</Link>
													))}
												</div>
											</CardContent>
										</Card>
									)}

									{/* Ranks */}
									{Object.keys(rank).length > 0 && (
										<Card className="w-full">
											<CardHeader>
												<CardTitle className="flex items-center font-medium text-lg">
													<Users className="mr-2 h-4 w-4 text-primary" />
													Rank
												</CardTitle>
											</CardHeader>
											<CardContent>
												<ScrollArea className="h-[180px] pr-4">
													<div className="flex flex-col gap-2">
														{Object.entries(rank)
															.sort(([, a], [, b]) => a - b)
															.map(([key, value]) => (
																<Link
																	key={key}
																	href={`/search/${key}`}
																	className="transition-colors hover:text-primary"
																>
																	<span className="text-muted-foreground text-sm">
																		#{value}{" "}
																	</span>
																	{key
																		.split("-")
																		.map((word) => {
																			if (
																				[
																					"in",
																					"at",
																					"on",
																					"en",
																					"with",
																				].includes(word)
																			) {
																				return word;
																			}
																			return (
																				word.charAt(0).toUpperCase() +
																				word.slice(1)
																			);
																		})
																		.join(" ")}
																</Link>
															))}
													</div>
												</ScrollArea>
											</CardContent>
										</Card>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>

			<Footer />
		</div>
	);
}

export async function generateMetadata({
	params,
}: DeveloperPageProps): Promise<Metadata> {
	const { username } = await params;

	const userData = await getUserByUsername(username);

	if (!userData) {
		return {
			title: "Developer Not Found | GitHunter",
		};
	}

	return {
		title: `${userData.fullname || userData.username} | Open Source Developer | GitHunter`,
		description: `View ${userData.fullname || userData.username}'s GitHub profile, repositories, tech stack and more on GitHunter.`,
		openGraph: {
			title: `${userData.fullname || userData.username} | GitHunter`,
			description: `Open source developer with ${userData.stars}+ stars and ${userData.contributions}+ contributions.`,
			images: [`/api/og/users/${username}`],
			url: `https://githunter.dev/api/og/users/${username}`,
			siteName: "GitHunter",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: `${userData.fullname || userData.username} | GitHunter`,
			description: `Open source developer with ${userData.stars}+ stars and ${userData.contributions}+ contributions.`,
			images: [`/developer/${username}/opengraph-image`],
		},
		keywords: ["dev", "user", "github", "githunter"],
	};
}
