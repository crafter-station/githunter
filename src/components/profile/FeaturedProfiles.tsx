import {
	GitHubUserProfile,
	type GitHubUserProfileProps,
} from "@/components/GitHubUserProfile";

interface FeaturedProfilesProps {
	users: Omit<GitHubUserProfileProps, "key">[];
}

export function FeaturedProfiles({ users }: FeaturedProfilesProps) {
	return (
		<div className="mt-4 w-full max-w-2xl">
			<h2 className="mb-3 text-center font-medium text-muted-foreground text-sm">
				Featured Profiles
			</h2>
			<div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
				{users.length > 0 ? (
					users
						.slice(0, 3)
						.map((user) => (
							<GitHubUserProfile
								key={user.id}
								id={user.id}
								username={user.username}
								fullname={user.fullname}
								avatarUrl={user.avatarUrl}
								stars={user.stars}
								followers={user.followers}
								following={user.following}
								repositories={user.repositories}
								contributions={user.contributions}
								country={user.country}
								city={user.city}
								stack={user.stack}
								repos={user.repos}
								compact={true}
							/>
						))
				) : (
					<p className="col-span-3 text-center text-muted-foreground">
						No featured users available.
					</p>
				)}
			</div>
		</div>
	);
}
