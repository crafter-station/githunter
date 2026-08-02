import { redirect } from "next/navigation";

export default async function ScopeRankingPage({
	params,
}: {
	params: Promise<{ scope: string }>;
}) {
	const { scope } = await params;
	redirect(`/rankings/${scope}/balanced`);
}
