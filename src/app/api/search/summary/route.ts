import { NextResponse } from "next/server";

export function POST() {
	return NextResponse.json(
		{
			error: "Search summaries have been deprecated",
			replacement: "/api/rankings/peru/balanced",
		},
		{
			status: 410,
			headers: {
				Deprecation: "true",
				Link: '</api/rankings/peru/balanced>; rel="successor-version"',
			},
		},
	);
}
