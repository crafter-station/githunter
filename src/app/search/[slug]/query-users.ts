import { db } from "@/db";
import { type UserSelect, user } from "@/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateObject, streamText } from "ai";
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
	if (
		searchParams.primaryTechStack &&
		searchParams.primaryTechStack.length > 0
	) {
		query.append(sql` AND ${user.stack} && ARRAY[`);
		const techArray = searchParams.primaryTechStack.map((tech) => sql`${tech}`);
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
			const amountOfPrimaryTechStackThatMatch = repo.techStack.filter((tech) =>
				searchParams.primaryTechStack.includes(tech),
			).length;

			if (amountOfPrimaryTechStackThatMatch > 0) {
				score +=
					Math.log(repo.stars + 1) *
					(repo.contribution.commitsCount +
						repo.contribution.issuesCount * 0.5 +
						repo.contribution.pullRequestsCount * 2) *
					amountOfPrimaryTechStackThatMatch;
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
	headline: z.string(),
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
			topSkills: z.array(z.string()),
			highlightMetric: z.object({
				type: z.enum(["stars", "followers", "repositories", "contributions"]),
				value: z.number(),
				description: z.string(),
			}),
		}),
	),
	insights: z.object({
		commonTechnologies: z.array(z.string()),
		mostImpressiveMetric: z.object({
			type: z.enum(["stars", "followers", "repositories", "contributions"]),
			username: z.string(),
			value: z.number(),
			description: z.string(),
		}),
		suggestion: z.string(),
	}),
	markdownSummary: z.string(),
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
			techStack: searchParams.primaryTechStack,
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
		Identify the most impressive metrics and skills among the developers.
		For the markdownSummary field, create proper markdown formatting including headings, tables, and bullet points.`,
		prompt: `Generate a structured summary of the search results for GitHub developers.
		The search was for: ${searchParams.role} developers${searchParams.city ? ` in ${searchParams.city}` : ""}${searchParams.country ? `, ${searchParams.country}` : ""}.
		
		Here is the detailed search information and results:
		${JSON.stringify(searchSummary, null, 2)}
		
		Create a well-formatted summary with these key components:
		- A concise headline describing the search
		- Information about the total number of developers found
		- Details about the top ${Math.min(5, topUsers.length)} developers with their key metrics
		- Insights about common technologies and impressive metrics
		- A suggestion for how the user might refine their search or what to look for
		- A markdown summary that includes a table of top developers
		
		If location is provided in the query, omit the location from the developer table in the markdown summary.
		For each developer, identify one metric that's particularly impressive as their "highlightMetric".
		For the "insights" section, identify common technologies across top developers and the most impressive metric from any developer.`,
	});

	return object;
}

/**
 * Generate a markdown summary of the search results (original version, kept for compatibility)
 */
export async function generateMarkdownSummary(
	users: UserSelect[],
	searchParams: SearchParams,
) {
	// Extract top 5 users for the summary
	const topUsers = users.slice(0, 5);

	// Create a compact representation of the search parameters and results
	const searchSummary = {
		query: {
			role: searchParams.role,
			alternativeRoles: searchParams.alternativeNamesForRole,
			techStack: searchParams.primaryTechStack,
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

	// Use Vercel AI SDK streamText to generate a summary
	const { textStream } = await streamText({
		model: openai("gpt-4o-mini"),
		system: `You are an AI assistant that creates high-quality search result summaries in markdown format.
		Create concise, informative summaries that highlight key information.
		Use proper markdown formatting including headings, tables, and bullet points.
		Be professional but conversational in tone.
		DO NOT include any introductory phrases like "Here's a summary" or "Based on your search".
		START DIRECTLY with the markdown content.`,
		prompt: `Generate a markdown summary of the search results for GitHub developers.
		The search was for: ${searchParams.role} developers${searchParams.city ? ` in ${searchParams.city}` : ""}${searchParams.country ? `, ${searchParams.country}` : ""}.
		
		Here is the detailed search information and results:
		${JSON.stringify(searchSummary, null, 2)}
		
		Create a well-formatted markdown summary that includes:
		1. A brief headline that clearly describes what was searched for
		2. The total number of developers found matching the criteria
		3. A table of the top 5 developers with their key stats, if location is provided in the query, then omit the location from the table
		4. A conclusion highlighting common skills/technologies among the top developers
		
		Make sure the table is properly formatted markdown and includes columns for username, location, stars, followers, and repositories.
		Keep the entire summary concise but informative.`,
	});

	return textStream;
}
