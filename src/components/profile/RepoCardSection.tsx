"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserSelect } from "@/db/schema";
import { BookCopy, Code2, GitFork, Star } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
interface RepoCardSectionProps {
	repositories: UserSelect["repos"] | UserSelect["pinnedRepos"];
	duplicateRepos: UserSelect["repos"];
}

const isRecentlyContributedRepo = (
	repository: UserSelect["repos"],
	fullName: string,
) => repository.some((repo) => repo.fullName === fullName);

export const RepoCardSection = ({
	repositories,
	duplicateRepos,
}: RepoCardSectionProps) => {
	const [visibleReposCount, setVisibleReposCount] = useState(6);

	const visibleRepos = repositories.slice(0, visibleReposCount) as
		| UserSelect["repos"]
		| UserSelect["pinnedRepos"];
	const hasMoreRepos = repositories.length > visibleReposCount;

	return (
		repositories.length > 0 && (
			<Card className="w-full">
				<CardHeader>
					<CardTitle className="flex items-center font-medium text-lg">
						<BookCopy className="mr-2 h-4 w-4 text-primary" />
						Featured Repositories
					</CardTitle>
				</CardHeader>
				<CardContent>
					<section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
						{visibleRepos.map((repo) => {
							const repoName = repo.fullName.split("/")[1];
							const repoOwner = repo.fullName.split("/")[0];

							// Check if the repo is a featured repo (has techStack property) or is pinned repo
							const isFeaturedRepo = "techStack" in repo;
							const isPinnedRepo = !isFeaturedRepo;

							// Check if the repo is a recently contributed repo
							const isRecentlyContributed =
								isRecentlyContributedRepo(duplicateRepos, repo.fullName) ||
								isFeaturedRepo;

							return (
								<div
									key={repo.fullName}
									className="overflow-hidden rounded-lg border border-border/50 bg-muted/10 transition-all hover:border-primary/20 hover:shadow-sm"
								>
									<div className="flex items-center justify-between border-border/40 border-b bg-muted px-4 py-2 dark:bg-muted/20">
										<div className="flex items-center gap-1.5">
											<Code2 className="h-3.5 w-3.5" />
											<h3 className="mb-1 font-semibold text-[#2300A7] hover:underline dark:text-[#75A9FF]">
												<Link
													href={`https://github.com/${repo.fullName}`}
													target="_blank"
													rel="noopener noreferrer"
												>
													{repoOwner}/{repoName}
												</Link>
											</h3>
										</div>
										<div className="flex items-center gap-1.5">
											{isRecentlyContributed && (
												<span className="inline-flex items-center rounded-full bg-[#E87701]/10 px-2 py-0.5 font-medium text-[#E87701] text-xs dark:bg-[#FFC799]/10 dark:text-[#FFC799]">
													Recently Contributed
												</span>
											)}
											{isPinnedRepo && (
												<span className="inline-flex items-center rounded-full bg-[#00BFFF]/10 px-2 py-0.5 font-medium text-[#00BFFF] text-xs dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]">
													Pinned
												</span>
											)}
										</div>
									</div>
									<div className="bg-background/50 p-4">
										<p className="mb-3 line-clamp-2 text-muted-foreground text-xs">
											{repo.description || "No description available."}
										</p>

										{/* Tech stack tags */}
										{isFeaturedRepo && (
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
										)}

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
					</section>
				</CardContent>
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
			</Card>
		)
	);
};
