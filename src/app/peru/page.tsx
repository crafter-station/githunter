import {
	CountryRankingRoute,
	getCountryRankingMetadata,
} from "@/components/rankings/country-ranking-route";

export const revalidate = 3600;

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	return getCountryRankingMetadata("peru", searchParams);
}

export default async function PeruPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	return <CountryRankingRoute scope="peru" searchParams={searchParams} />;
}
