import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Repo } from "@/db/schema/user";
import {
	ArrowUp,
	ChartNoAxesColumnIncreasing,
	GitFork,
	Star,
	User,
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
}

export function GitHubUserProfile({
	username,
	fullname,
	avatarUrl,
	stars,
	followers,
	repositories,
	contributions,
	country,
	city,
	stack,
	repos,
}: GitHubUserProfileProps) {
	// Find top repository by stars
	const topRepo =
		repos && repos.length > 0
			? repos.reduce((prev, current) =>
					prev.stars > current.stars ? prev : current,
				)
			: null;

	const userStack = stack || [];

	return (
		<Card className="border-border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="flex flex-col gap-4">
				<div className="flex gap-3">
					<div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full bg-muted">
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
								variant="ghost"
								size="icon"
								className="-mt-1 -mr-1 h-6 w-6"
							>
								<ArrowUp className="h-3 w-3" />
							</Button>
						</div>
					</div>
				</div>
				<div className="flex justify-between text-muted-foreground text-xs">
					<div className="flex items-center gap-1">
						<Star className="h-3 w-3" />
						<span>{stars}</span>
					</div>
					<div className="flex items-center gap-1">
						<User className="h-3 w-3" />
						<span>{followers}</span>
					</div>
					<div className="flex items-center gap-1">
						<GitFork className="h-3 w-3" />
						<span>{repositories}</span>
					</div>
					<div className="flex items-center gap-1">
						<ChartNoAxesColumnIncreasing className="h-3 w-3" />
						<span>{contributions}+</span>
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
						</div>
					</div>
				)}
				{userStack.length > 0 && (
					<div className="flex flex-wrap gap-1">
						{userStack.slice(0, 3).map((tech) => (
							<span
								key={tech}
								className="rounded-full bg-primary/10 px-1.5 py-0.5 text-primary text-xs"
							>
								{tech}
							</span>
						))}
					</div>
				)}
			</div>
		</Card>
	);
}
