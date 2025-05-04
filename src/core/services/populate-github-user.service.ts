import { RepoAnalyzer } from "@/services/repo-analyzer";
import { UserMetadataExtractor } from "@/services/user-metadata-extractor";
import { GithubService } from "../../services/github-scrapper";
import type { RepoSummary } from "../../services/github-scrapper";
import { mapTechStackFromRepos, mapUser } from "../models/mappers";
import type { RepoOfUser } from "../models/user";
import { UserRepository } from "../repositories/user-repository";

export class PopulateGithubUser {
	private githubService: GithubService;
	private repoAnalyzer: RepoAnalyzer;
	private userRepository: UserRepository;
	private userMetadataExtractor: UserMetadataExtractor;

	constructor() {
		this.githubService = new GithubService();
		this.repoAnalyzer = new RepoAnalyzer();
		this.userRepository = new UserRepository();
		this.userMetadataExtractor = new UserMetadataExtractor();
	}

	public async exec(
		username: string,
		defaultCountry: string | null,
		defaultTwitter: string | null,
		repoCount = 20,
	): Promise<void> {
		const userProfile = await this.githubService.getUserInfo(username);
		const topRepos = await this.githubService.getTopReposIncludingOrgs(
			username,
			repoCount,
		);
		const userRepos = await this.extractRepoDetails(topRepos);

		const metadata = await this.userMetadataExtractor.extract(
			username,
			userRepos,
		);

		const techStackSet = mapTechStackFromRepos(userRepos);

		if (defaultCountry) {
			userProfile.country = defaultCountry;
		}

		if (defaultTwitter) {
			userProfile.twitterUsername = defaultTwitter;
		}

		const userRecord = mapUser(
			username,
			userProfile,
			userRepos,
			metadata,
			techStackSet,
		);

		const existingUser = await this.userRepository.findByUsername(username);
		if (existingUser) {
			userRecord.id = existingUser.id;
			await this.userRepository.update(userRecord);
		} else {
			await this.userRepository.insert(userRecord);
		}
	}

	private async extractRepoDetails(
		topRepos: RepoSummary[],
	): Promise<RepoOfUser[]> {
		const topReposDetails = new Map<
			string,
			{ fullName: string; techStack: string[]; description: string }
		>();

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
		}
		const userRepos: RepoOfUser[] = [];

		for (const repo of topRepos) {
			if (topReposDetails.has(repo.fullName)) {
				const detail = topReposDetails.get(repo.fullName);

				if (!detail) {
					continue;
				}

				userRepos.push({
					fullName: repo.fullName,
					description: detail.description,
					stars: repo.stars,
					techStack: detail.techStack,
				});
			}
		}

		return userRepos;
	}
}
