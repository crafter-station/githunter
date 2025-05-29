import { getQueryParams } from "@/app/search/[slug]/get-query-params";
import { queryUsers } from "@/app/search/[slug]/query-users";
import { nanoid } from "@/lib/nanoid";
import { redis } from "@/redis";
import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
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
			// Split into characters for more natural streaming, properly handling emojis
			const chunks = Array.from(cachedSummary).map((char) => {
				// Replace newlines with \n and escape them properly
				const escapedChar = char.replace(/\n/g, "\\n");
				return `0:"${escapedChar}"\n`;
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
						// Wait 10ms between chunks (adjust as needed)
						await new Promise((resolve) => setTimeout(resolve, 10));
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
			system: `You are an AI assistant that creates engaging audio-friendly search result summaries.
Create summaries optimized for text-to-speech conversion with Eleven Labs.
Use natural pacing with appropriate pauses (use commas, periods, and paragraph breaks strategically).
Avoid complex punctuation, abbreviations, or symbols that may cause issues in speech synthesis.
Maintain a conversational, engaging tone with varied sentence structure for better listening experience.`,
			prompt: `Generate a speech-optimized summary of GitHub developer search results.
The search was for: ${searchParams.role} developers${searchParams.city ? ` in ${searchParams.city}` : ""}${searchParams.country ? `, ${searchParams.country}` : ""}.

Here is the information about the developers found:
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

Create a flowing, natural-sounding audio digest with:
1. A brief introduction about the search results (mention total developers found and search criteria including location if provided)
2. Highlights of the top ${Math.min(3, users.paginatedUsers.length)} developers, focusing on their most impressive metrics and skills
3. A concise conclusion that summarizes common technologies or notable patterns

Additional guidelines for speech optimization:
- Write in a conversational style as if speaking directly to the listener
- Use natural transitions between sections ("Next, let's look at...", "Another impressive developer is...")
- Avoid long lists of numbers or technical terms without context
- Keep sentences medium length for better TTS flow
- Include brief pauses where appropriate (using commas and periods)
- Total length should be 60-90 seconds when read aloud (approximately 150-225 words)

The summary should sound natural when read aloud by a text-to-speech system.`,
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
