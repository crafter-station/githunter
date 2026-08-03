import { isRankingScope } from "@/rankings/data";
import { isLensId } from "@/rankings/lenses";
import { getLadderStandings } from "@/rankings/season-store";
import { NextResponse } from "next/server";

export async function GET(
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
	const search = new URL(request.url).searchParams;
	const lens = search.get("lens") ?? "balanced";
	const mode = search.get("mode") === "form" ? "form" : "all-time";
	if (!isLensId(lens)) {
		return NextResponse.json(
			{ error: "Ranking lens not found" },
			{ status: 404 },
		);
	}
	const ladder = await getLadderStandings({ scope, lensId: lens, mode });
	return NextResponse.json(ladder, {
		headers: {
			"Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
		},
	});
}
