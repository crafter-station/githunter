import { NextResponse } from "next/server";

export function GET() {
	return NextResponse.json(
		{
			error: "Developer search has been deprecated",
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
