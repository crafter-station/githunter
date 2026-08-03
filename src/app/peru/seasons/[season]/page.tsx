import { isLensId } from "@/rankings/lenses";
import { serializeRankingFilters } from "@/rankings/query-state";
import { isSeasonId } from "@/rankings/seasons";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

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
		title: { absolute: `${normalized} Peru GitHub Season | GitHunter` },
		description: `Explore the complete ${normalized} GitHub season standings for Peru.`,
		alternates: {
			canonical: serializeRankingFilters("/peru", {
				view: "season",
				season: normalized,
			}),
		},
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
	redirect(
		serializeRankingFilters("/peru", {
			view: "season",
			season: seasonId,
			lens: lens && isLensId(lens) ? lens : "balanced",
		}),
	);
}
