import { permanentRedirect } from "next/navigation";

export const revalidate = 3600;

export default async function ScopeRankingPage({
	params,
}: {
	params: Promise<{ scope: string }>;
}) {
	const { scope } = await params;
	permanentRedirect(`/${scope}/overall`);
}
