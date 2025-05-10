import fs from "node:fs";
import path from "node:path";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

interface GitHubUserSearchResult {
	id: number;
	login: string;
	name: string | null;
	avatar_url: string;
	html_url: string;
	public_repos: number;
	followers: number;
	bio: string | null;
}

/**
 * Search GitHub users by name or username
 * @param query - The search query (name or username)
 * @param page - Page number for pagination (default: 1)
 * @param perPage - Number of results per page (default: 30, max: 100)
 * @returns An array of GitHub user search results
 */
export async function searchGitHubUsers(query: string, page = 1, perPage = 30) {
	if (!query) {
		throw new Error("Search query is required");
	}

	// Initialize Octokit with GitHub token from environment variables
	const octokit = new Octokit({
		auth: process.env.GITHUB_TOKEN || undefined,
	});

	try {
		// Search for users matching the query
		const searchResponse = await octokit.search.users({
			q: query,
			per_page: perPage,
			page,
		});

		// Write search results to JSON file
		// Create search-result.json in the root directory
		fs.writeFileSync(
			path.join(process.cwd(), "search-result.json"),
			JSON.stringify(searchResponse.data.items, null, 2),
		);

		return searchResponse.data.items;
	} catch (error) {
		console.error("Error searching GitHub users:", error);
		throw new Error(
			`Failed to search GitHub users: ${error instanceof Error ? error.message : String(error)}`,
		);
	}
}

// Command-line interface
if (require.main === module) {
	(async () => {
		try {
			const args = process.argv.slice(2);

			if (args.length === 0) {
				throw new Error("No search query provided");
			}

			const query = args[0];
			const page = args.length > 1 ? Number.parseInt(args[1], 10) : 1;
			const perPage = args.length > 2 ? Number.parseInt(args[2], 10) : 30;

			await searchGitHubUsers(query, page, perPage);
		} catch (error) {
			console.error("Error executing script:", error);
		}
	})();
}
