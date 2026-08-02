import { CareerRankingPage } from "@/components/rankings/career-ranking-page";
import { isLensId } from "@/rankings/lenses";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Peru GitHub Form Ranking | GitHunter",
	description:
		"Track the strongest four-quarter form among public GitHub developers in Peru.",
	alternates: { canonical: "/peru/form" },
};

export default async function PeruFormPage({
	searchParams,
}: {
	searchParams: Promise<{ lens?: string }>;
}) {
	const { lens } = await searchParams;
	return (
		<CareerRankingPage
			scope="peru"
			lensId={lens && isLensId(lens) ? lens : "balanced"}
			mode="form"
		/>
	);
}
