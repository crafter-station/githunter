import type { UserSelect } from "@/db/schema";
import { Code2, GitFork, Star } from "lucide-react";
import Link from "next/link";

interface RepoCardSectionProps {
	repositories: UserSelect["repos"] | UserSelect["pinnedRepos"];
	isOrgRepo: (repoName: string) => boolean;
	isDuplicateRepo: (repoName: string) => boolean;
}

export const RepoCardSection = ({
	repositories,
	isOrgRepo,
	isDuplicateRepo,
}: RepoCardSectionProps) => {
	return (
		<section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			{repositories.map((repo) => {
				const repoName = repo.fullName.split("/")[1];
				const repoOwner = repo.fullName.split("/")[0];
				const isOrg = isOrgRepo(repo.fullName);

				// Check if the repo is a featured repo (has techStack property) or is pinned repo
				const isFeaturedRepo = "techStack" in repo;

				const isRecentlyContributed = isDuplicateRepo(repo.fullName);

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
							{isRecentlyContributed && (
								<span className="inline-flex items-center rounded-full bg-[#E87701]/10 px-2 py-0.5 font-medium text-[#E87701] text-xs dark:bg-[#FFC799]/10 dark:text-[#FFC799]">
									Recently Contributed
								</span>
							)}
							<div className="flex items-center gap-1">
								<Star className="h-3.5 w-3.5 text-[#E87701] dark:text-[#FFC799]" />
								<span className="font-medium text-xs">{repo.stars}</span>
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
	);
};
