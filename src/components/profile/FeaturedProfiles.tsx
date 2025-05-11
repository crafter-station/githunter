import {
	GitHubUserProfile,
	type GitHubUserProfileProps,
} from "@/components/GitHubUserProfile";

interface FeaturedProfilesProps {
	featuredUsers: Omit<GitHubUserProfileProps, "key">[];
}

export function FeaturedProfiles({ featuredUsers }: FeaturedProfilesProps) {
	return (
		<div className="mt-24 w-full max-w-2xl lg:mt-8">
			{featuredUsers.length > 0 ? (
				<>
					{/* First row - 3 profiles */}
					<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
						{featuredUsers.slice(0, 3).map((user) => (
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
						))}
					</div>

					{/* Second row - 2 profiles centered */}
					{featuredUsers.length > 3 && (
						<div className="mt-3 flex justify-center">
							<div className="grid w-full grid-cols-1 gap-3 sm:w-5/6 sm:grid-cols-2 md:w-2/3">
								{/* Centered profiles in second row */}
								{featuredUsers.slice(3, 5).map((user) => (
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
								))}
							</div>
						</div>
					)}
				</>
			) : (
				<p className="text-center text-muted-foreground">
					No featured users available.
				</p>
			)}
		</div>
	);
}
