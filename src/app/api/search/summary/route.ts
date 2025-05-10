import { getQueryParams } from "@/app/search/[slug]/get-query-params";
import {
	generateSearchSummary,
	queryUsers,
} from "@/app/search/[slug]/query-users";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function POST(request: NextRequest) {
	try {
		const { slug } = await request.json();

		if (!slug) {
			return new Response("No search slug provided", { status: 400 });
		}

		// Get search parameters
		const searchParams = await getQueryParams(slug);

		// Query users based on search parameters
		const users = await queryUsers({ searchParams, slug });

		// Generate search summary as structured data
		const summaryData = await generateSearchSummary(users, searchParams);

		// Return the structured data as JSON
		return Response.json(summaryData);
	} catch (error) {
		console.error("Error generating search summary:", error);
		return new Response("Failed to generate search summary", { status: 500 });
	}
}
