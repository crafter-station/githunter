import * as fs from "node:fs";
import * as path from "node:path";
import { GithubService } from "../src/services/github-scrapper";
import type {
	RepoDetails,
	RepoSummary,
	UserProfile,
} from "../src/services/github-scrapper";

/**
 * Generates a markdown file with user profile and repositories information
 * using the existing GithubService
 * @param username GitHub username
 * @param outputPath Path where the markdown file will be saved
 * @param repoCount Number of repositories to include
 */
export async function generateGithubProfileMarkdown(
	username: string,
	outputPath: string,
	repoCount = 10,
): Promise<string> {
	try {
		const githubService = new GithubService();

		// Get user data
		const userProfile = await githubService.getUserInfo(username);

		// Get top repositories (including from organizations)
		const topRepos = await githubService.getTopReposIncludingOrgs(
			username,
			repoCount,
		);

		// Calculate total stars from organizations as well
		// Get a larger set of repos including org repos to calculate total stars
		const allRepos = await githubService.getTopReposIncludingOrgs(
			username,
			200, // Get a larger number to calculate more accurate star count
		);
		const totalStars = allRepos.reduce((sum, repo) => sum + repo.stars, 0);

		// Create a modified profile with updated star count
		const profileWithOrgStars = {
			...userProfile,
			starsCount: totalStars,
		};

		// Fetch repository details including file trees
		const repoDetails: Record<string, RepoDetails> = {};
		for (const repo of topRepos) {
			try {
				const [owner, repoName] = repo.fullName.split("/");
				repoDetails[repo.fullName] = await githubService.getRepoDetails(
					owner,
					repoName,
				);
			} catch (error) {
				console.log(
					`Could not fetch details for ${repo.fullName}: ${error instanceof Error ? error.message : String(error)}`,
				);
				// Create a placeholder for repos that can't be accessed
				repoDetails[repo.fullName] = {
					readme: "",
					languages: [],
					tree: "Repository details not available (may be private or inaccessible)",
				};
			}
		}

		// Generate markdown content
		const markdown = createMarkdown(profileWithOrgStars, topRepos, repoDetails);

		// Write to file
		if (outputPath) {
			const directory = path.dirname(outputPath);

			// Ensure directory exists
			if (!fs.existsSync(directory)) {
				fs.mkdirSync(directory, { recursive: true });
			}

			fs.writeFileSync(outputPath, markdown, "utf8");
			console.log(`Markdown saved to ${outputPath}`);
		}

		return markdown;
	} catch (error) {
		console.error("Error generating GitHub user markdown:", error);
		throw error;
	}
}

/**
 * Creates a markdown string from user profile and repository data
 */
function createMarkdown(
	user: UserProfile,
	repos: RepoSummary[],
	repoDetails: Record<string, RepoDetails>,
): string {
	// Start with user profile
	let markdown = `# ${user.name || user.login}'s GitHub Profile\n\n`;

	markdown += `- **Username**: [@${user.login}](https://github.com/${user.login})\n`;

	if (user.bio) {
		markdown += `- **Bio**: ${user.bio}\n`;
	}

	if (user.location) {
		markdown += `- **Location**: ${user.location}\n`;
	}

	markdown += `- **Public Repositories**: ${user.publicRepos}\n`;
	markdown += `- **Followers**: ${user.followers}\n`;
	markdown += `- **Following**: ${user.following}\n`;
	markdown += `- **Total Stars Earned**: ${user.starsCount} (including organization repositories)\n`;
	markdown += `- **Total Contributions 2025**: ${user.contributionCount}\n`;
	markdown += "\n";

	// Add repositories section
	markdown += "## Top Repositories (Including Organizations)\n\n";

	if (repos.length === 0) {
		markdown += "*No repositories found*\n\n";
	} else {
		markdown += "| Repository | Stars | URL |\n";
		markdown += "|------------|-------|-----|\n";

		for (const repo of repos) {
			markdown += `| ${repo.name} | ${repo.stars} | [View](${repo.htmlUrl}) |\n`;
		}

		markdown += "\n";
	}

	// Add repository file trees section
	markdown += "## Repository File Trees\n\n";

	for (const repo of repos) {
		const details = repoDetails[repo.fullName];
		if (details) {
			markdown += `### ${repo.name}\n\n`;

			// Add languages list
			if (details.languages.length > 0) {
				markdown += `**Languages**: ${details.languages.join(", ")}\n\n`;
			}

			// Add file tree
			markdown += "**File Tree**:\n\n";
			markdown += "```\n";
			if (details.tree) {
				markdown += details.tree;
			} else {
				markdown +=
					"Repository details not available (may be private or inaccessible)";
			}
			markdown += "```\n\n";
		}
	}

	// Add footer
	markdown += "\n\n---\n\n";
	markdown += `*Generated on ${new Date().toISOString().split("T")[0]}*\n`;

	return markdown;
}

// Example usage:
// const generator = new GithubMarkdownGenerator();
// generator.generateUserMarkdown('octocat', './output/github-profile.md', 10)
//   .then(markdown => console.log('Generated markdown successfully'))
//   .catch(error => console.error('Error:', error));

// Commented code above is for reference. Here's a runnable example:

// Example usage using HTML scraping approach
if (require.main === module) {
	(async () => {
		try {
			// Replace with a GitHub username you want to analyze
			const username = "Jibaru";
			const outputPath = "./output/github-profile.md";

			console.log(
				`Generating GitHub profile for ${username} using HTML scraping...`,
			);
			const markdown = await generateGithubProfileMarkdown(
				username,
				outputPath,
			);

			console.log("Profile generation successful!");
			console.log(`Output written to: ${outputPath}`);

			// Print a small preview
			const preview = markdown.split("\n").slice(0, 20).join("\n");
			console.log("\nPreview of the generated profile:\n");
			console.log(preview);
			console.log("\n... (truncated)");
		} catch (error) {
			console.error("Error testing GitHub profile generator:", error);
		}
	})();
}
