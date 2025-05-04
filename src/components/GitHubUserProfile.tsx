"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Repo } from "@/db/schema/user";
import {
	Calendar,
	ExternalLink,
	GitFork,
	Star,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";

export interface GitHubUserProfileProps {
	id: string;
	username: string;
	fullname: string;
	avatarUrl: string;
	stars: number;
	followers: number;
	following: number;
	repositories: number;
	contributions: number;
	country?: string | null;
	city?: string | null;
	stack: string[] | null;
	repos: Repo[] | null;
	compact?: boolean;
}

export function GitHubUserProfile({
	username,
	fullname,
	avatarUrl,
	stars,
	followers,
	following,
	repositories,
	contributions,
	country,
	city,
	stack,
	repos,
	compact = false,
}: GitHubUserProfileProps) {
	// Find top repository by stars
	const topRepo =
		repos && repos.length > 0
			? repos.reduce((prev, current) =>
					prev.stars > current.stars ? prev : current,
				)
			: null;

	const userStack = stack || [];
	const githubProfileUrl = `https://github.com/${username}`;

	if (compact) {
		return (
			<Card className="border-border bg-card p-3 transition-shadow hover:shadow-sm">
				<div className="flex items-center gap-3">
					<div className="h-10 w-10 overflow-hidden rounded-sm border border-border bg-muted">
						<Image
							src={avatarUrl}
							alt={username}
							width={40}
							height={40}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-between">
							<h3 className="truncate font-medium text-xs">{username}</h3>
							<Button
								variant="ghost"
								size="icon"
								className="size-6 cursor-pointer"
								onClick={() => window.open(githubProfileUrl, "_blank")}
								title="View GitHub Profile"
							>
								<ExternalLink className="size-3" />
							</Button>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3" />
								<span>{stars}</span>
							</div>
							<div className="flex items-center gap-1">
								<User className="h-3 w-3" />
								<span>{followers}</span>
							</div>
						</div>
						{userStack.length > 0 && (
							<span className="mt-1 inline-block rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs">
								{userStack[0]}
							</span>
						)}
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="flex flex-col gap-4">
				<div className="flex gap-3">
					<div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-sm border border-border bg-muted">
						<Image
							src={avatarUrl}
							alt={username}
							width={56}
							height={56}
							className="h-full w-full object-cover"
						/>
					</div>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-start justify-between">
							<div>
								<h3 className="truncate font-medium">{username}</h3>
								<p className="truncate text-muted-foreground text-xs">
									{fullname}
								</p>
								{(city || country) && (
									<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
										<span className="h-2 w-2 rounded-full bg-green-500" />{" "}
										{city && country ? `${city}, ${country}` : city || country}
									</p>
								)}
							</div>
							<Button
								variant="outline"
								size="sm"
								className="h-7 gap-1 text-xs"
								onClick={() => window.open(githubProfileUrl, "_blank")}
							>
								<ExternalLink className="h-3 w-3" />
								View Profile
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2">
					<div className="col-span-2 flex justify-between text-muted-foreground text-xs">
						<div className="flex items-center gap-1">
							<Star className="h-3 w-3" />
							<span>{stars} stars</span>
						</div>
						<div className="flex items-center gap-1">
							<GitFork className="h-3 w-3" />
							<span>{repositories} repos</span>
						</div>
					</div>

					<div className="flex items-center gap-1 text-muted-foreground text-xs">
						<User className="h-3 w-3" />
						<span>{followers} followers</span>
					</div>
					<div className="flex items-center gap-1 text-muted-foreground text-xs">
						<Users className="h-3 w-3" />
						<span>{following} following</span>
					</div>

					<div className="col-span-2 flex items-center gap-1 text-muted-foreground text-xs">
						<Calendar className="h-3 w-3" />
						<span>Active user with {contributions}+ contributions</span>
					</div>
				</div>

				{topRepo && (
					<div className="flex flex-col gap-2">
						<h4 className="font-medium text-xs">Top Repository</h4>
						<div className="rounded-md bg-muted/50 p-2">
							<div className="flex items-center justify-between">
								<span className="text-xs">
									{topRepo.fullName.split("/")[1]}
								</span>
								<div className="flex items-center gap-1">
									<Star className="h-3 w-3" />
									<span className="text-xs">{topRepo.stars}</span>
								</div>
							</div>
							<p className="mt-1 line-clamp-2 text-muted-foreground text-xs">
								{topRepo.description || "No description available"}
							</p>
						</div>
						<Button
							variant="ghost"
							size="sm"
							className="mt-1 h-7 w-full text-xs"
							onClick={() =>
								window.open(`https://github.com/${topRepo.fullName}`, "_blank")
							}
						>
							<ExternalLink className="mr-1 h-3 w-3" />
							View Repository
						</Button>
					</div>
				)}

				{userStack.length > 0 && (
					<div>
						<h4 className="mb-1 font-medium text-xs">Tech Stack</h4>
						<div className="flex flex-wrap gap-1">
							{userStack.map((tech) => (
								<span
									key={tech}
									className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs"
								>
									{tech}
								</span>
							))}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
