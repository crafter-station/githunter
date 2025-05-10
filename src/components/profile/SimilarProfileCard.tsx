"use client";

import type { UserSelect } from "@/db/schema/user";
import { BarChart, GitFork, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface SimilarProfileCardProps {
	similarUser: UserSelect;
	currentUserStack?: string[];
}

export function SimilarProfileCard({
	similarUser,
	currentUserStack = [],
}: SimilarProfileCardProps) {
	return (
		<Link
			href={`/developer/${similarUser.username}`}
			className="overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:border-primary/20 hover:shadow-md"
		>
			<div className="flex flex-col p-4">
				<div className="mb-3 flex items-center gap-3">
					<div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-muted">
						<Image
							src={similarUser.avatarUrl}
							alt={`${similarUser.fullname}'s profile picture`}
							width={40}
							height={40}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex-1 overflow-hidden">
						<h3 className="truncate font-medium text-[#2300A7] dark:text-[#75A9FF]">
							{similarUser.fullname}
						</h3>
						<p className="truncate text-muted-foreground text-xs">
							@{similarUser.username}
						</p>
					</div>
				</div>

				{/* Tech Stack Tags */}
				<div className="mb-3">
					<div className="flex flex-wrap gap-1.5">
						{similarUser.stack?.slice(0, 4).map((tech) => (
							<span
								key={tech}
								className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
									currentUserStack.includes(tech)
										? "bg-primary/10 text-primary"
										: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
								}`}
							>
								{tech}
							</span>
						))}
						{(similarUser.stack?.length || 0) > 4 && (
							<span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-gray-700 text-xs dark:bg-gray-800 dark:text-gray-300">
								+{(similarUser.stack?.length || 0) - 4}
							</span>
						)}
					</div>
				</div>

				{/* Top Repo (if available) */}
				{similarUser.pinnedRepos && similarUser.pinnedRepos.length > 0 && (
					<div className="mb-3">
						<p className="mb-1 text-muted-foreground text-xs">Top Repository</p>
						<div className="rounded-md bg-muted/50 p-2">
							<div className="flex items-center justify-between">
								<span className="truncate text-xs">
									{similarUser.pinnedRepos[0].fullName.split("/")[1]}
								</span>
								<div className="flex items-center gap-1">
									<Star className="h-3 w-3 text-amber-500" />
									<span className="text-xs">
										{similarUser.pinnedRepos[0].stars}
									</span>
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Stats */}
				<div className="mt-auto flex justify-between text-muted-foreground text-xs">
					<div className="flex items-center gap-1">
						<Star className="h-3 w-3 text-[#E87701] dark:text-[#FFC799]" />
						<span>{similarUser.stars || 0}</span>
					</div>
					<div className="flex items-center gap-1">
						<GitFork className="h-3 w-3" />
						<span>{similarUser.repositories || 0}</span>
					</div>
					<div className="flex items-center gap-1">
						<BarChart className="h-3 w-3" />
						<span>{similarUser.contributions || 0}</span>
					</div>
				</div>

				{/* Location (if available) */}
				{(similarUser.city || similarUser.country) && (
					<div className="mt-2 flex items-center text-muted-foreground text-xs">
						<div className="mr-1 h-2 w-2 rounded-full bg-green-500" />
						<span className="truncate">
							{[similarUser.city, similarUser.country]
								.filter(Boolean)
								.join(", ")}
						</span>
					</div>
				)}
			</div>
		</Link>
	);
}

export default SimilarProfileCard;
