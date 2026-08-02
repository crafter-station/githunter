import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { RankingTable } from "@/components/rankings/ranking-table";
import { Badge } from "@/components/ui/badge";
import { isRankingScope } from "@/rankings/data";
import { isLensId, metricLabels, rankingLenses } from "@/rankings/lenses";
import { getRankingSnapshot } from "@/rankings/store";
import type { RankingEntry } from "@/rankings/types";
import {
	ArrowUpRight,
	CalendarDays,
	CheckCircle2,
	Database,
	Github,
	Info,
	ShieldCheck,
	Sparkles,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 3600;

function compactNumber(value: number) {
	return new Intl.NumberFormat("en", {
		notation: value >= 1000 ? "compact" : "standard",
		maximumFractionDigits: value >= 1000 ? 1 : 0,
	}).format(value);
}

function formatDate(value: string) {
	return new Intl.DateTimeFormat("en", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	}).format(new Date(value));
}

function TopDeveloper({ entry }: { entry: RankingEntry }) {
	const strongest = [...entry.breakdown]
		.sort((left, right) => right.points - left.points)
		.slice(0, 2);
	return (
		<a
			href={`https://github.com/${entry.profile.login}`}
			target="_blank"
			rel="noreferrer"
			aria-label={`${entry.profile.name || entry.profile.login} on GitHub, opens in a new tab`}
			className="group hover:-translate-y-0.5 relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md"
		>
			<div className="absolute top-0 right-0 rounded-bl-2xl border-b border-l bg-amber-300 px-4 py-2 font-bold font-mono text-amber-950 text-lg">
				#{entry.rank}
			</div>
			<Image
				src={entry.profile.avatarUrl}
				alt=""
				width={64}
				height={64}
				className="rounded-2xl border bg-muted"
				priority={entry.rank === 1}
			/>
			<div className="mt-4">
				<h2 className="flex items-center gap-1 font-semibold text-lg group-hover:underline">
					{entry.profile.name || entry.profile.login}
					<ArrowUpRight className="size-4 text-muted-foreground" />
				</h2>
				<p className="text-muted-foreground text-sm">@{entry.profile.login}</p>
			</div>
			<div className="mt-5 flex items-end justify-between gap-4 border-t pt-4">
				<div className="flex flex-wrap gap-2">
					{strongest.map((metric) => (
						<span key={metric.metric} className="text-muted-foreground text-xs">
							{metricLabels[metric.metric]}{" "}
							<strong className="text-foreground">
								{compactNumber(metric.raw)}
							</strong>
						</span>
					))}
				</div>
				<div className="text-right">
					<p className="font-mono font-semibold text-2xl tabular-nums">
						{entry.score.toFixed(2)}
					</p>
					<p className="text-muted-foreground text-xs">score</p>
				</div>
			</div>
		</a>
	);
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}): Promise<Metadata> {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) return {};
	const definition = rankingLenses[lens];
	return {
		title: `${definition.shortName} GitHub ranking in Peru | GitHunter`,
		description: `${definition.question} An evidence-backed ranking with transparent metrics, weights, and freshness.`,
		alternates: { canonical: `/rankings/${scope}/${lens}` },
	};
}

export default async function RankingPage({
	params,
}: {
	params: Promise<{ scope: string; lens: string }>;
}) {
	const { scope, lens } = await params;
	if (!isRankingScope(scope) || !isLensId(lens)) notFound();
	const snapshot = await getRankingSnapshot(scope, lens);
	const top = snapshot.entries.slice(0, 3);
	const weights = Object.entries(snapshot.lens.weights).sort(
		([, left], [, right]) => (right ?? 0) - (left ?? 0),
	);

	return (
		<div className="min-h-screen bg-background text-foreground">
			<Header noSearch />
			<main>
				<section className="relative overflow-hidden border-b">
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.2),transparent_36%),radial-gradient(circle_at_80%_15%,rgba(99,102,241,0.16),transparent_30%)]" />
					<div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
						<div className="max-w-3xl">
							<Badge className="border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-100">
								Public beta · Peru
							</Badge>
							<h1 className="mt-5 text-balance font-semibold text-4xl tracking-tight sm:text-6xl">
								Public work. Explicit rules.
							</h1>
							<p className="mt-5 max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
								GitHunter ranks observable GitHub work through versioned lenses,
								not a hidden universal score.
							</p>
						</div>
						<div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
							<span className="flex items-center gap-2">
								<Database className="size-4 text-indigo-600" />
								{snapshot.cohort.scored} public profiles
							</span>
							<span className="flex items-center gap-2">
								<CalendarDays className="size-4 text-indigo-600" />
								Updated {formatDate(snapshot.generatedAt)}
							</span>
							<span className="flex items-center gap-2">
								<ShieldCheck className="size-4 text-indigo-600" />
								Lens v{snapshot.lens.version}
							</span>
						</div>
					</div>
				</section>

				<div className="mx-auto max-w-7xl space-y-14 px-4 py-10 sm:px-6 lg:px-8">
					<nav aria-label="Ranking lenses" className="flex flex-wrap gap-2">
						{Object.values(rankingLenses).map((definition) => (
							<Link
								key={definition.id}
								href={`/rankings/${scope}/${definition.id}`}
								aria-current={definition.id === lens ? "page" : undefined}
								className={
									definition.id === lens
										? "rounded-full bg-foreground px-4 py-2 font-medium text-background text-sm"
										: "rounded-full border bg-background px-4 py-2 font-medium text-sm transition hover:bg-muted"
								}
							>
								{definition.shortName}
							</Link>
						))}
					</nav>

					<section
						aria-labelledby="lens-title"
						className="grid gap-8 lg:grid-cols-[1fr_340px]"
					>
						<div>
							<p className="font-mono text-indigo-600 text-xs uppercase tracking-[0.18em] dark:text-indigo-300">
								Current lens
							</p>
							<h2
								id="lens-title"
								className="mt-2 font-semibold text-3xl tracking-tight"
							>
								{snapshot.lens.name}
							</h2>
							<p className="mt-3 text-lg text-muted-foreground">
								{snapshot.lens.question}
							</p>
							<p className="mt-2 max-w-2xl text-muted-foreground">
								{snapshot.lens.description}
							</p>
						</div>
						<div className="rounded-2xl border bg-muted/30 p-5">
							<div className="flex items-center gap-2 font-medium">
								<Sparkles className="size-4 text-amber-500" />
								Weight profile
							</div>
							<div className="mt-4 space-y-2.5">
								{weights.map(([metric, weight]) => (
									<div key={metric} className="flex items-center gap-3 text-sm">
										<span className="w-28 text-muted-foreground">
											{metricLabels[metric as keyof typeof metricLabels]}
										</span>
										<span
											className="h-1.5 flex-1 overflow-hidden rounded-full bg-border"
											role="img"
											aria-label={`${metricLabels[metric as keyof typeof metricLabels]} weight ${(weight ?? 0) * 100} percent`}
										>
											<span
												className="block h-full rounded-full bg-indigo-500"
												style={{ width: `${(weight ?? 0) * 100}%` }}
											/>
										</span>
										<span className="w-8 text-right font-mono tabular-nums">
											{(weight ?? 0) * 100}%
										</span>
									</div>
								))}
							</div>
						</div>
					</section>

					<section aria-labelledby="leaders-title">
						<div className="mb-4 flex items-center justify-between">
							<div>
								<p className="font-mono text-amber-700 text-xs uppercase tracking-[0.18em] dark:text-amber-300">
									Leaders
								</p>
								<h2 id="leaders-title" className="mt-1 font-semibold text-2xl">
									Top 3 in {snapshot.scopeName}
								</h2>
							</div>
						</div>
						<div className="grid gap-4 md:grid-cols-3">
							{top.map((entry) => (
								<TopDeveloper key={entry.profile.login} entry={entry} />
							))}
						</div>
					</section>

					<RankingTable entries={snapshot.entries} lensId={lens} />

					<section className="grid gap-4 lg:grid-cols-2">
						<div className="rounded-2xl border p-6">
							<div className="flex items-center gap-2 font-semibold text-lg">
								<CheckCircle2 className="size-5 text-emerald-600" />
								How the score works
							</div>
							<p className="mt-3 text-muted-foreground text-sm leading-6">
								Each metric is converted to a cohort percentile before applying
								the published weight. This limits outliers and keeps different
								units comparable. Confidence reflects the evidence windows
								available to a lens. An observed zero remains a real zero.
							</p>
						</div>
						<div className="rounded-2xl border p-6">
							<div className="flex items-center gap-2 font-semibold text-lg">
								<Info className="size-5 text-indigo-600" />
								Evidence boundary
							</div>
							<p className="mt-3 text-muted-foreground text-sm leading-6">
								Public activity runs from {formatDate(snapshot.period.from)} to{" "}
								{formatDate(snapshot.period.to)}. GitHub location is
								self-reported, and private work is excluded. The cohort combines
								follower discovery with public activity rankings and removes
								clear location contradictions and cross-country spam.
							</p>
						</div>
					</section>

					<details className="rounded-2xl border bg-muted/20 p-6">
						<summary className="cursor-pointer font-semibold">
							Sources, limitations, and API
						</summary>
						<div className="mt-5 grid gap-6 text-sm md:grid-cols-2">
							<div>
								<h3 className="font-medium">Sources</h3>
								<ul className="mt-2 space-y-1 text-muted-foreground">
									{snapshot.sources.map((source) => (
										<li key={source}>· {source}</li>
									))}
								</ul>
							</div>
							<div>
								<h3 className="font-medium">Limitations</h3>
								<ul className="mt-2 space-y-1 text-muted-foreground">
									{snapshot.limitations.map((limitation) => (
										<li key={limitation}>· {limitation}</li>
									))}
								</ul>
							</div>
						</div>
						<a
							href={`/api/rankings/${scope}/${lens}`}
							className="mt-5 inline-flex items-center gap-2 font-medium text-indigo-600 hover:underline dark:text-indigo-300"
						>
							<Github className="size-4" />
							Open the reproducible JSON snapshot
						</a>
					</details>
				</div>
			</main>
			<Footer />
		</div>
	);
}
