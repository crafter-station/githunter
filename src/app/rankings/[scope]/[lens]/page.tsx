import { isRankingScope } from "@/rankings/data";
import { isLensId, rankingLenses } from "@/rankings/lenses";
import { getRankingCanonical, getRankingSeo } from "@/rankings/seo";
import { getAvailableScopes } from "@/rankings/store";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export const revalidate = 3600;
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
	return getAvailableScopes().flatMap((scope) =>
		Object.keys(rankingLenses).map((lens) => ({ scope, lens })),
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}): Promise<Metadata> {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) return {};
	const seo = getRankingSeo(lens);
	return {
		title: { absolute: seo.title },
		description: seo.description,
		alternates: { canonical: getRankingCanonical(scope, lens) },
		openGraph: {
			title: seo.title,
			description: seo.description,
			url: getRankingCanonical(scope, lens),
			type: "website",
		},
		twitter: {
			card: "summary",
			title: seo.title,
			description: seo.description,
		},
	};
}

export default async function RankingPage({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}) {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) notFound();
	redirect(getRankingCanonical(scope, lens));
}
