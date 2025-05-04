import { RepoAnalyzer } from "@/services/repo-analyzer";
import type { RepoAnalysisResult } from "@/services/repo-analyzer";
import { nanoid } from "nanoid";
import { db } from "../../db";
import { user as userTable } from "../../db/schema";
import { GithubService } from "../../services/github-scrapper";
import type { RepoSummary, UserProfile } from "../../services/github-scrapper";

export class PopulateGithubUser {
	private githubService: GithubService;
	private repoAnalyzer: RepoAnalyzer;

	constructor() {
		this.githubService = new GithubService();
		this.repoAnalyzer = new RepoAnalyzer();
	}

	public async exec(username: string, repoCount = 10): Promise<void> {
		const userProfile: UserProfile =
			await this.githubService.getUserInfo(username);
		const topRepos = await this.githubService.getTopReposIncludingOrgs(
			username,
			repoCount,
		);
		const repoDetails = await this.extractRepoDetails(topRepos);
		const techStack = await this.extractTechStack(topRepos, repoDetails);

		const userRecord = this.mapToRecord(userProfile, techStack);

		await db.insert(userTable).values(userRecord).execute();
	}

	private async extractRepoDetails(
		allRepos: RepoSummary[],
	): Promise<Record<string, string>> {
		const detailPromises = allRepos.map(async (repo) => {
			try {
				const details = await this.githubService.getRepoFileTree(repo.fullName);
				return { key: repo.fullName, details };
			} catch {
				return {
					key: repo.fullName,
					details: "",
				};
			}
		});

		const settled = await Promise.allSettled(detailPromises);

		const repoDetails: Record<string, string> = {};
		for (const result of settled) {
			if (result.status === "fulfilled") {
				const { key, details } = result.value;
				repoDetails[key] = details;
			} else {
				console.warn("Promise rejected unexpectedly", result.reason);
			}
		}

		return repoDetails;
	}

	private async extractTechStack(
		topRepos: RepoSummary[],
		repoDetails: Record<string, string>,
	): Promise<Set<string>> {
		const extractPromises: Promise<RepoAnalysisResult>[] = topRepos.map(
			(repo) => {
				const { name, defaultBranch, fullName } = repo;
				const tree = repoDetails[fullName];
				return this.repoAnalyzer.analyze(name, defaultBranch, tree);
			},
		);

		const stacks: RepoAnalysisResult[] = await Promise.all(extractPromises);

		const techStack = new Set<string>();
		for (const stack of stacks) {
			for (const tech of stack.techStack) {
				techStack.add(tech);
			}
		}

		return techStack;
	}

	private mapToRecord(userProfile: UserProfile, techStack: Set<string>) {
		return {
			id: nanoid(),
			clerkId: null,
			username: userProfile.login,
			fullname: userProfile.name || userProfile.login,
			email: userProfile.email,
			avatarUrl: userProfile.avatarUrl,
			stars: userProfile.starsCount,
			followers: userProfile.followers,
			following: userProfile.following,
			repositories: userProfile.publicRepos,
			contributions: userProfile.contributionCount,
			country: userProfile.country,
			city: userProfile.city,
			website: userProfile.websiteUrl,
			twitter: userProfile.twitterUsername
				? `https://twitter.com/${userProfile.twitterUsername}`
				: null,
			linkedin: userProfile.linkedinUrl,
			about: userProfile.bio,
			stack: Array.from(techStack),
			potentialRoles: [], // TODO: add potential roles still empty
		};
	}
}
