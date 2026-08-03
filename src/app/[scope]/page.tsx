import {
	CountryRankingRoute,
	getCountryRankingMetadata,
} from "@/components/rankings/country-ranking-route";
import { isRankingScope, rankingScopes } from "@/rankings/scopes";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type CountryPageProps = {
	params: Promise<{ scope: string }>;
	searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
	return Object.keys(rankingScopes).map((scope) => ({ scope }));
}

export async function generateMetadata({
	params,
	searchParams,
}: CountryPageProps): Promise<Metadata> {
	const { scope } = await params;
	if (!isRankingScope(scope)) notFound();
	return getCountryRankingMetadata(scope, searchParams);
}

export default async function CountryPage({
	params,
	searchParams,
}: CountryPageProps) {
	const { scope } = await params;
	if (!isRankingScope(scope)) notFound();
	return <CountryRankingRoute scope={scope} searchParams={searchParams} />;
}
