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
				techStack: z.array(
					z.object({
						tech: z.string(),
						relevance: z.number(),
					}),
				),
				country: z.string().nullable(),
				city: z.string().nullable(),
				minStars: z.number().nullable(),
				minRepos: z.number().nullable(),
			}),
			prompt: `Extract search parameters from the following query. Return:
1. Role Information:
   - Primary role and alternative role names
   - Focus on developer and engineering positions
   - Example: "frontend developer" → ["frontend developer", "frontend engineer", "ui developer"]
	 - Available roles: "ai engineer", "audio software developer", "backend developer", "blockchain developer",
  "clojure developer", "cloud engineer", "competitive programmer", "data engineer", "design engineer",
  "devops engineer", "emacs developer", "embedded systems developer", "embedded systems engineer",
  "engineering leader", "firmware engineer", "frontend developer", "frontend engineer", "full stack developer",
  "game developer", "machine learning engineer", "mobile developer", "qa engineer", "robotics developer",
  "salesforce developer", "security engineer", "site reliability engineer", "smalltalk developer",
  "software engineer", "tech education analyst", "ui developer", "web developer"
	 - Pick the most relevant role from the list
	 - In english

2. Technology Stack:
	 - Ensure you return just technologies, not roles
	 - Return an array of objects with the technology and its relevance to the role
	 - The relevance should be a number between 0 and 100
	 - If the query is generic, return an empty array or technologies with low relevance

	 Example: "nextjs frontend developer" → [{
		tech: "nextjs",
		relevance: 90
	 }, {
		tech: "react",
		relevance: 80
	 },{
		tech: "typescript",
		relevance: 70
	 },{
		tech: "javascript",
		relevance: 60
	 },{
		tech: "html",
		relevance: 50
	 }]

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
			techStack: results.object.techStack,
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
