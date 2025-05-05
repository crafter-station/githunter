import { RunProgress } from "@/components/RunProgress";
import { TriggerProvider } from "@/components/TriggerProvider";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header-2";

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
			<div className="flex min-h-screen flex-col">
				<Header />
				<main className="flex flex-1 flex-col items-center justify-center py-12">
					<div className="w-full max-w-md px-4">
						<div className="mb-8 text-center">
							<h1 className="font-semibold text-2xl tracking-tight">Error</h1>
							<p className="mt-2 text-muted-foreground text-sm">
								Unable to track profile generation. Missing run ID or access
								token.
							</p>
						</div>
					</div>
				</main>
				<Footer />
			</div>
		);
	}

	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			<main className="flex flex-1 flex-col items-center justify-center py-8">
				<TriggerProvider accessToken={token}>
					<RunProgress runId={runId} username={username} />
				</TriggerProvider>
			</main>
			<Footer />
		</div>
	);
}
