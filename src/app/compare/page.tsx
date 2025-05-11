import CompareMetricsPlayground from "@/components/compare-metrics-playground";
import { Footer } from "@/components/footer/Footer";
import { Header } from "@/components/header";
import type { Metadata } from "next";
import { Suspense } from "react";

interface ComparePageProps {
	searchParams: Promise<{ users?: string }>;
}

export async function generateMetadata({
	searchParams,
}: ComparePageProps): Promise<Metadata> {
	const { users } = await searchParams;

	// Generar un título basado en los usuarios (si hay alguno)
	let title = "Compare Developers | GitHunter";
	let description =
		"Compare GitHub metrics between different developers and see how they stack up.";
	let ogImageUrl = "/api/og/compare";

	if (users && users.length > 0) {
		const usernames = users.split(",").filter(Boolean);

		if (usernames.length > 0) {
			// Construir un título más descriptivo con los nombres de usuario
			if (usernames.length === 1) {
				title = `${usernames[0]} | Developer Metrics | GitHunter`;
			} else if (usernames.length === 2) {
				title = `${usernames[0]} vs ${usernames[1]} | Developer Comparison | GitHunter`;
			} else {
				const firstTwoUsers = usernames.slice(0, 2).join(", ");
				title = `${firstTwoUsers} & ${usernames.length - 2} more | Developer Comparison | GitHunter`;
			}

			description = `Compare GitHub metrics between ${usernames.length} developers: ${usernames.slice(0, 3).join(", ")}${usernames.length > 3 ? "..." : ""}`;
			ogImageUrl = `/api/og/compare?users=${usernames.join(",")}`;
		}
	}

	return {
		title,
		description,
		openGraph: {
			title,
			description,
			images: [ogImageUrl],
			url: `/compare${users ? `?users=${users}` : ""}`,
			siteName: "GitHunter",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title,
			description,
			images: [ogImageUrl],
		},
	};
}

export default async function ComparePage({ searchParams }: ComparePageProps) {
	const { users } = await searchParams;

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />
			<main className="flex-1">
				<div className="mx-auto w-full px-4 py-8 lg:px-10">
					<div className="mx-auto w-full">
						<h1 className="mb-2 font-bold text-3xl">
							Developer Metrics Comparison
						</h1>
						<p className="mb-8 text-muted-foreground">
							Compare GitHub metrics between different developers and see how
							they stack up.
						</p>

						<Suspense
							fallback={
								<div className="py-12 text-center">
									Loading comparison tool...
								</div>
							}
						>
							<CompareMetricsPlayground users={users} />
						</Suspense>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
