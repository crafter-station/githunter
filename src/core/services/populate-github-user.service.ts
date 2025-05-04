import { TechStackExtractor } from "@/services/tech-stack-extractor";
import { nanoid } from "nanoid";
import { db } from "../../db";
import { user as userTable } from "../../db/schema";
import { GithubService } from "../../services/github-scrapper";
import type {
	RepoDetails,
	RepoSummary,
	UserProfile,
} from "../../services/github-scrapper";

export class PopulateGithubUser {
	private githubService: GithubService;
	private techStackExtractor: TechStackExtractor;

	constructor() {
		this.githubService = new GithubService();
		this.techStackExtractor = new TechStackExtractor();
	}

	public async exec(username: string, repoCount = 10): Promise<void> {
		const userProfile: UserProfile =
			await this.githubService.getUserInfo(username);
		const topRepos = await this.githubService.getTopReposIncludingOrgs(
			username,
			repoCount,
		);
		const allRepos = await this.githubService.getTopReposIncludingOrgs(
			username,
			5,
		);
		const repoDetails = await this.extractRepoDetails(allRepos);
		const techStack = await this.extractTechStack(topRepos, repoDetails);
		const { city, country } = this.extractCityAndCountry(userProfile);

		const userRecord = this.mapToRecord(userProfile, techStack, city, country);

		await db.insert(userTable).values(userRecord).execute();
	}

	private async extractRepoDetails(
		allRepos: RepoSummary[],
	): Promise<Record<string, RepoDetails>> {
		const repoDetails: Record<string, RepoDetails> = {};
		for (const repo of allRepos) {
			try {
				const [owner, name] = repo.fullName.split("/");
				repoDetails[repo.fullName] = await this.githubService.getRepoDetails(
					owner,
					name,
				);
			} catch {
				repoDetails[repo.fullName] = { readme: "", languages: [], tree: "" };
			}
		}
		return repoDetails;
	}

	private async extractTechStack(
		topRepos: RepoSummary[],
		repoDetails: Record<string, RepoDetails>,
	): Promise<Set<string>> {
		const techStack = new Set<string>();
		for (const repo of topRepos) {
			const repoDetail = repoDetails[repo.fullName];
			const stack = await this.techStackExtractor.extract(
				repo.name,
				"main",
				repoDetail.tree,
			);

			for (const tech of stack) {
				techStack.add(tech);
			}
		}
		return techStack;
	}

	private extractCityAndCountry(userProfile: UserProfile): {
		city: string | null;
		country: string | null;
	} {
		let city: string | null = null;
		let country: string | null = null;
		if (userProfile.location) {
			const parts = userProfile.location.split(",").map((p) => p.trim());
			if (parts.length > 1) {
				// biome-ignore lint/style/noNonNullAssertion: TODO: check if this is correct
				country = parts.pop()!;
				city = parts.join(", ");
			} else {
				city = parts[0];
			}
		}

		return { city, country };
	}

	private mapToRecord(
		userProfile: UserProfile,
		techStack: Set<string>,
		city: string | null,
		country: string | null,
	) {
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
			country,
			city,
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
