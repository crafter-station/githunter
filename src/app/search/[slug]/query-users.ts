import { db } from "@/db";
import { type UserSelect, user } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { sql } from "drizzle-orm";
import { z } from "zod";
import type { SearchParams } from "./types";

interface QueryUsersProps {
	searchParams: SearchParams;
	slug: string;
}

export async function queryUsers({ searchParams, slug }: QueryUsersProps) {
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

	const usersSorted = (
		usersFirstFilter.rows as (UserSelect & {
			potential_roles: string[];
			clerk_id: string;
			avatar_url: string;
			created_at: Date;
			updated_at: Date;
		})[]
	)
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
				}) satisfies UserSelect & {
					score: number;
				},
		)
		.sort((a, b) => b.score - a.score);

	// At this point we have the users sorted by score

	return usersSorted;
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

/**
 * Generate a structured summary of the search results
 */
export async function generateSearchSummary(
	users: UserSelect[],
	searchParams: SearchParams,
): Promise<SearchSummaryData> {
	// Extract top 5 users for the summary
	const topUsers = users.slice(0, 5);

	// Create a compact representation of the search parameters and results
	const searchSummary = {
		query: {
			role: searchParams.role,
			alternativeRoles: searchParams.alternativeNamesForRole,
			techStack: searchParams.techStack.map((t) => t.tech),
			location: searchParams.city
				? `${searchParams.city}${searchParams.country ? `, ${searchParams.country}` : ""}`
				: searchParams.country || "Any location",
			minStars: searchParams.minStars,
			minRepos: searchParams.minRepos,
		},
		results: {
			totalFound: users.length,
			topUsers: topUsers.map((user) => ({
				username: user.username,
				fullname: user.fullname,
				location:
					user.city && user.country
						? `${user.city}, ${user.country}`
						: user.city || user.country || "Unknown location",
				stars: user.stars,
				followers: user.followers,
				repositories: user.repositories,
				contributions: user.contributions,
				stack: user.stack?.slice(0, 5) || [],
			})),
		},
	};

	// Use Vercel AI SDK generateObject to create a structured response
	const { object } = await generateObject({
		model: openai("gpt-4o-mini"),
		schema: SearchSummarySchema,
		system: `You are an AI assistant that creates high-quality search result summaries.
		Create concise, informative summaries that highlight key information.
		Be professional but conversational in tone.
		Focus on providing the most useful information about the developers found in the search..`,
		prompt: `Generate a structured summary of the search results for GitHub developers.
		The search was for: ${searchParams.role} developers${searchParams.city ? ` in ${searchParams.city}` : ""}${searchParams.country ? `, ${searchParams.country}` : ""}.
		
		Here is the detailed search information and results:
		${JSON.stringify(searchSummary, null, 2)}
		
		Create a well-formatted summary with these key components:
		- Information about the total number of developers found
		- Details about the top ${Math.min(5, topUsers.length)} developers with their key metrics
		- A comprehensive spoken digest that explains the search results in a clear, conversational manner
		- A markdown summary that includes a table of top developers
		
		Focus on making the spokenDigest detailed and informative, including information about common technologies and any notable metrics from the developers.
		If location is provided in the query, include the location in the summary.
		Keep the entire summary concise but informative.`,
	});

	return object;
}
