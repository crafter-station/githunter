import { getSubscription } from "@/lib/get-suscription";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import type { NextRequest } from "next/server";
import { z } from "zod";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	try {
		// Check if user has PRO access
		const currentPlan = await getSubscription();

		if (!currentPlan || currentPlan.name === "Free") {
			return Response.json(
				{ error: "PRO subscription or higher required to use this feature" },
				{ status: 403 },
			);
		}

		const { jobDescription } = await request.json();

		if (!jobDescription) {
			return Response.json(
				{ error: "No job description provided" },
				{ status: 400 },
			);
		}

		const result = await generateObject({
			model: openai("gpt-4o-mini"),
			schema: z.object({
				technologies: z
					.array(
						z.object({
							name: z.string().describe("The technology name"),
							importance: z
								.number()
								.min(0)
								.max(100)
								.describe("Importance score from 0-100"),
						}),
					)
					.describe(
						"List of technologies mentioned in the job description with their importance scores",
					),
				city: z
					.string()
					.nullable()
					.describe("The city mentioned in the job description, if any"),
				country: z
					.string()
					.nullable()
					.describe("The country mentioned in the job description, if any"),
			}),
			prompt: `Extract technologies and their importance from the following job description. 
For each technology, rate the importance from a scale of 0-100 where:
- 100: Absolutely required, mentioned as "required" or "must have"
- 75: Very important, mentioned multiple times or emphasized 
- 50: Important but not crucial, mentioned casually
- 25: Mentioned as "nice to have" or "plus"
- 0: Not mentioned but related to other technologies

Also extract any city and country mentioned in the context of work location.

Job Description:
${jobDescription}

Return a structured JSON with technologies and their importance ratings.`,
		});

		return Response.json(result);
	} catch (error) {
		console.error("Error extracting tech stack:", error);
		return Response.json(
			{ error: "Failed to extract tech stack" },
			{ status: 500 },
		);
	}
}
