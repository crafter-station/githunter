import { db } from "@/db";
import { type UserSelect, user } from "@/db/schema";
import { redis } from "@/redis";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { sql } from "drizzle-orm";
import { PgDialect } from "drizzle-orm/pg-core";
import { z } from "zod";

type SearchParams = {
	roles: string[];
	techStack: string[];
	country: string | null;
	city: string | null;
	minStars: number | null;
	minRepos: number | null;
};
const pgDialect = new PgDialect();

export default async function SearchPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	let searchParams = await redis.hgetall<SearchParams>(`search:${slug}`);

	if (!searchParams || Object.keys(searchParams).length === 0) {
		const results = await generateObject({
			model: openai("gpt-4o-mini"),
			schema: z.object({
				roles: z.array(z.string()),
				techStack: z.array(z.string()),
				country: z.string().nullable(),
				city: z.string().nullable(),
				minStars: z.number().nullable(),
				minRepos: z.number().nullable(),
			}),
			prompt: `You are a search engine. You need to return parameters for a search query. 
     Provide multiple roles that might be relevant to the query. Consider developer and engineering roles.
     If given "frontend developer" return "frontend enginner" and "frontend developer" and other roles that might be relevant.
     Return a list of relevant tech stack that might be relevant to the query. 
     Always return the roles in english. Also the tech stack should be in english. And the country and city should be in english too.
     If asked for nextjs, return "nextjs" and "react" and "typescript" and other tech stack that might be relevant.
     
     If the query mentions a minimum number of stars, repositories, or other numeric criteria, extract and provide these values.
     Examples:
     - "developers with at least 100 stars" should return minStars: 100
     - "engineers with more than 50 repos" should return minRepos: 50
     - "devs with 200+ stars and 20+ repositories" should return minStars: 200 and minRepos: 20
     
     The query is: ${slug}`,
		});

		searchParams = {
			roles: results.object.roles.map((role) => role.toLowerCase().trim()),
			techStack: results.object.techStack.map((tech) =>
				tech.toLowerCase().trim(),
			),
			country:
				!results.object.country || results.object.country === "null"
					? null
					: results.object.country,
			city:
				!results.object.city || results.object.city === "null"
					? null
					: results.object.city,
			minStars: results.object.minStars ? results.object.minStars : null,
			minRepos: results.object.minRepos ? results.object.minRepos : null,
		};
		await redis.hset(`search:${slug}`, searchParams);
	}

	if (Object.keys(searchParams).length === 0) {
		return (
			<div>
				<h1>SearchPage {slug}</h1>
				<pre>{JSON.stringify(searchParams, null, 2)}</pre>
				<h2>Error searching users</h2>
				<p>Sorry, we couldn't find users matching your search criteria.</p>
			</div>
		);
	}

	try {
		// Build debug info
		const debugInfo = {
			searchParams,
			generatedSQL: "",
			userCount: 0,
		};

		// Start with an empty SQL query
		const query = sql.empty();

		// Base query
		query.append(sql`
			SELECT * FROM ${user}
			WHERE 1=1
		`);

		// Use array overlap operator && instead of contains @>
		// This will match if ANY of the search terms match instead of requiring ALL to match
		if (searchParams.roles && searchParams.roles.length > 0) {
			query.append(sql` AND ${user.potentialRoles} && ARRAY[`);
			const rolesArray = searchParams.roles.map((role) => sql`${role}`);
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
			const techArray = searchParams.techStack.map((tech) => sql`${tech}`);
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

		// Get SQL for debugging
		const sqlString = pgDialect.sqlToQuery(query);
		debugInfo.generatedSQL = sqlString.sql;

		// Execute the query
		const usersFirstFilter = await db.execute(query);

		function calculateScore(user: UserSelect & { potential_roles: string[] }) {
			const amountOfRolesThatMatch = user.potential_roles.filter((role) =>
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				searchParams!.roles.includes(role),
			).length;
			const amountOfTechStackThatMatch = user.stack.filter((tech) =>
				// biome-ignore lint/style/noNonNullAssertion: <explanation>
				searchParams!.techStack.includes(tech),
			).length;
			return (
				amountOfRolesThatMatch * 10 +
				amountOfTechStackThatMatch * 5 +
				user.contributions +
				user.followers * 5 +
				user.following * 2 +
				user.stars * 10 +
				user.repositories * 5
			);
		}

		const usersSorted = usersFirstFilter.rows
			.map((u) => ({
				...(u as UserSelect & { potential_roles: string[] }),
				score: calculateScore(u as UserSelect & { potential_roles: string[] }),
			}))
			.sort((a, b) => b.score - a.score);

		return (
			<div>
				<h1>SearchPage {slug}</h1>
				<pre>{JSON.stringify(searchParams, null, 2)}</pre>

				<h2>Users ({usersSorted.length})</h2>
				<pre>
					{JSON.stringify(
						usersSorted.map((u) => ({
							username: u.username,
							score: u.score,
							stars: u.stars,
							followers: u.followers,
							contributions: u.contributions,
							repositories: u.repositories,
						})),
						null,
						2,
					)}
				</pre>
			</div>
		);
	} catch (error) {
		console.error("Search error:", error);
		return (
			<div>
				<h1>SearchPage {slug}</h1>
				<pre>{JSON.stringify(searchParams, null, 2)}</pre>
				<h2>Error searching users</h2>
				<p>Sorry, we couldn't find users matching your search criteria.</p>
				<pre>{String(error)}</pre>
			</div>
		);
	}
}
