import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Archive, ArrowRight, Github, Trophy } from "lucide-react";
import Link from "next/link";

export const metadata = {
	title: "Legacy tools | GitHunter",
	description:
		"Status of GitHunter's retired developer search and indexing tools.",
};

export default async function LegacyPage({
	searchParams,
}: {
	searchParams: Promise<{ feature?: string }>;
}) {
	const { feature } = await searchParams;
	const cvMoved = feature === "cv-moved";

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<Header noSearch />
			<main className="flex-1">
				<section className="border-b">
					<div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
						<Badge variant="outline" className="gap-2">
							<Archive className="size-3.5" />
							{cvMoved ? "Moved" : "Deprecated"}
						</Badge>
						<h1 className="mt-5 font-semibold text-4xl tracking-tight sm:text-6xl">
							{cvMoved
								? "The CV workspace has left GitHunter."
								: "Search and indexing have been retired."}
						</h1>
						<p className="mt-5 max-w-2xl text-lg text-muted-foreground">
							{cvMoved
								? "The CV workflow will continue as a separate product. Its old GitHunter URLs remain compatible by landing here instead of failing."
								: "GitHunter is moving to transparent GitHub rankings built from versioned public evidence. Old search and profile-indexing URLs remain compatible by landing here instead of failing."}
						</p>
					</div>
				</section>

				<div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
					<Link
						href="/peru"
						className="hover:-translate-y-0.5 rounded-2xl border bg-card p-6 transition hover:shadow-sm"
					>
						<Trophy className="size-6 text-amber-600" />
						<h2 className="mt-4 font-semibold text-xl">Explore rankings</h2>
						<p className="mt-2 text-muted-foreground text-sm">
							Compare public work through explicit Balanced, Builder, OSS
							Impact, Maintainer, and Rising lenses.
						</p>
						<span className="mt-5 inline-flex items-center gap-2 font-medium text-sm">
							Open rankings <ArrowRight className="size-4" />
						</span>
					</Link>

					<a
						href="https://github.com/crafter-station/githunter/issues/new?template=feature---issue-request.md"
						target="_blank"
						rel="noreferrer"
						className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border bg-muted/30 px-6 py-4 font-medium text-sm hover:bg-muted"
					>
						<Github className="size-4" />
						Tell us what the next GitHunter should answer
					</a>
				</div>
			</main>
			<Footer />
		</div>
	);
}
