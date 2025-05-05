import { openai } from "@ai-sdk/openai";
import { Octokit } from "@octokit/rest";
import { generateObject } from "ai";
import { z } from "zod";

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
	city: string | null;
	country: string | null;
}

export interface RepoSummary {
	name: string;
	fullName: string;
	stars: number;
	defaultBranch: string;
}

export interface RepoDetails {
	readme: string;
	languages: string[];
	tree: string;
}

export interface RepoContribution {
	pullRequests: number;
	commits: number;
	issues: number;
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

			let city: string | null = null;
			let country: string | null = null;
			if (data.location) {
				const response = await generateObject({
					model: openai("gpt-4o"),
					schema: z.object({
						city: z.string(),
						country: z.string(),
					}),
					prompt: `Extract the city and country from the following location: ${data.location}`,
				});
				city = response.object.city;
				country = response.object.country;
			}

			return {
				login: data.login,
				name: data.name,
				city,
				country,
				bio: data.bio,
				publicRepos: data.public_repos,
				followers: data.followers,
				following: data.following,
				starsCount,
				contributionCount,
				email: data.email, // may be null
				avatarUrl: data.avatar_url,
				websiteUrl,
				twitterUsername,
				linkedinUrl,
			};
		} catch (err) {
			console.error(`Failed to fetch user info for ${username}`);
			console.error(err);
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

	async getRepoContributionsInLastMonth(
		repoFullName: string,
		username: string,
	): Promise<RepoContribution> {
		const [owner, repo] = repoFullName.split("/");
		const sinceDate = new Date();
		sinceDate.setMonth(sinceDate.getMonth() - 1);
		const since = sinceDate.toISOString();

		const prQuery = `type:pr repo:${owner}/${repo} author:${username} created:>=${since}`;
		const { data: prList } = await this.octokit.search.issuesAndPullRequests({
			q: prQuery,
		});

		const issueQuery = `type:issue repo:${owner}/${repo} author:${username} created:>=${since}`;
		const { data: issueList } = await this.octokit.search.issuesAndPullRequests(
			{
				q: issueQuery,
			},
		);

		let totalCommits = 0;
		let page = 1;
		while (true) {
			const { data: commitList } = await this.octokit.repos.listCommits({
				owner,
				repo,
				author: username,
				since,
				per_page: 100,
				page,
			});
			if (!commitList.length) break;
			totalCommits += commitList.length;
			page++;
			if (page > 10) break;
		}

		return {
			pullRequests: prList.total_count,
			issues: issueList.total_count,
			commits: totalCommits,
		};
	}

	async getContributedReposInLastMonth(username: string): Promise<Set<string>> {
		const sinceDate = new Date();
		sinceDate.setMonth(sinceDate.getMonth() - 1);
		const since = sinceDate.toISOString();

		const reposSet = new Set<string>();
		let page = 1;

		while (true) {
			const { data: events } =
				await this.octokit.activity.listPublicEventsForUser({
					username,
					per_page: 100,
					page,
				});
			if (!events.length) break;

			for (const ev of events) {
				if (!ev.created_at) {
					continue;
				}

				const eventDate = new Date(ev.created_at);
				if (eventDate.toISOString() < since) {
					page = Number.POSITIVE_INFINITY;
					break;
				}
				// Filtrar solo eventos que representan contribuciones
				if (
					ev.type === "PushEvent" ||
					ev.type === "PullRequestEvent" ||
					ev.type === "IssuesEvent"
				) {
					if (ev.repo?.name) {
						reposSet.add(ev.repo.name);
					}
				}
			}

			page++;
			if (page > 10) break;
		}

		return reposSet;
	}

	async getRepoSummary(fullName: string): Promise<RepoSummary> {
		const [owner, repo] = fullName.split("/");
		const { data } = await this.octokit.repos.get({ owner, repo });
		return {
			name: data.name,
			fullName: data.full_name,
			stars: data.stargazers_count,
			defaultBranch: data.default_branch,
		};
	}

	/** Fetch detailed repo info */
	async getRepoFileTree(fullName: string): Promise<string> {
		try {
			const [owner, repo] = fullName.split("/");

			// File tree - Try multiple approaches to handle both personal and org repos
			let fileTree = "";

			try {
				// Approach 1: Using git reference
				fileTree = await this.getFileTreeUsingGitRef(owner, repo);
				if (fileTree === "") {
					throw new Error("File tree is empty");
				}
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

			return fileTree;
		} catch (err) {
			throw new GithubError(
				`Failed to fetch repo details for ${fullName}`,
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

		// 2. Filtras por profundidad ≤ 2
		const limitedTree = treeData.tree.filter((entry) => {
			if (!entry.path) return false;
			// un path sin slash es nivel 1, con un slash es nivel 2, etc.
			const depth = entry.path.split("/").length;
			return depth <= 2;
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
		maxDepth = 3,
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
	// biome-ignore lint/suspicious/noExplicitAny: using any due to nested structure complexity
	private buildFileTreeString(treeItems: any[]): string {
		// 1) Build a nested structure
		interface Node {
			__children: Record<string, Node>;
		}
		const root: Record<string, Node> = {};

		for (const item of treeItems) {
			const parts = item.path.split("/");
			let current = root;
			for (const part of parts) {
				if (!current[part]) {
					current[part] = { __children: {} };
				}
				current = current[part].__children;
			}
		}

		// 2) Render the tree
		const lines: string[] = [];
		function render(
			node: Record<string, Node>,
			prefix: string,
			isLast: boolean,
		) {
			const entries = Object.keys(node).sort();
			entries.forEach((name, idx) => {
				const last = idx === entries.length - 1;
				const branch = prefix + (isLast ? "└── " : "├── ");
				lines.push(branch + name);

				const children = node[name].__children;
				if (Object.keys(children).length > 0) {
					// extend prefix: if we're the last sibling, pad with spaces, otherwise with a vertical bar
					const childPrefix = prefix + (isLast ? "    " : "│   ");
					render(children, childPrefix, last);
				}
			});
		}

		// kick it off from root; root itself is considered “last”
		render(root, "", true);

		return lines.join("\n");
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
				stars: repo.stargazers_count ?? 0,
				defaultBranch: repo.default_branch,
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
