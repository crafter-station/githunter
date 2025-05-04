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
		const repoDetails = await this.extractRepoDetails(topRepos);
		const techStack = await this.extractTechStack(topRepos, repoDetails);
		const { city, country } = this.extractCityAndCountry(userProfile);

		const userRecord = this.mapToRecord(userProfile, techStack, city, country);

		await db.insert(userTable).values(userRecord).execute();
	}

	private async extractRepoDetails(
		allRepos: RepoSummary[],
	): Promise<Record<string, RepoDetails>> {
		const detailPromises = allRepos.map(async (repo) => {
			const [owner, name] = repo.fullName.split("/");
			try {
				const details = await this.githubService.getRepoDetails(owner, name);
				return { key: repo.fullName, details };
			} catch {
				return {
					key: repo.fullName,
					details: { readme: "", languages: [], tree: "" },
				};
			}
		});

		const settled = await Promise.allSettled(detailPromises);

		const repoDetails: Record<string, RepoDetails> = {};
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
		repoDetails: Record<string, RepoDetails>,
	): Promise<Set<string>> {
		const extractPromises: Promise<string[]>[] = topRepos.map((repo) => {
			const { name, defaultBranch, fullName } = repo;
			const tree = repoDetails[fullName].tree;
			return this.techStackExtractor.extract(name, defaultBranch, tree);
		});

		const stacks: string[][] = await Promise.all(extractPromises);

		const techStack = new Set<string>();
		for (const stack of stacks) {
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
