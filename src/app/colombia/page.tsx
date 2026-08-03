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
	return getCountryRankingMetadata("colombia", searchParams);
}

export default async function ColombiaPage({
	searchParams,
}: {
	searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
	return <CountryRankingRoute scope="colombia" searchParams={searchParams} />;
}
