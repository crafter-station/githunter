function retired() {
	return Response.json(
		{
			error: "The GitHunter CV workflow has moved out of this product.",
			replacement: "/peru",
		},
		{ status: 410 },
	);
}

export const GET = retired;
export const POST = retired;
