import { getQueryParams } from "@/app/search/[slug]/get-query-params";
import { queryUsers } from "@/app/search/[slug]/query-users";
import { redis } from "@/redis";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import { nanoid } from "nanoid";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	try {
		const { slug } = await request.json();

		if (!slug) {
			return new Response("No search slug provided", { status: 400 });
		}

		const cachedSummary = await redis.get<string>(`search-summary:${slug}`);

		if (cachedSummary) {
			// Split into words for more natural streaming
			const chunks = cachedSummary.split(/\s+/).map((word) => {
				// Replace newlines with \n and escape them properly
				const escapedWord = word.replace(/\n/g, "\\n");
				return `0:"${escapedWord} "\n`;
			});

			// Add the initial message ID
			chunks.unshift(`f:{"messageId":"msg-${nanoid()}"}\n`);

			// Add the end markers
			chunks.push(
				'e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0},"isContinued":false}\n',
			);
			chunks.push(
				'd:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n',
			);

			const encoder = new TextEncoder();
			const simulated = new ReadableStream({
				async start(controller) {
					for (const chunk of chunks) {
						controller.enqueue(encoder.encode(chunk));
						// Wait 30ms between chunks (adjust as needed)
						await new Promise((resolve) => setTimeout(resolve, 30));
					}
					controller.close();
				},
			});

			return new Response(simulated, {
				headers: {
					"Content-Type": "text/plain; charset=utf-8",
				},
			});
		}

		// Get search parameters
		const searchParams = await getQueryParams(slug);

		// Query users based on search parameters
		const users = await queryUsers(slug, searchParams, 1);

		const result = streamText({
			model: openai("gpt-4o-mini"),
			system: `You are an AI assistant that creates high-quality search result summaries.
		Create concise, informative summaries that highlight key information.
		Be professional but conversational in tone.
		Focus on providing the most useful information about the developers found in the search..`,
			prompt: `Generate a structured summary of the search results for GitHub developers.
		The search was for: ${searchParams.role} developers${searchParams.city ? ` in ${searchParams.city}` : ""}${searchParams.country ? `, ${searchParams.country}` : ""}.
		
		Here is the detailed search information about the developers found:
		Total developers found: ${users.totalUsers}
		
		${users.paginatedUsers
			.map((user) => {
				return `
			# ${user.fullname} (${user.username})
			About: ${user.about}
			Tech Stack: ${user.stack}
			Contributions: ${user.contributions}
			Repositories: ${user.repositories}
			Followers: ${user.followers}
			Following: ${user.following}
			Stars: ${user.stars}


			`;
			})
			.join("\n")}

		Create a well-formatted summary with these key components:
		- Information about the total number of developers found
		- Details about the top ${Math.min(5, users.paginatedUsers.length)} developers with their key metrics
		- A comprehensive spoken digest that explains the search results in a clear, conversational manner
		
		Focus on making the spokenDigest detailed and informative, including information about common technologies and any notable metrics from the developers.
		If location is provided in the query, include the location in the summary.
		Keep the entire summary concise but informative.

		Make sure the summary is not too long.
		Must have the style of a tweet.
		
		The length of the summary should be between 300 and 500 characters.
		`,
			onFinish: async (completion) => {
				await redis.set(`search-summary:${slug}`, completion.text);
			},
		});

		return result.toDataStreamResponse();
	} catch (error) {
		console.error("Error generating search summary:", error);
		return new Response("Failed to generate search summary", { status: 500 });
	}
}
