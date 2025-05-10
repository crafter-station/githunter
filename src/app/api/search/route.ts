import type { UserSearchMetadata } from "@/types";
import { Index, type QueryResult } from "@upstash/vector";
import { type NextRequest, NextResponse } from "next/server";

// Define a type for query suggestions that satisfies Dict constraint
type QuerySuggestion = {
	queryText?: string;
};

// Add a more generic type for combined results
type SearchResult =
	| QueryResult<UserSearchMetadata>
	| QueryResult<QuerySuggestion>;

// Mock data for development when Upstash is not configured
const MOCK_USERS: UserSearchMetadata[] = [
	{
		username: "reactdev",
		fullname: "React Developer",
		avatarUrl: "https://avatars.githubusercontent.com/u/1231234",
		field: "username",
		country: "USA",
	},
	{
		username: "next_master",
		fullname: "Next.js Expert",
		avatarUrl: "https://avatars.githubusercontent.com/u/7654321",
		field: "username",
		country: "Germany",
	},
	{
		username: "typescript_guru",
		fullname: "TypeScript Guru",
		avatarUrl: "https://avatars.githubusercontent.com/u/9876543",
		field: "fullname",
		country: "Canada",
	},
];

// Initialize Upstash Vector index
const getVectorIndex = () => {
	if (
		!process.env.UPSTASH_VECTOR_REST_URL ||
		!process.env.UPSTASH_VECTOR_REST_TOKEN
	) {
		// In development, we'll just return undefined and use mock data
		console.warn(
			"Upstash Vector not configured. Using mock data for development.",
		);
		return undefined;
	}

	return new Index({
		url: process.env.UPSTASH_VECTOR_REST_URL,
		token: process.env.UPSTASH_VECTOR_REST_TOKEN,
	});
};

// Helper to create mock results based on a search query
const createMockResults = (
	query: string,
	limit: number,
): QueryResult<UserSearchMetadata>[] => {
	// Simple filtering to simulate search
	const filtered = MOCK_USERS.filter(
		(user) =>
			user.username.toLowerCase().includes(query.toLowerCase()) ||
			user.fullname.toLowerCase().includes(query.toLowerCase()),
	).slice(0, limit);

	// Create mock results in the structure expected from Upstash
	return filtered.map((user, index) => ({
		id: `mock-${user.username}-${index}`,
		score: 0.9 - index * 0.1, // Simulate decreasing relevance scores
		metadata: user,
		vector: [], // Empty vector since we don't need it for display
	}));
};

/**
 * Search for users by query
 * @param query The search query
 * @param limit Maximum number of results to return
 * @returns Array of user search results with metadata
 */
async function searchUsers(query: string, limit = 10): Promise<SearchResult[]> {
	const index = getVectorIndex();

	// If no index (no env vars), return mock results
	if (!index) {
		// Simulate network delay for a more realistic experience
		await new Promise((resolve) => setTimeout(resolve, 300));
		return createMockResults(query, limit);
	}

	try {
		// Get half the limit for each query to balance results
		const perQueryLimit = Math.ceil(limit / 2);

		// Query 1: Search for GitHub users (with metadata.field filter)
		const userResults = await index.query<UserSearchMetadata>({
			topK: perQueryLimit,
			data: query,
			filter: "HAS FIELD username",
			includeMetadata: true,
		});

		// Query 2: Search for query suggestions (without metadata or with query prefix in ID)
		const queryResults = await index.query<QuerySuggestion>({
			topK: perQueryLimit,
			data: query,
			includeMetadata: true,
		});

		// Combine results, taking up to perQueryLimit from each
		const users = userResults.slice(0, perQueryLimit);
		const queries = queryResults.slice(0, perQueryLimit);

		// Combine and return results
		const combinedResults: SearchResult[] = [...users, ...queries];

		console.log({
			totalResults: combinedResults.length,
			userResults: users.length,
			queryResults: queries.length,
		});

		return combinedResults;
	} catch (error) {
		console.error("Error querying vector database:", error);
		// Fallback to mock data in case of errors
		return createMockResults(query, limit);
	}
}

export async function GET(request: NextRequest) {
	try {
		// Get search params from the URL
		const searchParams = request.nextUrl.searchParams;
		const query = searchParams.get("query") || "";
		const limitParam = searchParams.get("limit");
		const limit = limitParam ? Number.parseInt(limitParam, 10) : 8; // Default to 8 results total

		// Validate query
		if (!query || query.length < 2) {
			return NextResponse.json({ results: [] }, { status: 200 });
		}

		// Perform search directly in the API route
		const results = await searchUsers(query, limit);

		// Return results
		return NextResponse.json({ results }, { status: 200 });
	} catch (error) {
		console.error("Error in search API:", error);
		return NextResponse.json(
			{ error: "Failed to search users" },
			{ status: 500 },
		);
	}
}
