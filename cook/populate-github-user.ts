// scripts/populateGithubUser.ts
import { nanoid } from "nanoid";
import { db } from "../src/db";
import { user as userTable } from "../src/db/schema";
import { GithubService } from "../src/services/github-scrapper";
import type {
	RepoDetails,
	RepoSummary,
	UserProfile,
} from "../src/services/github-scrapper";

export async function populateGithubUser(
	username: string,
	repoCount = 10,
): Promise<void> {
	const github = new GithubService();

	// 1) Fetch enriched profile
	const userProfile: UserProfile = await github.getUserInfo(username);

	// 2) Fetch repos (top & all for languages)
	const topRepos: RepoSummary[] = await github.getTopReposIncludingOrgs(
		username,
		repoCount,
	);
	const allRepos: RepoSummary[] = await github.getTopReposIncludingOrgs(
		username,
		200,
	);

	// 3) Get detailed languages
	const repoDetails: Record<string, RepoDetails> = {};
	for (const repo of allRepos) {
		try {
			const [owner, name] = repo.fullName.split("/");
			repoDetails[repo.fullName] = await github.getRepoDetails(owner, name);
		} catch {
			repoDetails[repo.fullName] = { readme: "", languages: [], tree: "" };
		}
	}
	const stack = Array.from(
		new Set(allRepos.flatMap((r) => repoDetails[r.fullName]?.languages || [])),
	);

	// 4) Parse location
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

	// 5) Build record
	const record = {
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
		stack,
		potentialRoles: [], // TODO: add potential roles still empty
	};

	// 6) Upsert
	await db
		.insert(userTable)
		.values(record)
		.onConflictDoUpdate({
			target: userTable.username,
			set: {
				fullname: record.fullname,
				email: record.email,
				avatarUrl: record.avatarUrl,
				stars: record.stars,
				followers: record.followers,
				following: record.following,
				repositories: record.repositories,
				contributions: record.contributions,
				country: record.country,
				city: record.city,
				website: record.website,
				twitter: record.twitter,
				linkedin: record.linkedin,
				about: record.about,
				stack: record.stack,
				updatedAt: new Date(),
			},
		});

	console.log(`✅ Populated/updated user '${username}'`);
}

// If run as a script
if (require.main === module) {
	(async () => {
		const username = process.argv[2];
		const count = Number.parseInt(process.argv[3], 10) || 10;
		if (!username) {
			console.error(
				"Usage: ts-node populateGithubUser.ts <username> [repoCount]",
			);
			process.exit(1);
		}
		try {
			await populateGithubUser(username, count);
			console.log("Done.");
		} catch (err) {
			console.error("Error populating user:", err);
			process.exit(1);
		}
	})();
}
