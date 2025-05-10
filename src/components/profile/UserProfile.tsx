"use client";

import { CountryFlag } from "@/components/ui/CountryFlag";
import { Button } from "@/components/ui/button";
import type { UserSelect } from "@/db/schema/user";
import { getCountryCode } from "@/lib/country-codes";
import {
	ArrowUp,
	BarChart,
	Building2,
	Code,
	Code2,
	ExternalLink,
	GitFork,
	Github,
	Globe,
	Linkedin,
	MapPin,
	Share2,
	Star,
	Twitter,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import SimilarProfileCard from "./SimilarProfileCard";

interface UserProfileProps {
	user: UserSelect;
	similarUsers?: UserSelect[];
}

export default function UserProfile({ user, similarUsers }: UserProfileProps) {
	const [showAllTech, setShowAllTech] = useState(false);
	const [showScrollButton, setShowScrollButton] = useState(false);
	const [visibleReposCount, setVisibleReposCount] = useState(6);

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

	// Scroll to top
	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const shareProfile = async () => {
		try {
			const shareData = {
				title: `${user.fullname} | GitHunter Profile`,
				text: `Check out ${user.fullname}'s developer profile on GitHunter!`,
				url: window.location.href,
			};

			if (navigator.share) {
				await navigator.share(shareData);
				toast.success("Profile shared successfully!");
			} else if (navigator.clipboard) {
				await navigator.clipboard.writeText(shareData.url);
				toast.success("Profile link copied to clipboard!");
			} else {
				toast.error("Sharing is not supported in this browser.");
			}
		} catch (error) {
			console.error("Failed to share profile:", error);
			toast.error("Oops! Something went wrong while sharing.");
		}
	};

	// Format social links
	const socialLinks = [
		{
			name: "GitHub",
			url: `https://github.com/${user.username}`,
			icon: <Github className="h-4 w-4" />,
		},
		user.website && {
			name: "Website",
			url: user.website,
			icon: <Globe className="h-4 w-4" />,
		},
		user.twitter && {
			name: "Twitter",
			url: user.twitter,
			icon: <Twitter className="h-4 w-4" />,
		},
		user.linkedin && {
			name: "LinkedIn",
			url: user.linkedin,
			icon: <Linkedin className="h-4 w-4" />,
		},
	].filter(Boolean) as Array<{
		name: string;
		url: string;
		icon: React.ReactNode;
	}>;

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
		<div className="min-h-screen">
			<div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-12">
				{/* Left sidebar with profile info */}
				<div className="md:col-span-3">
					<div className="sticky top-20 space-y-6">
						{/* Profile card */}
						<div className="overflow-hidden rounded-lg border border-border/50 bg-background shadow-sm">
							<div className="relative border-border/50 border-b bg-muted p-4 text-center dark:border-border/20 dark:bg-muted/20">
								<div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-background shadow-sm">
									<Image
										src={user.avatarUrl}
										alt={`${user.fullname}'s profile picture`}
										width={96}
										height={96}
										className="h-full w-full object-cover"
										priority
									/>
								</div>
								<h1 className="mt-3 font-semibold text-[#2300A7] text-xl dark:text-[#75A9FF]">
									{user.fullname}
								</h1>
								<div className="flex items-center justify-center gap-1 text-[#008080] text-sm dark:text-[#98FEE3]">
									<Link
										href={`https://github.com/${user.username}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-0.5 hover:underline"
									>
										@{user.username}
										<ExternalLink className="h-3 w-3 text-muted-foreground" />
									</Link>
								</div>

								{/* Social links */}
								<div className="mt-3 flex flex-wrap justify-center space-x-2">
									{/* Share button */}
									<Button
										size="sm"
										variant="ghost"
										onClick={shareProfile}
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
												aria-label={`Visit ${user.username}'s ${link.name}`}
											>
												{link.icon}
											</a>
										</Button>
									))}
								</div>
							</div>

							<div className="p-4">
								{/* Stats grid */}
								<div className="mb-4 grid grid-cols-2 gap-2">
									<div className="rounded-md bg-muted/20 p-2 text-center">
										<div className="font-semibold text-lg text-primary">
											{user.stars}
										</div>
										<div className="text-muted-foreground text-xs">Stars</div>
									</div>
									<div className="rounded-md bg-muted/20 p-2 text-center">
										<div className="font-semibold text-lg text-primary">
											{user.repositories}
										</div>
										<div className="text-muted-foreground text-xs">Repos</div>
									</div>
									<div className="rounded-md bg-muted/20 p-2 text-center">
										<div className="font-semibold text-lg text-primary">
											{user.followers}
										</div>
										<div className="text-muted-foreground text-xs">
											Followers
										</div>
									</div>
									<div className="rounded-md bg-muted/20 p-2 text-center">
										<div className="font-semibold text-lg text-primary">
											{user.following}
										</div>
										<div className="text-muted-foreground text-xs">
											Following
										</div>
									</div>
								</div>

								{/* Location */}
								{(user.city || user.country) && (
									<div className="mb-3 flex items-center gap-2 text-sm">
										{getCountryCode(user.country) ? (
											<CountryFlag
												countryCode={getCountryCode(user.country) || "us"}
												size="sm"
											/>
										) : (
											<MapPin className="h-4 w-4 text-muted-foreground" />
										)}
										<span className="text-muted-foreground">
											{[user.city, user.country].filter(Boolean).join(", ")}
										</span>
									</div>
								)}

								{/* Contributions */}
								<div className="mb-3 flex items-center gap-2 text-sm">
									<BarChart className="h-4 w-4 text-muted-foreground" />
									<span className="text-muted-foreground">
										{user.contributions.toLocaleString()} contributions
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
								{user.potentialRoles && user.potentialRoles.length > 0 && (
									<div>
										<h3 className="mb-2 font-medium text-muted-foreground text-xs uppercase">
											Potential Roles
										</h3>
										<div className="flex flex-wrap gap-1">
											{user.potentialRoles.map((role) => (
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
							</div>
						</div>
					</div>
				</div>

				{/* Main content area */}
				<div className="space-y-8 md:col-span-9">
					{/* About section */}
					{user.about && (
						<div className="rounded-lg border border-border/50 bg-muted/20 p-6 shadow-sm">
							<h2 className="mb-4 font-medium text-lg">About</h2>
							<p className="text-foreground text-sm">{user.about}</p>
						</div>
					)}

					{/* Tech Stack */}
					{user.stack && user.stack.length > 0 && (
						<div className="rounded-lg border border-border/50 bg-muted/20 p-6 shadow-sm">
							<h2 className="mb-4 flex items-center font-medium text-lg">
								<Code className="mr-2 h-5 w-5 text-[#2300A7] dark:text-[#75A9FF]" />
								Tech Stack
							</h2>
							<div className="relative">
								<div
									className={`flex flex-wrap gap-2 ${!showAllTech && user.stack.length > 15 ? "max-h-28 overflow-hidden" : ""}`}
								>
									{user.stack.map((tech) => (
										<span
											key={tech}
											className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300"
										>
											{tech}
										</span>
									))}
								</div>

								{user.stack.length > 15 && (
									<div
										className={`${!showAllTech ? "absolute right-0 bottom-0 left-0 pt-10" : "mt-4"}`}
									>
										{!showAllTech && (
											<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background to-transparent" />
										)}
										<Button
											type="button"
											variant="ghost"
											onClick={() => setShowAllTech(!showAllTech)}
											className="relative w-full cursor-pointer text-xs hover:bg-transparent"
										>
											{showAllTech ? "Show Less" : "Show More"}
										</Button>
									</div>
								)}
							</div>
						</div>
					)}

					{/* Featured Repositories */}
					{userRepos.length > 0 && (
						<div className="rounded-lg border border-border/50 bg-muted/20 p-6 shadow-sm">
							<h2 className="mb-4 font-medium text-lg">
								Featured Repositories
							</h2>
							<div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
								{visibleRepos.map((repo) => {
									const repoName = repo.fullName.split("/")[1];
									const repoOwner = repo.fullName.split("/")[0];
									const isOrg = isOrgRepo(repo.fullName);

									return (
										<div
											key={repo.fullName}
											className="overflow-hidden rounded-lg border border-border/50 bg-muted/10 transition-all hover:border-primary/20 hover:shadow-sm"
										>
											<div className="flex items-center justify-between border-border/40 border-b bg-muted px-4 py-2 dark:bg-muted/20">
												<div className="flex items-center gap-1.5">
													<Code2 className="h-3.5 w-3.5" />
													<span className="font-medium text-sm">
														{isOrg ? repoOwner : "Personal"}
													</span>
												</div>
												<div className="flex items-center gap-1">
													<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
													<span className="font-medium text-xs">
														{repo.stars}
													</span>
												</div>
											</div>
											<div className="bg-background/50 p-4">
												<h3 className="mb-1 font-semibold text-[#2300A7] hover:underline dark:text-[#75A9FF]">
													<Link
														href={`https://github.com/${repo.fullName}`}
														target="_blank"
														rel="noopener noreferrer"
													>
														{repoName}
													</Link>
												</h3>
												<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
													{repo.description || "No description available."}
												</p>

												{/* Tech stack tags */}
												<div className="mb-3 flex flex-wrap gap-1">
													{repo.techStack.slice(0, 3).map((tech) => (
														<span
															key={tech}
															className="inline-flex rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300"
														>
															{tech}
														</span>
													))}
													{repo.techStack.length > 3 && (
														<span className="inline-flex rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-700 dark:bg-gray-800 dark:text-gray-300">
															+{repo.techStack.length - 3}
														</span>
													)}
												</div>

												{/* Stats */}
												<div className="flex items-center gap-3 text-muted-foreground text-xs">
													<div className="flex items-center gap-1">
														<Star className="h-3 w-3 text-[#E87701] dark:text-[#FFC799]" />
														<span>{repo.stars}</span>
													</div>
													<div className="flex items-center gap-1">
														<GitFork className="h-3 w-3" />
														<span>{Math.floor(repo.stars * 0.4)}</span>
													</div>
												</div>
											</div>
										</div>
									);
								})}
							</div>

							{hasMoreRepos && (
								<div className="mt-6 text-center">
									<Button
										variant="outline"
										size="sm"
										onClick={() => setVisibleReposCount((prev) => prev + 6)}
										className="px-4 py-1 text-xs"
									>
										Load More Repositories
									</Button>
								</div>
							)}
						</div>
					)}
					{!!similarUsers?.length && (
						<div className="rounded-lg border border-border/50 bg-muted/20 p-6 shadow-sm">
							<h2 className="mb-4 flex items-center font-medium text-lg">
								<Users className="mr-2 h-5 w-5 text-[#2300A7] dark:text-[#75A9FF]" />
								Suggested Profiles
							</h2>
							<div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
								{similarUsers?.map((similarUser) => (
									<SimilarProfileCard
										key={similarUser.id}
										similarUser={similarUser}
										currentUserStack={user.stack || []}
									/>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Scroll to top button */}
			{showScrollButton && (
				<Button
					onClick={scrollToTop}
					className="fixed right-4 bottom-4 h-10 w-10 rounded-full bg-primary p-0 text-primary-foreground shadow-md"
					aria-label="Scroll to top"
				>
					<ArrowUp className="h-5 w-5" />
				</Button>
			)}
		</div>
	);
}
