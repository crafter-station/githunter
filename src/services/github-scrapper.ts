import { Octokit } from "@octokit/rest";

// Add these imports for HTML scraping
import axios from "axios";
import * as cheerio from "cheerio";

export class GithubError extends Error {
	constructor(
		message: string,
		public readonly code?: string,
	) {
		super(message);
		this.name = "GithubError";
	}
}

export interface UserProfile {
	login: string;
	name: string | null;
	location: string | null;
	bio: string | null;
	publicRepos: number;
	followers: number;
	following: number;
	starsCount: number;
	contributionCount: number;
	// new fields:
	email: string | null;
	avatarUrl: string;
	websiteUrl: string | null;
	twitterUsername: string | null;
	linkedinUrl: string | null;
}

export interface RepoSummary {
	name: string;
	fullName: string;
	htmlUrl: string;
	stars: number;
	owner: {
		login: string;
	};
}

export interface RepoDetails {
	readme: string;
	languages: string[];
	tree: string;
}

export class GithubService {
	private octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN || undefined,
	});

	async getUserInfo(username: string): Promise<UserProfile> {
		try {
			const { data } = await this.octokit.users.getByUsername({ username });
			const starsCount = await this.getTotalStars(username);
			const contributionCount =
				await this.getContributionCountFromPage(username);

			// scrape profile page for linkedin (and fallback website/twitter detection)
			const profileHtml = await axios.get(`https://github.com/${username}`);
			const $ = cheerio.load(profileHtml.data);
			let linkedinUrl: string | null = null;
			const websiteUrl: string | null = data.blog || null;
			const twitterUsername: string | null = data.twitter_username || null;

			// find any <a> that points to linkedin.com
			$('a[href*="linkedin.com"]').each((i, el) => {
				const href = $(el).attr("href");
				if (href) linkedinUrl = href;
			});

			return {
				login: data.login,
				name: data.name,
				location: data.location,
				bio: data.bio,
				publicRepos: data.public_repos,
				followers: data.followers,
				following: data.following,
				starsCount,
				contributionCount,

				// new:
				email: data.email, // may be null
				avatarUrl: data.avatar_url,
				websiteUrl,
				twitterUsername,
				linkedinUrl,
			};
		} catch (err) {
			throw new GithubError(
				`Failed to fetch user info for ${username}`,
				"USER_INFO_ERROR",
			);
		}
	}

	private async getTotalStars(username: string): Promise<number> {
		try {
			let page = 1;
			let stars = 0;
			while (true) {
				const { data: repos } = await this.octokit.repos.listForUser({
					username,
					per_page: 100,
					page,
					sort: "created",
				});
				if (repos.length === 0) break;
				stars += repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
				page++;
			}
			return stars;
		} catch (err) {
			throw new GithubError(
				`Failed to calculate stars for ${username}`,
				"STAR_COUNT_ERROR",
			);
		}
	}

	/** Fetch detailed repo info */
	async getRepoDetails(owner: string, repo: string): Promise<RepoDetails> {
		try {
			// README
			let readme = "";
			try {
				const { data: readmeData } = await this.octokit.repos.getReadme({
					owner,
					repo,
				});
				readme = Buffer.from(readmeData.content, "base64").toString("utf-8");
			} catch {
				console.log(`No README found for ${owner}/${repo}`);
			}

			// Languages
			let languages: string[] = [];
			try {
				const { data: langs } = await this.octokit.repos.listLanguages({
					owner,
					repo,
				});
				languages = Object.keys(langs);
			} catch (err) {
				console.log(`Failed to fetch languages for ${owner}/${repo}`);
			}

			// File tree - Try multiple approaches to handle both personal and org repos
			let fileTree = "";

			try {
				// Approach 1: Using git reference
				fileTree = await this.getFileTreeUsingGitRef(owner, repo);
			} catch (err) {
				console.log(
					`Failed to fetch tree using git ref for ${owner}/${repo}: ${
						err instanceof Error ? err.message : String(err)
					}`,
				);

				try {
					// Approach 2: Using contents API (alternative for some repos)
					fileTree = await this.getFileTreeUsingContentsApi(owner, repo);
				} catch (err2) {
					console.log(
						`Failed to fetch tree using contents API for ${owner}/${repo}: ${
							err2 instanceof Error ? err2.message : String(err2)
						}`,
					);
					fileTree =
						"Repository file tree could not be fetched due to access restrictions.";
				}
			}

			return { readme, languages, tree: fileTree };
		} catch (err) {
			throw new GithubError(
				`Failed to fetch repo details for ${owner}/${repo}`,
				"REPO_DETAILS_ERROR",
			);
		}
	}

	/** Get file tree using Git Reference API - works for most repos */
	private async getFileTreeUsingGitRef(
		owner: string,
		repo: string,
	): Promise<string> {
		// Get default branch
		const { data: repoData } = await this.octokit.repos.get({ owner, repo });
		const defaultBranch = repoData.default_branch;

		// Get reference
		const { data: refData } = await this.octokit.git.getRef({
			owner,
			repo,
			ref: `heads/${defaultBranch}`,
		});

		// Get tree
		const { data: treeData } = await this.octokit.git.getTree({
			owner,
			repo,
			tree_sha: refData.object.sha,
			recursive: "true",
		});

		// Convert tree to string representation
		return this.buildFileTreeString(treeData.tree);
	}

	/** Get file tree using Contents API - alternative approach for some repos */
	private async getFileTreeUsingContentsApi(
		owner: string,
		repo: string,
	): Promise<string> {
		// Structure to build tree
		interface TreeNode {
			[key: string]: TreeNode | string;
		}

		const root: TreeNode = {};

		// Start with the root directory
		await this.fetchContentsRecursively(owner, repo, "", root, 0);

		// Convert structure to string representation
		return this.renderTree(root, "", true);
	}

	/** Recursively fetch contents of directories */
	private async fetchContentsRecursively(
		owner: string,
		repo: string,
		path: string,
		target: Record<string, Record<string, unknown> | string>,
		depth: number,
		maxDepth = 8,
	): Promise<void> {
		// Limit recursion depth to avoid rate limits
		if (depth > maxDepth) return;

		try {
			const { data: contents } = await this.octokit.repos.getContent({
				owner,
				repo,
				path: path || ".",
			});

			// Handle array response (directory contents)
			if (Array.isArray(contents)) {
				for (const item of contents) {
					if (item.type === "file" && item.name) {
						target[item.name] = "blob";
					} else if (item.type === "dir" && item.name && item.path) {
						target[item.name] = {};
						// Recursively fetch contents of this directory
						const itemPath = typeof item.path === "string" ? item.path : "";
						await this.fetchContentsRecursively(
							owner,
							repo,
							itemPath,
							target[item.name] as Record<
								string,
								Record<string, unknown> | string
							>,
							depth + 1,
							maxDepth,
						);
					}
				}
			}
		} catch (error) {
			// Silently fail for individual directories
			console.log(`Could not fetch contents for ${owner}/${repo}/${path}`);
		}
	}

	/** Helper: Build a string representation of the file tree */
	private buildFileTreeString(
		// biome-ignore lint/suspicious/noExplicitAny: using any due to type complexity
		treeItems: any[],
	): string {
		// Create a nested structure for the file tree
		// biome-ignore lint/suspicious/noExplicitAny: using any due to nested structure complexity
		const root: Record<string, any> = {};

		// Sort items to ensure directories come before files
		treeItems.sort((a, b) => {
			// Sort by path depth first
			const aDepth = a.path.split("/").length;
			const bDepth = b.path.split("/").length;
			if (aDepth !== bDepth) return aDepth - bDepth;

			// Then by type (directory before file)
			if (a.type !== b.type) {
				return a.type === "tree" ? -1 : 1;
			}

			// Then alphabetically
			return a.path.localeCompare(b.path);
		});

		// Process each path and build the tree structure
		for (const item of treeItems) {
			const path = item.path;
			const parts = path.split("/");
			let current = root;

			for (let i = 0; i < parts.length; i++) {
				const part = parts[i];
				const isLast = i === parts.length - 1;

				if (isLast) {
					// Leaf node
					current[part] = item.type;
				} else {
					// Create branch if it doesn't exist
					if (!current[part]) {
						current[part] = {};
					}
					current = current[part];
				}
			}
		}

		// Generate the tree string
		return this.renderTree(root, "", true);
	}

	/** Helper: Render the tree structure as a string */
	private renderTree(
		// biome-ignore lint/suspicious/noExplicitAny: using any due to nested structure complexity
		node: Record<string, any>,
		prefix: string,
		isRoot: boolean,
	): string {
		let result = isRoot ? "" : "\n";
		const keys = Object.keys(node).sort((a, b) => {
			// Directories first, then files
			const aIsDir = typeof node[a] === "object";
			const bIsDir = typeof node[b] === "object";
			if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;
			return a.localeCompare(b);
		});

		keys.forEach((key, index) => {
			const isLast = index === keys.length - 1;
			const value = node[key];
			const isDir = typeof value === "object";

			// Current line
			result += `${prefix}${isLast ? "└── " : "├── "}${key}${isDir ? "/" : ""}`;

			// Process children if it's a directory
			if (isDir) {
				const newPrefix = prefix + (isLast ? "    " : "│   ");
				result += this.renderTree(value, newPrefix, false);
			} else {
				result += "\n";
			}
		});

		return result;
	}

	/** Fetch top N repos by stars including user's orgs */
	async getTopReposIncludingOrgs(
		username: string,
		topN: number,
	): Promise<RepoSummary[]> {
		try {
			// collect user's own repos
			const userRepos = await this.collectUserRepos(username);
			console.log(userRepos[0]);

			// fetch organizations
			const { data: orgs } = await this.octokit.orgs.listForUser({
				username,
				per_page: 100,
			});

			// collect org repos
			const orgRepoPromises = orgs.map((org) =>
				this.collectOrgRepos(org.login),
			);
			const orgReposArrays = await Promise.all(orgRepoPromises);
			const orgRepos = orgReposArrays.flat();

			console.log(orgRepos[0]);

			// combine and sort
			const combined = [...userRepos, ...orgRepos];
			return this.sortAndSlice(combined, topN);
		} catch (err) {
			throw new GithubError(
				`Failed to fetch top repos including orgs for ${username}`,
				"TOP_REPOS_ORGS_ERROR",
			);
		}
	}

	/** Helper: list all user repos (paginated) */
	// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
	private async collectUserRepos(username: string): Promise<Array<any>> {
		let page = 1;
		// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
		const all: Array<any> = [];
		while (true) {
			const { data } = await this.octokit.repos.listForUser({
				username,
				per_page: 100,
				page,
				sort: "pushed",
			});
			if (data.length === 0) break;
			all.push(...data);
			page++;
		}
		return all;
	}

	/** Helper: list all org repos (paginated) */
	// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
	private async collectOrgRepos(org: string): Promise<Array<any>> {
		let page = 1;
		// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
		const all: Array<any> = [];
		while (true) {
			const { data } = await this.octokit.repos.listForOrg({
				org,
				per_page: 100,
				page,
			});
			if (data.length === 0) break;
			all.push(...data);
			page++;
		}
		return all;
	}

	/** Helper: sort by stars and slice */
	// biome-ignore lint/suspicious/noExplicitAny: TODO: change to proper type
	private sortAndSlice(repos: Array<any>, topN: number): RepoSummary[] {
		return repos
			.sort((a, b) => (b.stargazers_count ?? 0) - (a.stargazers_count ?? 0))
			.slice(0, topN)
			.map((repo) => ({
				name: repo.name,
				fullName: repo.full_name,
				htmlUrl: repo.html_url,
				stars: repo.stargazers_count ?? 0,
				owner: {
					login: repo.owner?.login || "",
				},
			}));
	}

	/**
	 * Scrape contribution data directly from GitHub profile pages
	 */
	private async getContributionCountFromPage(
		username: string,
	): Promise<UserProfile["contributionCount"]> {
		try {
			// Get current year
			const currentYear = new Date().getFullYear();

			// Use contribution calendar URL format
			const contributionUrl = `https://github.com/users/${username}/contributions?from=${currentYear}-01-01&to=${currentYear}-12-31`;

			const response = await axios.get(contributionUrl);
			const $ = cheerio.load(response.data);

			// Extract total contribution count from heading
			const headerText = $("h2.f4.text-normal.mb-2").text().trim();
			const totalCount = Number.parseInt(headerText.split(" ")[0], 10) || 0;

			return totalCount;
		} catch (err) {
			console.error(`Failed to get contribution data for ${username}:`, err);
			// Return default empty values if scraping fails
			return 0;
		}
	}
}
