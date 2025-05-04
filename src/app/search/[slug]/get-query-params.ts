import { generateObject } from "ai";

import { redis } from "@/redis";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import type { SearchParams } from "./types";

export async function getQueryParams(slug: string) {
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

	return searchParams;
}
