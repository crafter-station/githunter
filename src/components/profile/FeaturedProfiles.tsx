import {
	GitHubUserProfile,
	type GitHubUserProfileProps,
} from "@/components/GitHubUserProfile";

interface FeaturedProfilesProps {
	users: Omit<GitHubUserProfileProps, "key">[];
}

export function FeaturedProfiles({ users }: FeaturedProfilesProps) {
	return (
		<div className="mt-8 w-full max-w-4xl">
			<h2 className="mb-6 text-center font-medium text-lg">
				Featured Profiles
			</h2>
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
				{users.length > 0 ? (
					users.map((user) => (
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
