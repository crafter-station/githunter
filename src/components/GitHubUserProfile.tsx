"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Repo } from "@/db/schema/user";
import { cn } from "@/lib/utils";
import {
	Calendar,
	Code2,
	ExternalLink,
	GitFork,
	MapPin,
	Star,
	User,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
	const profileUrl = `/developer/${username}`;

	if (compact) {
		return (
			<Card className="group border-border bg-card p-3 transition-all hover:border-primary/20 hover:shadow-sm">
				<div className="flex items-center gap-3">
					<Link
						href={profileUrl}
						className="h-10 w-10 overflow-hidden rounded-full border border-border bg-muted"
					>
						<Image
							src={avatarUrl}
							alt={username}
							width={40}
							height={40}
							className="h-full w-full object-cover transition-transform group-hover:scale-105"
						/>
					</Link>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-center justify-between">
							<Link
								href={profileUrl}
								className="truncate font-medium text-sm transition-colors hover:text-primary"
							>
								{username}
							</Link>
							<Button
								variant="ghost"
								size="icon"
								className="size-6 cursor-pointer text-muted-foreground hover:text-primary"
								onClick={() => window.open(githubProfileUrl, "_blank")}
								title="View GitHub Profile"
							>
								<ExternalLink className="size-3" />
							</Button>
						</div>
						<div className="flex items-center gap-2 text-muted-foreground text-xs">
							<div className="flex items-center gap-1">
								<Star className="h-3 w-3 text-[#E87701] dark:text-[#FFC799]" />
								<span>{stars}</span>
							</div>
							<div className="flex items-center gap-1">
								<Users className="h-3 w-3 text-[#2300A7] dark:text-[#75A9FF]" />
								<span>{followers}</span>
							</div>
						</div>
						{city && country && (
							<div className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
								<MapPin className="h-3 w-3" />
								<span className="truncate">{`${city}, ${country}`}</span>
							</div>
						)}
						{userStack.length > 0 && (
							<div className="mt-2 flex flex-wrap gap-1">
								{userStack.slice(0, 2).map((tech) => (
									<Badge
										key={tech}
										variant="outline"
										className="h-4 bg-primary/5 px-1.5 py-0 font-normal text-[10px]"
									>
										{tech}
									</Badge>
								))}
								{userStack.length > 2 && (
									<Badge
										variant="outline"
										className="h-4 bg-muted px-1.5 py-0 font-normal text-[10px]"
									>
										+{userStack.length - 2}
									</Badge>
								)}
							</div>
						)}
					</div>
				</div>
			</Card>
		);
	}

	return (
		<Card className="group overflow-hidden border-border bg-card transition-all hover:border-primary/20 hover:shadow-md">
			<div className="flex flex-col gap-4 p-5">
				<div className="flex gap-3">
					<Link
						href={profileUrl}
						className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-border bg-muted"
					>
						<Image
							src={avatarUrl}
							alt={username}
							width={56}
							height={56}
							className="h-full w-full object-cover transition-transform group-hover:scale-105"
						/>
					</Link>
					<div className="flex-1 overflow-hidden">
						<div className="flex items-start justify-between">
							<div>
								<Link
									href={profileUrl}
									className="truncate font-medium text-base transition-colors hover:text-primary"
								>
									{username}
								</Link>
								<p className="truncate text-muted-foreground text-xs">
									{fullname}
								</p>
								{(city || country) && (
									<p className="mt-1 flex items-center gap-1 text-muted-foreground text-xs">
										<MapPin className="h-3 w-3" />
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
								GitHub
							</Button>
						</div>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-2 rounded-md bg-muted/30 p-2.5">
					<div className="col-span-2 flex justify-between text-muted-foreground text-xs">
						<div className="flex items-center gap-1.5">
							<div className="flex size-5 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-950/40">
								<Star className="h-3 w-3 text-amber-500" />
							</div>
							<span>{stars} stars</span>
						</div>
						<div className="flex items-center gap-1.5">
							<div className="flex size-5 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-950/40">
								<GitFork className="h-3 w-3 text-indigo-500" />
							</div>
							<span>{repositories} repos</span>
						</div>
					</div>

					<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<div className="flex size-5 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/40">
							<Users className="h-3 w-3 text-blue-500" />
						</div>
						<span>{followers} followers</span>
					</div>
					<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
						<div className="flex size-5 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-950/40">
							<User className="h-3 w-3 text-purple-500" />
						</div>
						<span>{following} following</span>
					</div>

					<div className="col-span-2 flex items-center gap-1.5 text-muted-foreground text-xs">
						<div className="flex size-5 items-center justify-center rounded-full bg-green-100 dark:bg-green-950/40">
							<Calendar className="h-3 w-3 text-green-500" />
						</div>
						<span>Active user with {contributions}+ contributions</span>
					</div>
				</div>

				{topRepo && (
					<div className="flex flex-col gap-2">
						<h4 className="font-medium text-muted-foreground text-xs uppercase">
							Top Repository
						</h4>
						<div className="rounded-md border border-border bg-card/50 p-3 transition-colors hover:bg-muted/20">
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-1.5">
									<Code2 className="h-3.5 w-3.5 text-primary" />
									<span className="font-medium text-sm">
										{topRepo.fullName.split("/")[1]}
									</span>
								</div>
								<div className="flex items-center gap-1">
									<Star className="h-3 w-3 text-amber-500" />
									<span className="text-xs">{topRepo.stars}</span>
								</div>
							</div>
							<p className="mt-1.5 line-clamp-2 text-muted-foreground text-xs">
								{topRepo.description || "No description available"}
							</p>

							{topRepo.techStack && topRepo.techStack.length > 0 && (
								<div className="mt-2 flex flex-wrap gap-1">
									{topRepo.techStack.slice(0, 3).map((tech) => (
										<Badge
											key={tech}
											variant="outline"
											className="h-4 bg-primary/5 px-1.5 py-0 font-normal text-[10px]"
										>
											{tech}
										</Badge>
									))}
								</div>
							)}

							<div className="mt-3 text-right">
								<Button
									variant="ghost"
									size="sm"
									className="h-7 gap-1 text-xs"
									onClick={() =>
										window.open(
											`https://github.com/${topRepo.fullName}`,
											"_blank",
										)
									}
								>
									<ExternalLink className="h-3 w-3" />
									View Repository
								</Button>
							</div>
						</div>
					</div>
				)}

				{userStack.length > 0 && (
					<div>
						<h4 className="mb-2 font-medium text-muted-foreground text-xs uppercase">
							Tech Stack
						</h4>
						<div className="flex flex-wrap gap-1.5">
							{userStack.map((tech) => (
								<Badge
									key={tech}
									variant="outline"
									className={cn(
										"h-5 px-2 py-0.5 font-normal",
										"bg-primary/5 transition-colors hover:bg-primary/10",
									)}
								>
									{tech}
								</Badge>
							))}
						</div>
					</div>
				)}
			</div>
		</Card>
	);
}
