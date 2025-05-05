"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserSelect } from "@/db/schema/user";
import {
	ArrowUp,
	Briefcase,
	Building2,
	Calendar,
	Code,
	ExternalLink,
	Github,
	Globe,
	Linkedin,
	MapPin,
	Star,
	Twitter,
	UserRound,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

interface UserProfileProps {
	user: UserSelect;
}

export default function UserProfile({ user }: UserProfileProps) {
	const [showAllTech, setShowAllTech] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [visibleReposCount, setVisibleReposCount] = useState(10);

	const githubProfileUrl = `https://github.com/${user.username}`;
	const twitterUrl = user.twitter;
	const linkedinUrl = user.linkedin;
	const websiteUrl = user.website;

	// Tech stack visibility logic
	const techStackItems = user.stack || [];
	const shouldShowMoreButton = techStackItems.length > 0;
	const visibleTechStack = showAllTech ? techStackItems : techStackItems;

	// Repositories pagination
	const userRepos = user.repos || [];
	const visibleRepos = userRepos.slice(0, visibleReposCount);
	const hasMoreRepos = userRepos.length > visibleReposCount;

	// Organizations the user belongs to
	const orgSet = new Set<string>();
	for (const repo of userRepos) {
		const repoOwner = repo.fullName.split("/")[0];
		if (repoOwner !== user.username) {
			orgSet.add(repoOwner);
		}
	}
	const organizations = Array.from(orgSet);

	// Determine if repo is from an organization
	const isOrgRepo = (fullName: string) => {
		const owner = fullName.split("/")[0];
		return owner !== user.username;
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 500) {
				setShowScrollButton(true);
			} else {
				setShowScrollButton(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	return (
		<div className="container mx-auto max-w-5xl">
			<div className="grid gap-8 md:grid-cols-3">
				{/* Left column - Profile information (sticky) */}
				<div className="relative md:col-span-1">
					<div className="sticky top-16">
						<Card className="overflow-hidden border border-border/50 bg-gradient-to-br from-background to-muted/30 pt-0 shadow-md">
							<div className="bg-gradient-to-r from-primary/30 via-primary/20 to-primary/5 p-6 text-center">
								<div className="mx-auto mb-4 h-32 w-32 overflow-hidden rounded-full border-4 border-background shadow-lg">
									<Image
										src={user.avatarUrl}
										alt={user.username}
										width={128}
										height={128}
										className="h-full w-full object-cover"
									/>
								</div>
								<h1 className="mb-1 font-bold text-2xl tracking-tight">
									{user.fullname}
								</h1>
								<p className="text-muted-foreground">@{user.username}</p>

								<div className="mt-6 flex justify-center space-x-2">
									<Button
										asChild
										size="sm"
										variant="default"
										className="shadow-sm transition-all duration-300 hover:shadow"
									>
										<a
											href={githubProfileUrl}
											target="_blank"
											rel="noopener noreferrer"
										>
											<Github className="mr-1 h-4 w-4" />
											GitHub
										</a>
									</Button>

									{twitterUrl && (
										<Button
											asChild
											size="sm"
											variant="outline"
											className="transition-all duration-300 hover:bg-sky-500/10"
										>
											<a
												href={twitterUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Twitter className="h-4 w-4" />
											</a>
										</Button>
									)}

									{linkedinUrl && (
										<Button
											asChild
											size="sm"
											variant="outline"
											className="transition-all duration-300 hover:bg-blue-600/10"
										>
											<a
												href={linkedinUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Linkedin className="h-4 w-4" />
											</a>
										</Button>
									)}

									{websiteUrl && (
										<Button
											asChild
											size="sm"
											variant="outline"
											className="transition-all duration-300 hover:bg-green-500/10"
										>
											<a
												href={websiteUrl}
												target="_blank"
												rel="noopener noreferrer"
											>
												<Globe className="h-4 w-4" />
											</a>
										</Button>
									)}
								</div>
							</div>

							<div className="p-6">
								{/* GitHub Statistics */}
								<div className="mb-6 grid grid-cols-2 gap-4 text-center">
									<div className="rounded-lg bg-background/60 p-3 transition-colors hover:bg-background">
										<p className="font-bold text-2xl text-primary">
											{user.stars}
										</p>
										<p className="text-muted-foreground text-sm">Stars</p>
									</div>
									<div className="rounded-lg bg-background/60 p-3 transition-colors hover:bg-background">
										<p className="font-bold text-2xl text-primary">
											{user.repositories}
										</p>
										<p className="text-muted-foreground text-sm">Repos</p>
									</div>
									<div className="rounded-lg bg-background/60 p-3 transition-colors hover:bg-background">
										<p className="font-bold text-2xl text-primary">
											{user.followers}
										</p>
										<p className="text-muted-foreground text-sm">Followers</p>
									</div>
									<div className="rounded-lg bg-background/60 p-3 transition-colors hover:bg-background">
										<p className="font-bold text-2xl text-primary">
											{user.following}
										</p>
										<p className="text-muted-foreground text-sm">Following</p>
									</div>
								</div>

								{/* Location */}
								{(user.city || user.country) && (
									<div className="mb-4 flex items-center rounded-md bg-background/40 p-2.5">
										<MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
										<span className="text-sm">
											{[user.city, user.country].filter(Boolean).join(", ")}
										</span>
									</div>
								)}

								{/* Contributions */}
								<div className="mb-4 flex items-center rounded-md bg-background/40 p-2.5">
									<Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
									<span className="text-sm">
										{user.contributions}+ contributions
									</span>
								</div>

								{/* Organizations */}
								{organizations.length > 0 && (
									<div className="mb-4">
										<h3 className="mb-2 flex items-center font-semibold">
											<Building2 className="mr-2 h-4 w-4 text-yellow-500" />{" "}
											Organizations
										</h3>
										<div className="space-y-2">
											{organizations.map((org) => (
												<a
													key={org}
													href={`https://github.com/${org}`}
													target="_blank"
													rel="noopener noreferrer"
													className="flex items-center rounded-md bg-background/40 p-2 transition-colors hover:bg-background"
												>
													<Building2 className="mr-2 h-4 w-4 text-yellow-500" />
													<span className="font-medium text-sm">{org}</span>
												</a>
											))}
										</div>
									</div>
								)}

								{/* Potential Roles */}
								{user.potentialRoles && user.potentialRoles.length > 0 && (
									<div className="mb-4">
										<h3 className="mb-2 flex items-center font-semibold">
											<Briefcase className="mr-2 h-4 w-4" /> Potential Roles
										</h3>
										<div className="flex flex-wrap gap-2">
											{user.potentialRoles.map((role) => (
												<Badge
													key={role}
													variant="outline"
													className="bg-background/60"
												>
													{role}
												</Badge>
											))}
										</div>
									</div>
								)}
							</div>
						</Card>
					</div>
				</div>

				{/* Right column - Main content */}
				<div className="space-y-6 md:col-span-2">
					{/* About */}
					{user.about && (
						<Card className="border border-border/50 p-6 shadow-sm">
							<h2 className="mb-4 font-semibold text-xl">About</h2>
							<p className="text-muted-foreground">{user.about}</p>
						</Card>
					)}

					{/* Tech Stack */}
					{user.stack && user.stack.length > 0 && (
						<Card className="border border-border/50 p-6 shadow-sm">
							<h2 className="mb-4 flex items-center font-semibold text-xl">
								<Code className="mr-2 h-5 w-5" /> Tech Stack
							</h2>
							<div className="relative">
								<div
									className={`flex flex-wrap gap-2 ${!showAllTech ? "h-28 overflow-hidden" : ""}`}
								>
									{visibleTechStack.map((tech) => (
										<TooltipProvider key={tech}>
											<Tooltip>
												<TooltipTrigger>
													<Badge variant="secondary">{tech}</Badge>
												</TooltipTrigger>
												<TooltipContent>
													<p>{tech}</p>
												</TooltipContent>
											</Tooltip>
										</TooltipProvider>
									))}
								</div>

								{shouldShowMoreButton && (
									<div
										className={`${!showAllTech ? "absolute right-0 bottom-0 left-0 pt-10" : "mt-4"}`}
									>
										{!showAllTech && (
											<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-card/95 to-transparent" />
										)}
										<Button
											type="button"
											onClick={() => setShowAllTech(!showAllTech)}
											className="relative w-full cursor-pointer bg-transparent py-2 font-medium text-primary text-sm hover:bg-transparent hover:text-primary/80"
										>
											{showAllTech ? "Show Less" : "Show More"}
										</Button>
									</div>
								)}
							</div>
						</Card>
					)}

					{/* Featured Repositories */}
					{userRepos.length > 0 && (
						<Card className="border border-border/50 p-6 shadow-sm">
							<h2 className="mb-4 font-semibold text-xl">
								Featured Repositories
							</h2>
							<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
								{visibleRepos.map((repo) => {
									const repoOwner = repo.fullName.split("/")[0];
									const repoName = repo.fullName.split("/")[1];
									const isOrg = isOrgRepo(repo.fullName);

									return (
										<Card
											key={repo.fullName}
											className="overflow-hidden border border-border/50 bg-gradient-to-br from-transparent to-background transition-all duration-300 hover:shadow-md"
										>
											<div
												className={`${isOrg ? "bg-yellow-500/10" : "bg-blue-500/10"} flex items-center justify-between border-border/40 border-b px-4 py-2`}
											>
												<div className="flex items-center gap-2">
													{isOrg ? (
														<Building2 className="h-4 w-4 text-yellow-500" />
													) : (
														<UserRound className="h-4 w-4 text-blue-500" />
													)}
													<span className="font-medium text-sm">
														{repoOwner}
													</span>
												</div>
												<div className="flex items-center">
													<Star className="mr-1 h-4 w-4 text-yellow-500" />
													<span className="font-semibold text-sm">
														{repo.stars}
													</span>
												</div>
											</div>
											<div className="p-4">
												<h3 className="mb-1 font-bold">{repoName}</h3>
												<p className="mb-4 line-clamp-4 text-muted-foreground text-sm">
													{repo.description || "No description available."}
												</p>
												<div className="mb-3 flex flex-wrap gap-1">
													{repo.techStack.slice(0, 3).map((tech) => (
														<Badge
															key={tech}
															variant="outline"
															className="text-xs"
														>
															{tech}
														</Badge>
													))}
													{repo.techStack.length > 3 && (
														<TooltipProvider>
															<Tooltip>
																<TooltipTrigger>
																	<Badge variant="outline" className="text-xs">
																		+{repo.techStack.length - 3}
																	</Badge>
																</TooltipTrigger>
																<TooltipContent>
																	<p className="whitespace-pre-line text-xs">
																		{repo.techStack.slice(3).join("\n")}
																	</p>
																</TooltipContent>
															</Tooltip>
														</TooltipProvider>
													)}
												</div>
												<Button
													variant="secondary"
													size="sm"
													className="w-full text-xs"
													asChild
												>
													<a
														href={`https://github.com/${repo.fullName}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														<ExternalLink className="mr-1 h-3 w-3" /> View
														Repository
													</a>
												</Button>
											</div>
										</Card>
									);
								})}
							</div>

							{hasMoreRepos && (
								<div className="mt-6 text-center">
									<Button
										variant="outline"
										onClick={() => setVisibleReposCount((prev) => prev + 10)}
										className="px-8"
									>
										Load More Repositories
									</Button>
								</div>
							)}
						</Card>
					)}
				</div>
			</div>

			{/* Scroll to top button */}
			{showScrollButton && (
				<Button
					onClick={scrollToTop}
					className="fixed right-6 bottom-6 z-50 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:bg-primary/90"
					aria-label="Scroll to top"
				>
					<ArrowUp className="h-5 w-5" />
				</Button>
			)}
		</div>
	);
}
