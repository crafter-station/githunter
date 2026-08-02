import { SeasonRankingPage } from "@/components/rankings/season-ranking-page";
import { isLensId } from "@/rankings/lenses";
import { isSeasonId } from "@/rankings/seasons";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateMetadata({
	params,
}: {
	params: Promise<{ season: string }>;
}): Promise<Metadata> {
	const { season } = await params;
	const normalized = season.toUpperCase();
	if (!isSeasonId(normalized)) return {};
	return {
		title: `${normalized} Peru GitHub Season | GitHunter`,
		description: `Explore the complete ${normalized} GitHub Ladder standings for Peru.`,
		alternates: { canonical: `/peru/seasons/${season.toLowerCase()}` },
	};
}

export default async function PeruSeasonPage({
	params,
	searchParams,
}: {
	params: Promise<{ season: string }>;
	searchParams: Promise<{ lens?: string }>;
}) {
	const [{ season }, { lens }] = await Promise.all([params, searchParams]);
	const seasonId = season.toUpperCase();
	if (!isSeasonId(seasonId)) notFound();
	return (
		<SeasonRankingPage
			scope="peru"
			seasonId={seasonId}
			lensId={lens && isLensId(lens) ? lens : "balanced"}
		/>
	);
}
