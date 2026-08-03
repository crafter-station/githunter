import { isLensId } from "@/rankings/lenses";
import { serializeRankingFilters } from "@/rankings/query-state";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: { absolute: "Peru GitHub All-Time Ranking | GitHunter" },
	description:
		"Explore career points, championships, podiums, and the historical GitHub ladder for Peru.",
	alternates: { canonical: "/peru?view=all-time" },
};

export default async function PeruOverallPage({
	searchParams,
}: {
	searchParams: Promise<{ lens?: string }>;
}) {
	const { lens } = await searchParams;
	redirect(
		serializeRankingFilters("/peru", {
			view: "all-time",
			lens: lens && isLensId(lens) ? lens : "balanced",
		}),
	);
}
