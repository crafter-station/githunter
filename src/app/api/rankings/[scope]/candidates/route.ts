import { evaluateRankingCandidate } from "@/rankings/candidates";
import { isRankingScope } from "@/rankings/data";
import { NextResponse } from "next/server";

export async function POST(
	request: Request,
	{ params }: { params: Promise<{ scope: string }> },
) {
	const { scope } = await params;
	if (!isRankingScope(scope)) {
		return NextResponse.json(
			{ error: "Ranking scope not found" },
			{ status: 404 },
		);
	}
	const body = (await request.json().catch(() => null)) as {
		username?: unknown;
	} | null;
	if (typeof body?.username !== "string") {
		return NextResponse.json(
			{ error: "A GitHub username is required" },
			{ status: 400 },
		);
	}
	const evaluation = await evaluateRankingCandidate({
		scope,
		value: body.username,
	});
	return NextResponse.json(evaluation, {
		status: evaluation.status === "ineligible" ? 422 : 200,
		headers: { "Cache-Control": "private, no-store" },
	});
}
