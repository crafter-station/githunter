import { Footer } from "@/components/footer";
import { Header } from "@/components/header-2";
import { UserProfile } from "@/components/profile";
import { getUserByUsername } from "@/db/query/user";
import {} from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface DeveloperPageProps {
	params: Promise<{ username: string }>;
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
			images: [userData.avatarUrl],
		},
	};
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
