import { nanoid } from "@/lib/nanoid";
import { eq } from "drizzle-orm";

import {
	type RecentRepo,
	type UserInsert,
	type UserSelect,
	db,
	user as userTable,
} from "@/db";

import { GithubService } from "@/services/github-scrapper";
import type { RepoContribution, RepoSummary } from "@/services/github-scrapper";
import { RepoAnalyzer } from "@/services/repo-analyzer";
import { UserMetadataExtractor } from "@/services/user-metadata-extractor";

import { mapRecentRepos, mapTechStack } from "@/lib/mappers";

export class PopulateGithubUser {
	private githubService: GithubService;
	private repoAnalyzer: RepoAnalyzer;
	private userMetadataExtractor: UserMetadataExtractor;

	constructor() {
		this.githubService = new GithubService();
		this.repoAnalyzer = new RepoAnalyzer();
		this.userMetadataExtractor = new UserMetadataExtractor();
	}

	public async exec(
		username: string,
		defaultCountry: string | null,
		defaultTwitter: string | null,
		repoCount = 20,
	): Promise<void> {
		const userProfile = await this.githubService.getUserInfo(username);
		const contributedRepos =
			await this.githubService.getContributedReposInLastMonth(username);

		const userRepos = await this.extractRepoDetails(contributedRepos, username);
		const pinnedOrTopRepos =
			await this.githubService.getPinnedOrTopRepos(username);
		const metadata = await this.userMetadataExtractor.extract(
			username,
			userRepos,
		);

		const techStackSet = mapTechStack(userRepos);

		if (defaultCountry) {
			userProfile.country = defaultCountry;
		}

		if (defaultTwitter) {
			userProfile.twitterUsername = defaultTwitter;
		}

		const userRecord: UserInsert = {
			id: nanoid(),
			username,
			fullname: userProfile.name ?? "",
			avatarUrl: userProfile.avatarUrl,
			stars: userProfile.starsCount,
			followers: userProfile.followers,
			following: userProfile.following,
			repositories: userProfile.publicRepos,
			contributions: userProfile.contributionCount,
			country: userProfile.country ?? null,
			city: userProfile.city ?? null,
			website: userProfile.websiteUrl ?? null,
			twitter: userProfile.twitterUsername ?? null,
			linkedin: userProfile.linkedinUrl ?? null,
			about: metadata.about,
			stack: Array.from(techStackSet),
			potentialRoles: metadata.roles,
			repos: userRepos,
			pinnedRepos: pinnedOrTopRepos,
			curriculumVitae: null,
		};

		const existingUser = (await db.query.user.findFirst({
			where: (table, { ilike }) => ilike(table.username, username),
		})) as UserSelect;
		if (existingUser) {
			userRecord.id = existingUser.id;
			await db
				.update(userTable)
				.set(userRecord)
				.where(eq(userTable.id, existingUser.id));
		} else {
			await db.insert(userTable).values(userRecord);
		}
	}

	private async extractRepoDetails(
		topRepos: RepoSummary[],
		username: string,
	): Promise<RecentRepo[]> {
		const topReposDetails = new Map<
			string,
			{ fullName: string; techStack: string[]; description: string }
		>();

		const repoContributions = new Map<string, RepoContribution>();

		for (const repo of topRepos) {
			const fileTree = await this.githubService.getRepoFileTree(repo.fullName);
			const { techStack, description } = await this.repoAnalyzer.analyze(
				repo.fullName,
				repo.defaultBranch,
				fileTree,
			);

			topReposDetails.set(repo.fullName, {
				fullName: repo.fullName,
				techStack,
				description,
			});

			const contribution =
				await this.githubService.getRepoContributionsInLastMonth(
					repo.fullName,
					username,
				);
			repoContributions.set(repo.fullName, contribution);
		}
		return mapRecentRepos(topRepos, topReposDetails, repoContributions);
	}
}
