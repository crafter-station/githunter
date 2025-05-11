import type { GitHubUserProfileProps } from "../GitHubUserProfile";
import { FeaturedProfiles } from "../profile/FeaturedProfiles";
import { SearchBox } from "./SearchBox";

interface SearchSectionProps {
	featuredUsers: Omit<GitHubUserProfileProps, "key">[];
}

export function SearchSection({ featuredUsers }: SearchSectionProps) {
	return (
		<div className="w-full max-w-2xl">
			<SearchBox />
			<FeaturedProfiles featuredUsers={featuredUsers} />
		</div>
	);
}
