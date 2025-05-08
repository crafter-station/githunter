import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { UserProfile } from "@/components/profile";
import { getUserByUsername } from "@/db/query/user";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;
export const dynamic = "force-static";
export const dynamicParams = true;

interface DeveloperPageProps {
	params: Promise<{ username: string }>;
}

export async function generateStaticParams() {
	return [];
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
	const { username } = await params;

	const userData = await getUserByUsername(username);

	if (!userData) {
		notFound();
	}

	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Header />
			<main className="flex-1">
				<div className="container mx-auto px-4 py-8">
					<UserProfile user={userData} />
				</div>
			</main>
			<Footer />
		</div>
	);
}

export async function generateMetadata({
	params,
}: DeveloperPageProps): Promise<Metadata> {
	const { username } = await params;

	const userData = await getUserByUsername(username);

	if (!userData) {
		return {
			title: "Developer Not Found | GitHunter",
		};
	}

	return {
		title: `${userData.fullname || userData.username} | Open Source Developer | GitHunter`,
		description: `View ${userData.fullname || userData.username}'s GitHub profile, repositories, tech stack and more on GitHunter.`,
		openGraph: {
			title: `${userData.fullname || userData.username} | GitHunter`,
			description: `Open source developer with ${userData.stars}+ stars and ${userData.contributions}+ contributions.`,
			images: [`/api/og/users/${username}`],
			url: `https://githunter.dev/api/og/users/${username}`,
			siteName: "GitHunter",
			type: "website",
		},
		twitter: {
			card: "summary_large_image",
			title: `${userData.fullname || userData.username} | GitHunter`,
			description: `Open source developer with ${userData.stars}+ stars and ${userData.contributions}+ contributions.`,
			images: [`/developer/${username}/opengraph-image`],
		},
		keywords: ["dev", "user", "github", "githunter"],
	};
}
