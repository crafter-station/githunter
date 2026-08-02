import { isRankingScope } from "@/rankings/data";
import { isLensId } from "@/rankings/lenses";
import { getSeasonLeaderboard } from "@/rankings/season-store";
import { isSeasonId } from "@/rankings/seasons";
import { NextResponse } from "next/server";

export async function GET(
	request: Request,
	{ params }: { params: Promise<{ scope: string; season: string }> },
) {
	const { scope, season } = await params;
	const seasonId = season.toUpperCase();
	const lens = new URL(request.url).searchParams.get("lens") ?? "balanced";
	if (!isRankingScope(scope) || !isSeasonId(seasonId) || !isLensId(lens)) {
		return NextResponse.json({ error: "Season not found" }, { status: 404 });
	}
	const leaderboard = await getSeasonLeaderboard({
		scope,
		seasonId,
		lensId: lens,
	});
	if (!leaderboard) {
		return NextResponse.json({ error: "Season not found" }, { status: 404 });
	}
	return NextResponse.json(leaderboard, {
		headers: {
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
