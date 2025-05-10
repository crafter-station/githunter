import { generateObject } from "ai";

import { redis } from "@/redis";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { SearchParams } from "./types";

export async function getQueryParams(slug: string) {
	let searchParams = await redis.hgetall<SearchParams>(`search:${slug}`);

	if (
		!searchParams ||
		(searchParams && Object.keys(searchParams).length === 0)
	) {
		const results = await generateObject({
			model: openai("gpt-4o-mini"),
			schema: z.object({
				role: z.string(),
				alternativeNamesForRole: z.array(z.string()),
				primaryTechStack: z.array(z.string()),
				secondaryTechStack: z.array(z.string()),
				country: z.string().nullable(),
				city: z.string().nullable(),
				minStars: z.number().nullable(),
				minRepos: z.number().nullable(),
			}),
			prompt: `Extract search parameters from the following query. Return:
1. Role Information:
   - Primary role and alternative role names
   - Focus on developer and engineering positions
   - Example: "frontend developer" → ["frontend developer", "frontend engineer", "UI developer"]
	 - In english

2. Technology Stack:
   - Primary and secondary technologies
   - Include related technologies (e.g., "nextjs" → ["nextjs", "react", "typescript"])
   - All tech names in English

3. Location (if specified):
   - Country and city names in English
   - Return null if not mentioned

4. Repository Metrics (if specified):
   - minStars: minimum GitHub stars (e.g., "100+ stars" → 100)
   - minRepos: minimum repositories (e.g., "50+ repos" → 50)

Query: ${slug}`,
		});

		searchParams = {
			role: results.object.role.toLowerCase(),
			alternativeNamesForRole: results.object.alternativeNamesForRole.map(
				(role) => role.toLowerCase(),
			),
			primaryTechStack: results.object.primaryTechStack.map((tech) =>
				tech.toLowerCase(),
			),
			secondaryTechStack: results.object.secondaryTechStack.map((tech) =>
				tech.toLowerCase(),
			),
			country:
				!results.object.country || results.object.country === "null"
					? null
					: results.object.country.toLowerCase(),
			city:
				!results.object.city || results.object.city === "null"
					? null
					: results.object.city.toLowerCase(),
			minStars: results.object.minStars ? results.object.minStars : null,
			minRepos: results.object.minRepos ? results.object.minRepos : null,
		};
		await redis.hset(`search:${slug}`, searchParams);
	}

	return searchParams;
}
