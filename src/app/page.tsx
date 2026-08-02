import { Header } from "@/components/header";
import { LatamSignalField } from "@/components/home/latam-signal-field";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import styles from "./home.module.css";

export const metadata: Metadata = {
	title: "GitHub rankings across Latin America | GitHunter",
	description:
		"Transparent, versioned views of public GitHub work across Latin America, starting with Peru.",
	alternates: { canonical: "/" },
};

export default function Home() {
	return (
		<div className={`vbg-report ${styles.page}`}>
			<link
				rel="stylesheet"
				href="https://vercel.com/geist/vercel-brand.css"
				precedence="vbg"
			/>
			<a className="vbg-skip-link" href="#main">
				Skip to content
			</a>
			<Header noSearch />
			<main id="main" className={styles.main}>
				<section className={styles.hero}>
					<div className={styles.copy}>
						<div className={styles.signalLabel}>
							<span aria-hidden="true" />
							Public signal
						</div>
						<h1>A public record of GitHub work across Latin America.</h1>
						<p>
							Transparent, versioned rankings for the people building Latin
							America in public. Starting with Peru.
						</p>
						<Link href="/peru" className={styles.cta}>
							Explore Peru <ArrowRight aria-hidden="true" />
						</Link>
					</div>
					<LatamSignalField />
				</section>
				<footer className={styles.signature}>
					<a
						href="https://crafter-station.com"
						target="_blank"
						rel="noopener noreferrer"
						className={styles.initiative}
					>
						<span className={styles.monogram}>CS</span>
						<span>An initiative by Crafter Station</span>
					</a>
					<div className={styles.coordinates} aria-label="Project attributes">
						<span>LATAM / 01</span>
						<span>Peru first</span>
						<span>Open data</span>
					</div>
				</footer>
			</main>
		</div>
	);
}
