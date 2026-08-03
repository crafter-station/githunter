import { isRankingScope, rankingScopes } from "@/rankings/scopes";
import { notFound, permanentRedirect } from "next/navigation";

export const revalidate = 3600;

export function generateStaticParams() {
	return Object.keys(rankingScopes).map((scope) => ({ scope }));
}

export default async function ScopeRankingPage({
	params,
}: {
	params: Promise<{ scope: string }>;
}) {
	const { scope } = await params;
	if (!isRankingScope(scope)) notFound();
	permanentRedirect(`/${scope}`);
}
