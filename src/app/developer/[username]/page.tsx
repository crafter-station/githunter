import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { UserProfile } from "@/components/profile";
import { getUserByUsername } from "@/db/query/user";
import { notFound } from "next/navigation";

export const revalidate = 300;

interface DeveloperPageProps {
	params: Promise<{ username: string }>;
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
			<main className="container mx-auto px-4 py-8">
				<UserProfile user={userData} />
			</main>
			<Footer />
		</div>
	);
}
