import { isLensId } from "@/rankings/lenses";
import { serializeRankingFilters } from "@/rankings/query-state";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: { absolute: "Peru GitHub Form Ranking | GitHunter" },
	description:
		"Track the strongest four-quarter form among public GitHub developers in Peru.",
	alternates: { canonical: "/peru?view=form" },
};

export default async function PeruFormPage({
	searchParams,
}: {
	searchParams: Promise<{ lens?: string }>;
}) {
	const { lens } = await searchParams;
	redirect(
		serializeRankingFilters("/peru", {
			view: "form",
			lens: lens && isLensId(lens) ? lens : "balanced",
		}),
	);
}
