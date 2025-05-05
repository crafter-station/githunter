import { Header } from "@/components/Header";
import { HeroSection } from "@/components/hero";
import { getFeaturedUsers } from "@/db/query/user";

// Specific user IDs for featured profiles
const FEATURED_USER_IDS = [
	"v5Xnl0ziEOMM",
	"Qq9Qgp0so371",
	"0itHKXlYtqM7byKLrbKSm",
];

export default async function Home() {
	// Fetch specific featured users by ID
	const featuredUsers = await getFeaturedUsers(3, FEATURED_USER_IDS);

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			{/* Header */}
			<Header />

			{/* Hero Section with footer and FAB */}
			<HeroSection featuredUsers={featuredUsers} />
		</div>
	);
}
