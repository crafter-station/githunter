import { NextResponse } from "next/server";

export function POST() {
	return NextResponse.json(
		{
			error: "Advanced developer search has been deprecated",
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
