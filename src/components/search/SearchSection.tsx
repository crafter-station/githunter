import type { GitHubUserProfileProps } from "../GitHubUserProfile";
import { FeaturedProfiles } from "../profile/FeaturedProfiles";
import { SearchBox } from "./SearchBox";

interface SearchSectionProps {
	users: Omit<GitHubUserProfileProps, "key">[];
}

export function SearchSection({ users }: SearchSectionProps) {
	return (
		<div className="w-full max-w-2xl">
			<SearchBox />
			<FeaturedProfiles users={users} />
		</div>
	);
}
