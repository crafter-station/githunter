import { RepoAnalyzer } from "@/services/repo-analyzer";
import { UserMetadataExtractor } from "@/services/user-metadata-extractor";
import { GithubService } from "../../services/github-scrapper";
import type {
	RepoContribution,
	RepoSummary,
} from "../../services/github-scrapper";
import {
	mapReposOfUser,
	mapTechStackFromRepos,
	mapUser,
} from "../models/mappers";
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
		const contributedRepos =
			await this.githubService.getContributedReposInLastMonth(username);

		const userRepos = await this.extractRepoDetails(contributedRepos, username);
		const pinnedOrTopRepos =
			await this.githubService.getPinnedOrTopRepos(username);
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
			pinnedOrTopRepos,
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
		username: string,
	): Promise<RepoOfUser[]> {
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
		return mapReposOfUser(topRepos, topReposDetails, repoContributions);
	}
}
