import { Footer } from "@/components/footer";
import { PublicHeader } from "@/components/public-header";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { metricLabels, rankingLenses } from "@/rankings/lenses";
import type { Metadata } from "next";
import styles from "./methodology.module.css";

export const metadata: Metadata = {
	title: { absolute: "GitHunter Ranking Methodology" },
	description:
		"How GitHunter defines country cohorts, seasonal rankings, form, all-time records, lenses, evidence boundaries, and confidence.",
	alternates: { canonical: "/methodology" },
};

const views = [
	{
		name: "Seasons",
		description:
			"One quarter at a time. The current quarter is provisional; archived quarters preserve their original evidence and ruleset.",
	},
	{
		name: "Form",
		description:
			"A rolling average of the latest four available seasons. It measures sustained momentum, not one specific quarter.",
	},
	{
		name: "All-time",
		description:
			"Career points from official closed seasons, with championships and podiums recorded separately. It has no season filter.",
	},
];

const evidence = [
	{
		name: "Public evidence",
		description:
			"GitHub contributions, merged pull requests, reviews, issues, repository adoption, followers, and external collaboration.",
	},
	{
		name: "Comparable scores",
		description:
			"Each signal becomes a cohort percentile before applying lens weights, limiting the influence of extreme totals.",
	},
	{
		name: "Known limits",
		description:
			"Private work and code quality are not inferred. Location is self-reported, and historical adoption totals cannot be reconstructed.",
	},
];

export default function MethodologyPage() {
	return (
		<div className={`vbg-report ${styles.page}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#methodology-content">
				Skip to methodology
			</a>
			<PublicHeader />
			<main id="methodology-content">
				<section className={styles.hero}>
					<div className={styles.content}>
						<p className={styles.eyebrow}>Ranking methodology</p>
						<h1>How GitHunter ranks public work.</h1>
						<p>
							There is no single objective “best developer.” GitHunter publishes
							fixed, versioned lenses so every ranking answers a specific
							question with reproducible public evidence.
						</p>
					</div>
				</section>

				<section className={`${styles.content} ${styles.section}`}>
					<div className={styles.sectionHeader}>
						<p className={styles.eyebrow}>Time model</p>
						<h2>Three views, three different questions.</h2>
						<p>
							Season selection only belongs to the seasonal record. Form and
							All-time aggregate multiple quarters, so attaching either to Q1 or
							Q2 would be misleading.
						</p>
					</div>
					<div className={styles.viewGrid}>
						{views.map((view) => (
							<Card key={view.name} className={styles.card}>
								<CardHeader>
									<CardTitle>{view.name}</CardTitle>
									<CardDescription>{view.description}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</section>

				<section className={`${styles.content} ${styles.section}`}>
					<div className={styles.sectionHeader}>
						<p className={styles.eyebrow}>Ranking lenses</p>
						<h2>Objective calculation, explicit perspective.</h2>
						<p>
							The country cohort stays constant while each lens changes the
							question and weighting.
						</p>
					</div>
					<div className={styles.lensGrid}>
						{Object.values(rankingLenses).map((lens) => (
							<Card key={lens.id} className={styles.card}>
								<CardHeader>
									<CardTitle>{lens.name}</CardTitle>
									<CardDescription>{lens.question}</CardDescription>
								</CardHeader>
								<CardContent className={styles.weights}>
									{Object.entries(lens.weights)
										.filter(([, weight]) => Boolean(weight))
										.sort(([, left], [, right]) => (right ?? 0) - (left ?? 0))
										.map(([metric, weight]) => (
											<Badge key={metric} variant="outline">
												{metricLabels[metric as keyof typeof metricLabels]}{" "}
												{Math.round((weight ?? 0) * 100)}%
											</Badge>
										))}
								</CardContent>
							</Card>
						))}
					</div>
				</section>

				<section className={`${styles.content} ${styles.section}`}>
					<div className={styles.sectionHeader}>
						<p className={styles.eyebrow}>Evidence contract</p>
						<h2>What the ranking can and cannot claim.</h2>
					</div>
					<div className={styles.evidenceGrid}>
						{evidence.map((item) => (
							<Card key={item.name} className={styles.card}>
								<CardHeader>
									<CardTitle>{item.name}</CardTitle>
									<CardDescription>{item.description}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</section>
			</main>
			<Footer />
		</div>
	);
}
