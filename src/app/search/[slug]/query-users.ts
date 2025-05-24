import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db";
import {
	type RawUserSelect,
	type ScoredUserSelect,
	type UserSelect,
	user,
} from "@/db/schema";

import { SEARCH_RESULTS_PER_PAGE } from "@/lib/constants";

import type { SearchParams } from "./types";

export async function queryUsers(
	slug: string,
	searchParams: SearchParams,
	pageIndex: number,
) {
	const query = sql.empty();

	// Base query
	query.append(sql`
			SELECT * FROM ${user}
			WHERE 1=1
		`);

	// Use array overlap operator && instead of contains @>
	// This will match if ANY of the search terms match instead of requiring ALL to match
	if (searchParams.role && searchParams.role.length > 0) {
		query.append(sql` AND ${user.potentialRoles} && ARRAY[`);
		const rolesArray = [
			searchParams.role,
			...searchParams.alternativeNamesForRole,
		].map((role) => sql`${role}`);
		query.append(sql.join(rolesArray, sql`, `));
		query.append(sql`]`);
	}

	// Add city condition if provided
	if (searchParams.city) {
		query.append(sql` AND ${user.city} ILIKE ${`%${searchParams.city}%`}`);
	}

	// Add country condition if provided
	if (searchParams.country) {
		query.append(
			sql` AND ${user.country} ILIKE ${`%${searchParams.country}%`}`,
		);
	}

	// Use array overlap for tech stack too
	if (searchParams.techStack && searchParams.techStack.length > 0) {
		query.append(sql` AND ${user.stack} && ARRAY[`);
		const techArray = searchParams.techStack.map((tech) => sql`${tech.tech}`);
		query.append(sql.join(techArray, sql`, `));
		query.append(sql`]`);
	}

	// Add stars filter if provided
	if (searchParams.minStars) {
		query.append(sql` AND ${user.stars} >= ${searchParams.minStars}`);
	}

	// Add repositories filter if provided
	if (searchParams.minRepos) {
		query.append(sql` AND ${user.repositories} >= ${searchParams.minRepos}`);
	}

	// Add ordering
	query.append(sql` ORDER BY ${user.contributions} DESC`);

	// Add limit
	query.append(sql` LIMIT 200`);

	// Execute the query
	const usersFirstFilter = await db.execute(query);

	function calculateScore(user: UserSelect & { potential_roles: string[] }) {
		let score = user.followers * 5 + user.following * 2 + user.repositories;

		for (const repo of user.repos) {
			for (const tech of searchParams.techStack) {
				if (repo.techStack.includes(tech.tech)) {
					score +=
						Math.log(repo.stars + 1) *
						(repo.contribution.commitsCount +
							repo.contribution.issuesCount * 0.5 +
							repo.contribution.pullRequestsCount * 2) *
						tech.relevance;
				}
			}
		}

		return score;
	}

	const usersSorted = (usersFirstFilter.rows as RawUserSelect[])
		.filter((u) =>
			searchParams.techStack
				.filter((t) => t.relevance > 80)
				.every((t) => u.stack.includes(t.tech)),
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

					curriculumVitae: u.curriculumVitae,
				}) satisfies ScoredUserSelect,
		)
		.sort((a, b) => b.score - a.score);

	// Get paginated users
	const startIndex = (pageIndex - 1) * SEARCH_RESULTS_PER_PAGE;
	const endIndex = startIndex + SEARCH_RESULTS_PER_PAGE;
	const paginatedUsers = usersSorted.slice(startIndex, endIndex);

	return {
		paginatedUsers,
		totalUsers: usersSorted.length,
		totalPages: Math.ceil(usersSorted.length / SEARCH_RESULTS_PER_PAGE),
	};
}

// Define the structure for our search summary
export const SearchSummarySchema = z.object({
	totalDevelopers: z.number(),
	location: z.string().nullable(),
	techStack: z.array(z.string()),
	roleInfo: z.object({
		primary: z.string(),
		alternatives: z.array(z.string()),
	}),
	topDevelopers: z.array(
		z.object({
			username: z.string(),
			fullname: z.string().nullable(),
			location: z.string().nullable(),
			stars: z.number(),
			followers: z.number(),
			repositories: z.number(),
			avatarUrl: z.string().nullable(),
		}),
	),
	spokenDigest: z.string(),
});

export type SearchSummaryData = z.infer<typeof SearchSummarySchema>;
