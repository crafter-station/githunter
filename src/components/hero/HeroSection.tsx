import type { GitHubUserProfileProps } from "../GitHubUserProfile";
import { FeaturedProfiles } from "../profile/FeaturedProfiles";
import { SearchSection } from "../search/SearchSection";

interface HeroSectionProps {
	featuredUsers: Omit<GitHubUserProfileProps, "key">[];
}

export function HeroSection({ featuredUsers }: HeroSectionProps) {
	return (
		<section className="flex min-h-[100dvh] items-center justify-center">
			<div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16">
				<div className="flex flex-col items-center gap-4">
					<h1 className="max-w-3xl text-center font-light text-3xl md:text-4xl">
						What kind of{" "}
						<span className="font-medium">open-source developer</span> are you
						looking for?
					</h1>
					<p className="max-w-2xl text-center text-muted-foreground text-sm">
						Search. Discover. Connect with the right open-source talent.
					</p>
				</div>

				<SearchSection />

				<FeaturedProfiles users={featuredUsers} />
			</div>
		</section>
	);
}
