import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { Badge } from "@/components/ui/badge";
import { metricLabels } from "@/rankings/lenses";
import type { BundledRankingProfile } from "@/rankings/profile";
import { siteUrl } from "@/rankings/seo";
import type { RankingMetric } from "@/rankings/types";
import {
	Activity,
	ArrowLeft,
	ArrowUpRight,
	CalendarDays,
	Github,
	MapPin,
	Medal,
	ShieldCheck,
	Trophy,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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

export function RankedDeveloperProfile({
	data,
}: {
	data: BundledRankingProfile;
}) {
	const { profile, rankings } = data;
	const rankingPath = `/${data.scope}`;
	const metrics = Object.entries(profile.metrics) as [RankingMetric, number][];
	const personSchema = {
		"@context": "https://schema.org",
		"@type": "Person",
		name: profile.name || profile.login,
		url: new URL(`/developer/${profile.login}`, siteUrl).toString(),
		image: profile.avatarUrl,
		sameAs: [`https://github.com/${profile.login}`],
		homeLocation: profile.location
			? {
					"@type": "Place",
					name: profile.location,
				}
			: undefined,
	};

	return (
		<div className="min-h-screen bg-background text-foreground">
			<PublicHeader scope={data.scope} />
			<main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
				<script type="application/ld+json">
					{JSON.stringify(personSchema)}
				</script>
				<Link
					href={rankingPath}
					className="inline-flex items-center gap-2 text-muted-foreground text-sm hover:text-foreground"
				>
					<ArrowLeft className="size-4" />
					Back to {data.scopeName} rankings
				</Link>

				<section className="mt-6 overflow-hidden rounded-3xl border bg-card shadow-sm">
					<div className="bg-[radial-gradient(circle_at_top_left,rgba(250,204,21,0.2),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.16),transparent_34%)] p-6 sm:p-10">
						<div className="flex flex-col gap-6 sm:flex-row sm:items-center">
							<Image
								src={profile.avatarUrl}
								alt=""
								width={112}
								height={112}
								className="rounded-3xl border bg-muted shadow-sm"
								priority
							/>
							<div className="min-w-0 flex-1">
								<Badge className="border-blue-300 bg-blue-50 text-blue-800 hover:bg-blue-50">
									GitHunter ranking profile
								</Badge>
								<h1 className="mt-3 font-semibold text-3xl tracking-tight sm:text-5xl">
									{profile.name || profile.login}
								</h1>
								<p className="mt-1 text-lg text-muted-foreground">
									@{profile.login}
								</p>
								<div className="mt-4 flex flex-wrap gap-4 text-sm">
									{profile.location && (
										<span className="flex items-center gap-2">
											<MapPin className="size-4 text-indigo-600" />
											{profile.location}
										</span>
									)}
									<span className="flex items-center gap-2">
										<CalendarDays className="size-4 text-indigo-600" />
										Updated {formatDate(data.generatedAt)}
									</span>
								</div>
							</div>
							<a
								href={`https://github.com/${profile.login}`}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 font-medium text-background text-sm"
							>
								<Github className="size-4" />
								Open GitHub
								<ArrowUpRight className="size-4" />
							</a>
						</div>
					</div>
				</section>

				{data.career && (
					<section className="mt-10" aria-labelledby="ranking-career">
						<div className="flex items-center gap-2">
							<Trophy className="size-5 text-[#1d4eff]" />
							<h2 id="ranking-career" className="font-semibold text-2xl">
								Ranking career
							</h2>
							{data.career.provisional && (
								<Badge variant="outline">
									Projected until first official close
								</Badge>
							)}
						</div>
						<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
							<Link
								href={rankingPath}
								className="rounded-xl border bg-card p-5 transition hover:border-[#1d4eff]/40"
							>
								<CalendarDays className="size-4 text-[#1d4eff]" />
								<p className="mt-5 text-muted-foreground text-xs uppercase tracking-wider">
									{data.career.seasonLabel}
								</p>
								<p className="mt-1 font-mono font-semibold text-3xl">
									#{rankings[0]?.entry.rank}
								</p>
							</Link>
							<Link
								href={`${rankingPath}?view=all-time`}
								className="rounded-xl border bg-card p-5 transition hover:border-[#1d4eff]/40"
							>
								<Medal className="size-4 text-[#1d4eff]" />
								<p className="mt-5 text-muted-foreground text-xs uppercase tracking-wider">
									All-time
								</p>
								<p className="mt-1 font-mono font-semibold text-3xl">
									#{data.career.allTimeRank}
								</p>
								<p className="text-muted-foreground text-xs">
									{data.career.careerPoints.toFixed(2)} career points
								</p>
							</Link>
							<Link
								href={`${rankingPath}?view=form`}
								className="rounded-xl border bg-card p-5 transition hover:border-[#1d4eff]/40"
							>
								<Activity className="size-4 text-[#1d4eff]" />
								<p className="mt-5 text-muted-foreground text-xs uppercase tracking-wider">
									Four-quarter form
								</p>
								<p className="mt-1 font-mono font-semibold text-3xl">
									#{data.career.formRank}
								</p>
								<p className="text-muted-foreground text-xs">
									{data.career.formScore.toFixed(2)} form score
								</p>
							</Link>
							<div className="rounded-xl border bg-card p-5">
								<Trophy className="size-4 text-[#1d4eff]" />
								<p className="mt-5 text-muted-foreground text-xs uppercase tracking-wider">
									Championships
								</p>
								<p className="mt-1 font-mono font-semibold text-3xl">
									{data.career.championships}
								</p>
								<p className="text-muted-foreground text-xs">
									{data.career.podiums} podiums · {data.career.seasons} seasons
								</p>
							</div>
						</div>
					</section>
				)}

				<section className="mt-10" aria-labelledby="ranking-positions">
					<div className="flex items-center gap-2">
						<ShieldCheck className="size-5 text-indigo-600" />
						<h2 id="ranking-positions" className="font-semibold text-2xl">
							Ranking positions
						</h2>
					</div>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
						{rankings.map(({ lens, entry }) => (
							<Link
								key={lens.id}
								href={
									lens.id === "balanced"
										? rankingPath
										: `${rankingPath}?lens=${lens.id}`
								}
								className="hover:-translate-y-0.5 rounded-2xl border bg-card p-5 transition hover:shadow-sm"
							>
								<p className="text-muted-foreground text-sm">
									{lens.shortName}
								</p>
								<p className="mt-2 font-mono font-semibold text-3xl tabular-nums">
									#{entry.rank}
								</p>
								<p className="mt-1 text-muted-foreground text-xs">
									{entry.score.toFixed(2)} score · {entry.confidence}%
									confidence
								</p>
							</Link>
						))}
					</div>
				</section>

				<section className="mt-10" aria-labelledby="public-signals">
					<h2 id="public-signals" className="font-semibold text-2xl">
						Observable public signals
					</h2>
					<p className="mt-2 text-muted-foreground text-sm">
						Measured from {formatDate(data.period.from)} to{" "}
						{formatDate(data.period.to)}.
					</p>
					<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
						{metrics.map(([metric, value]) => (
							<div key={metric} className="rounded-2xl border bg-card p-4">
								<p className="text-muted-foreground text-sm">
									{metricLabels[metric]}
								</p>
								<p className="mt-1 font-mono font-semibold text-2xl tabular-nums">
									{compactNumber(value)}
								</p>
							</div>
						))}
					</div>
				</section>
			</main>
			<Footer scope={data.scope} />
		</div>
	);
}
