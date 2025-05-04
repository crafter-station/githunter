import { RunProgress } from "@/components/RunProgress";
import { TriggerProvider } from "@/components/TriggerProvider";

export default async function UserProfilePage({
	params,
	searchParams,
}: {
	params: Promise<{ username: string }>;
	searchParams: Promise<{ runId: string; token: string }>;
}) {
	const { username } = await params;
	const { runId, token } = await searchParams;

	if (!runId || !token) {
		return (
			<div className="container mx-auto max-w-2xl px-4 py-16">
				<h1 className="mb-6 font-bold text-3xl">Missing Run Information</h1>
				<p className="text-muted-foreground">
					Unable to track profile generation. Missing run ID or access token.
				</p>
			</div>
		);
	}

	return (
		<TriggerProvider accessToken={token}>
			<RunProgress runId={runId} username={username} />
		</TriggerProvider>
	);
}
