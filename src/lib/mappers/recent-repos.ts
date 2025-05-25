import type { RecentRepo } from "@/db/schema";
import type { RepoContribution, RepoSummary } from "@/services/github-scrapper";

export function mapRecentRepos(
	repoSummaries: RepoSummary[],
	reposDetails: Map<
		string,
		{ fullName: string; techStack: string[]; description: string }
	>,
	reposContributions: Map<string, RepoContribution>,
): RecentRepo[] {
	const userRepos: RecentRepo[] = [];

	for (const repo of repoSummaries) {
		if (
			reposDetails.has(repo.fullName) &&
			reposContributions.has(repo.fullName)
		) {
			const detail = reposDetails.get(repo.fullName);
			const contribution = reposContributions.get(repo.fullName);

			if (!(!!detail && !!contribution)) {
				continue;
			}

			userRepos.push({
				fullName: repo.fullName,
				description: detail.description,
				stars: repo.stars,
				techStack: detail.techStack,
				contribution: {
					issuesCount: contribution.issuesCount,
					pullRequestsCount: contribution.pullRequestsCount,
					commitsCount: contribution.commitsCount,
				},
			});
		}
	}

	return userRepos;
}
