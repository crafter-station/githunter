import { HelpCircle } from "lucide-react";
import type { GitHubUserProfileProps } from "../GitHubUserProfile";
import { SearchSection } from "../search/SearchSection";

interface HeroSectionProps {
	featuredUsers: Omit<GitHubUserProfileProps, "key">[];
}

export function HeroSection({ featuredUsers }: HeroSectionProps) {
	return (
		<>
			<section className="flex min-h-[80dvh] items-center justify-center">
				<div className="container mx-auto flex flex-col items-center gap-8 px-4 py-12">
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

					<SearchSection users={featuredUsers} />
				</div>
			</section>

			{/* Footer similar to Perplexity */}
			<footer className="mt-auto border-border border-t border-dashed py-8">
				<div className="container mx-auto flex items-center justify-center gap-6">
					<a
						href="/about"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						About
					</a>
					<a
						href="/pricing"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Pricing
					</a>
					<a
						href="https://github.com/crafter-station/githunter"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						GitHub
					</a>
					<a
						href="https://www.linkedin.com/company/crafter-station"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						LinkedIn
					</a>
					<a
						href="https://discord.gg/7MfrzBAX"
						rel="noopener noreferrer"
						target="_blank"
						className="text-muted-foreground text-sm hover:text-primary"
					>
						Discord
					</a>
				</div>
			</footer>

			{/* FAB Button */}
			<button
				type="button"
				className="fixed right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
			>
				<HelpCircle className="h-5 w-5" />
			</button>
		</>
	);
}
