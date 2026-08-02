import { RankingReportPage } from "@/components/rankings/ranking-report-page";
import { getRankingSeo } from "@/rankings/seo";
import type { Metadata } from "next";

export const revalidate = 3600;
export const dynamic = "force-static";

const seo = getRankingSeo("balanced");

export const metadata: Metadata = {
	title: { absolute: seo.title },
	description: seo.description,
	alternates: { canonical: "/peru" },
	openGraph: {
		title: seo.title,
		description: seo.description,
		url: "/peru",
		type: "website",
	},
	twitter: {
		card: "summary",
		title: seo.title,
		description: seo.description,
	},
};

export default function PeruPage() {
	return <RankingReportPage scope="peru" lens="balanced" />;
}
