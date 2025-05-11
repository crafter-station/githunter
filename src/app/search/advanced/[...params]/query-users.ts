import { db } from "@/db";
import { type RawUserSelect, type ScoredUserSelect, user } from "@/db/schema";
import { SEARCH_RESULTS_PER_PAGE } from "@/lib/constants";
import { sql } from "drizzle-orm";

// Main query function that handles advanced search
export async function queryUsersAdvanced(params: {
	technologies: { tech: string; relevance: number }[];
	city: string | null;
	country: string | null;
	page: number;
}) {
	const query = sql.empty();

	// Base query
	query.append(sql`
    SELECT * FROM ${user}
    WHERE 1=1
  `);

	// Use array overlap for tech stack
	if (params.technologies && params.technologies.length > 0) {
		query.append(sql` AND ${user.stack} && ARRAY[`);
		const techArray = params.technologies.map((tech) => sql`${tech.tech}`);
		query.append(sql.join(techArray, sql`, `));
		query.append(sql`]`);
	}

	// Add city condition if provided
	if (params.city) {
		query.append(sql` AND ${user.city} ILIKE ${`%${params.city}%`}`);
	}

	// Add country condition if provided
	if (params.country) {
		query.append(sql` AND ${user.country} ILIKE ${`%${params.country}%`}`);
	}

	// Add ordering by stars and contributions
	query.append(sql` ORDER BY ${user.contributions} DESC, ${user.stars} DESC`);

	// Execute the query to get all results for counting total
	const usersResult = await db.execute(query);

	// Fix the calculate score function with proper typing
	function calculateScore(userData: RawUserSelect) {
		let score =
			userData.followers * 5 + userData.following * 2 + userData.repositories;

		for (const repo of userData.repos || []) {
			for (const tech of params.technologies) {
				if (repo.techStack?.includes(tech.tech)) {
					score +=
						Math.log(repo.stars + 1) *
						((repo.contribution?.commitsCount || 0) +
							(repo.contribution?.issuesCount || 0) * 0.5 +
							(repo.contribution?.pullRequestsCount || 0) * 2) *
						tech.relevance;
				}
			}
		}

		return score;
	}

	// Format and sort results
	const usersSorted = (usersResult.rows as unknown as RawUserSelect[])
		.filter((u) =>
			params.technologies
				.filter((t) => t.relevance > 80)
				.every((t) => u.stack?.includes(t.tech)),
		)
		.map(
			(u) =>
				({
					id: u.id,
					clerkId: u.clerk_id,
					score: calculateScore(u),
					username: u.username,
					fullname: u.fullname,
					email: u.email,
					avatarUrl: u.avatar_url,
					stars: u.stars,
					followers: u.followers,
					following: u.following,
					repositories: u.repositories,
					contributions: u.contributions,
					country: u.country,
					city: u.city,
					website: u.website,
					twitter: u.twitter,
					linkedin: u.linkedin,
					about: u.about,
					stack: u.stack,
					potentialRoles: u.potential_roles,
					repos: u.repos,
					pinnedRepos: u.pinnedRepos,
					createdAt: u.created_at,
					updatedAt: u.updated_at,
				}) satisfies ScoredUserSelect,
		)
		.sort((a, b) => b.score - a.score);

	// Calculate total pages
	const totalPages = Math.ceil(usersSorted.length / SEARCH_RESULTS_PER_PAGE);

	// Get paginated results
	const startIndex = (params.page - 1) * SEARCH_RESULTS_PER_PAGE;
	const paginatedUsers = usersSorted.slice(
		startIndex,
		startIndex + SEARCH_RESULTS_PER_PAGE,
	);

	return {
		users: paginatedUsers,
		totalUsers: usersSorted.length,
		totalPages,
	};
}
