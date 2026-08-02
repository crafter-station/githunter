import { CareerRankingPage } from "@/components/rankings/career-ranking-page";
import { isLensId } from "@/rankings/lenses";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Peru GitHub All-Time Ranking | GitHunter",
	description:
		"Explore career points, championships, podiums, and the historical GitHub ladder for Peru.",
	alternates: { canonical: "/peru/overall" },
};

export default async function PeruOverallPage({
	searchParams,
}: {
	searchParams: Promise<{ lens?: string }>;
}) {
	const { lens } = await searchParams;
	return (
		<CareerRankingPage
			scope="peru"
			lensId={lens && isLensId(lens) ? lens : "balanced"}
			mode="all-time"
		/>
	);
}
