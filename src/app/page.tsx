import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero";
import { getFeaturedUsers } from "@/db/query/user";

const FEATURED_USER_IDS = [
	"v5Xnl0ziEOMM",
	"Qq9Qgp0so371",
	"0itHKXlYtqM7byKLrbKSm",
	"QSIRMargHGOl",
	"olNsPeCQZ3MQ",
	"u4Vs8hOtr8UAjogvS9jFA",
];

export default async function Home() {
	const featuredUsers = await getFeaturedUsers(5, FEATURED_USER_IDS);

	return (
		<div className="flex min-h-screen flex-col bg-background text-foreground">
			<Header noSearch />
			<HeroSection featuredUsers={featuredUsers} />
		</div>
	);
}
