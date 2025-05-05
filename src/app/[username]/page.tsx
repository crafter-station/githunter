import { Header } from "@/components/header";
import { UserProfile } from "@/components/profile";
import { getUserByUsername } from "@/db/query/user";
import { notFound } from "next/navigation";

export default async function UserPage({
	params,
}: {
	params: Promise<{ username: string }>;
}) {
	const { username } = await params;
	const user = await getUserByUsername(username);

	if (!user) {
		notFound();
	}

	return (
		<div className="min-h-screen bg-background">
			<Header />
			<main className="container mx-auto px-4 py-8">
				<UserProfile user={user} />
			</main>
		</div>
	);
}
