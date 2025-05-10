import type {
	PinnedRepo,
	RepoContribution,
	RepoSummary,
	UserProfile,
} from "@/services/github-scrapper";
import { nanoid } from "nanoid";
import type { RepoOfUser, User } from "./user";

export function mapUser(
	username: string,
	userInfo: UserProfile,
	repos: RepoOfUser[],
	metadata: {
		roles: string[];
		about: string;
		stack: string[];
	},
	pinnedOrTopRepos: PinnedRepo[],
): User {
	return {
		id: nanoid(),

		username: username,
		fullname: userInfo.name ?? "",
		avatarUrl: userInfo.avatarUrl,

		stars: userInfo.starsCount,
		followers: userInfo.followers,
		following: userInfo.following,
		repositories: userInfo.publicRepos,
		contributions: userInfo.contributionCount,

		country: userInfo.country ?? null,
		city: userInfo.city ?? null,

		website: userInfo.websiteUrl ?? null,
		twitter: userInfo.twitterUsername ?? null,
		linkedin: userInfo.linkedinUrl ?? null,

		about: metadata.about,

		stack: metadata.stack,
		potentialRoles: metadata.roles,

		repos,
		pinnedRepos: Array.from(pinnedOrTopRepos),
	};
}

export function mapTechStackFromRepos(repos: RepoOfUser[]): Set<string> {
	const techStackSet = new Set<string>();

	for (const repo of repos) {
		for (const tech of repo.techStack) {
			techStackSet.add(tech);
		}
	}

	return techStackSet;
}

export function mapReposOfUser(
	repoSummaries: RepoSummary[],
	reposDetails: Map<
		string,
		{ fullName: string; techStack: string[]; description: string }
	>,
	reposContributions: Map<string, RepoContribution>,
): RepoOfUser[] {
	const userRepos: RepoOfUser[] = [];

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
