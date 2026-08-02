import { isRankingScope } from "@/rankings/data";
import { isLensId } from "@/rankings/lenses";
import { getRankingSnapshot } from "@/rankings/store";
import { NextResponse } from "next/server";

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ scope: string; lens: string }> },
) {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) {
		return NextResponse.json(
			{ error: "Ranking scope or lens not found" },
			{ status: 404 },
		);
	}
	const snapshot = await getRankingSnapshot(scope, lens);
	return NextResponse.json(snapshot, {
		headers: {
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
