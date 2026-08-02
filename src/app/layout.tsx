import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { siteUrl } from "@/rankings/seo";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import { Providers } from "./providers";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	metadataBase: new URL(siteUrl),
	title: {
		default: "GitHunter | GitHub Rankings Across Latin America",
		template: "%s | GitHunter",
	},
	description:
		"Transparent, versioned GitHub rankings for developers across Latin America, built from public commits, contributions, collaboration, and open source impact.",
	applicationName: "GitHunter",
	category: "technology",
	creator: "Crafter Station",
	publisher: "Crafter Station",
	keywords: [
		"GitHub rankings",
		"Latin America developers",
		"Peru developers",
		"open source rankings",
		"GitHub contributors",
	],
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "/",
		siteName: "GitHunter",
		title: "GitHunter | GitHub Rankings Across Latin America",
		description:
			"Transparent, versioned GitHub rankings for developers across Latin America, starting with Peru.",
	},
	twitter: {
		card: "summary",
		title: "GitHunter | GitHub Rankings Across Latin America",
		description:
			"Transparent, versioned GitHub rankings for developers across Latin America, starting with Peru.",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-image-preview": "large",
			"max-snippet": -1,
			"max-video-preview": -1,
		},
	},
};

const websiteSchema = {
	"@context": "https://schema.org",
	"@type": "WebSite",
	name: "GitHunter",
	url: siteUrl,
	description:
		"Transparent, versioned GitHub rankings for developers across Latin America.",
	publisher: {
		"@type": "Organization",
		name: "Crafter Station",
		url: "https://crafter-station.com",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script type="application/ld+json">
					{JSON.stringify(websiteSchema)}
				</script>
			</head>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased selection:bg-[#E6E7A4] dark:selection:text-black`}
			>
				<Suspense>
					<Providers>{children}</Providers>
				</Suspense>
				<Toaster />
				<Analytics />
			</body>
		</html>
	);
}
