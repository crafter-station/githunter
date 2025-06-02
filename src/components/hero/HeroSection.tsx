import { MousePointerClick } from "lucide-react";
import Link from "next/link";
import type { GitHubUserProfileProps } from "../GitHubUserProfile";
import { Footer } from "../footer";
import { SearchSection } from "../search/SearchSection";

interface HeroSectionProps {
	featuredUsers: Omit<GitHubUserProfileProps, "key">[];
}

export function HeroSection({ featuredUsers }: HeroSectionProps) {
	return (
		<>
			<section className="flex min-h-[80dvh] items-center justify-center">
				<div className="container mx-auto flex flex-col items-center gap-4 px-4 py-8 lg:gap-8 lg:py-12">
					<div className="flex flex-col items-center gap-4">
						<a
							href="https://www.producthunt.com/products/githunter-find-devs-in-ms?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-githunter&#0045;ai&#0045;developer&#0045;discovery"
							target="_blank"
							rel="noopener noreferrer"
						>
							<img
								src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=972153&theme=light&t=1748875112767"
								alt="GitHunter&#0058;&#0032;AI&#0032;Developer&#0032;Discovery - Find&#0032;GitHub&#0032;developers&#0032;with&#0032;AI&#0045;powered&#0032;natural&#0032;search | Product Hunt"
								style={{ width: "250px", height: "54px" }}
								width="250"
								height="54"
							/>
						</a>
						<Link
							href="/pricing"
							className="inline-flex items-center rounded-full border border-transparent bg-primary px-2.5 py-0.5 font-semibold text-primary-foreground text-xs transition-colors hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
						>
							50% OFF for launch week
							<span className="ml-1.5">
								<MousePointerClick className="h-4 w-4" />
							</span>
						</Link>
						<h1 className="max-w-3xl text-center font-light text-3xl md:text-4xl">
							What kind of{" "}
							<span className="font-medium">open-source developer</span> are you
							looking for?
						</h1>
						<p className="max-w-2xl text-center text-muted-foreground text-sm">
							Search. Discover. Connect with the right open-source talent.
						</p>
					</div>

					<SearchSection featuredUsers={featuredUsers} />
				</div>
			</section>
			<Footer />
		</>
	);
}
