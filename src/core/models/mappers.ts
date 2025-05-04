import type { UserProfile } from "@/services/github-scrapper";
import { nanoid } from "nanoid";
import type { RepoOfUser, User } from "./user";

export function mapUser(
	username: string,
	userInfo: UserProfile,
	repos: RepoOfUser[],
	metadata: {
		roles: string[];
		about: string;
	},
	techStack: Set<string>,
): User {
	return {
		id: nanoid(),

		username: username,
		fullname: userInfo.name ?? "",
		avatarUrl: userInfo.avatarUrl,

		stars: repos.reduce((acc, repo) => acc + repo.stars, 0),
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

		stack: Array.from(techStack),
		potentialRoles: metadata.roles,

		repos,
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
