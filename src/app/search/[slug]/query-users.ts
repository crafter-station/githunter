import { db } from "@/db";
import { type UserSelect, user } from "@/db/schema";
import { sql } from "drizzle-orm";
import type { SearchParams } from "./types";

export async function queryUsers(searchParams: SearchParams) {
	const query = sql.empty();

	// Base query
	query.append(sql`
			SELECT * FROM ${user}
			WHERE 1=1
		`);

	// Use array overlap operator && instead of contains @>
	// This will match if ANY of the search terms match instead of requiring ALL to match
	if (searchParams.roles && searchParams.roles.length > 0) {
		query.append(sql` AND ${user.potentialRoles} && ARRAY[`);
		const rolesArray = searchParams.roles.map((role) => sql`${role}`);
		query.append(sql.join(rolesArray, sql`, `));
		query.append(sql`]`);
	}

	// Add city condition if provided
	if (searchParams.city) {
		query.append(sql` AND ${user.city} ILIKE ${`%${searchParams.city}%`}`);
	}

	// Add country condition if provided
	if (searchParams.country) {
		query.append(
			sql` AND ${user.country} ILIKE ${`%${searchParams.country}%`}`,
		);
	}

	// Use array overlap for tech stack too
	if (searchParams.techStack && searchParams.techStack.length > 0) {
		query.append(sql` AND ${user.stack} && ARRAY[`);
		const techArray = searchParams.techStack.map((tech) => sql`${tech}`);
		query.append(sql.join(techArray, sql`, `));
		query.append(sql`]`);
	}

	// Add stars filter if provided
	if (searchParams.minStars) {
		query.append(sql` AND ${user.stars} >= ${searchParams.minStars}`);
	}

	// Add repositories filter if provided
	if (searchParams.minRepos) {
		query.append(sql` AND ${user.repositories} >= ${searchParams.minRepos}`);
	}

	// Add ordering
	query.append(sql` ORDER BY ${user.contributions} DESC`);

	// Add limit
	query.append(sql` LIMIT 200`);

	// Execute the query
	const usersFirstFilter = await db.execute(query);

	function calculateScore(user: UserSelect & { potential_roles: string[] }) {
		let score = user.followers * 5 + user.following * 2 + user.repositories;

		const amountOfRolesThatMatch = user.potential_roles.filter((role) =>
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			searchParams!.roles.includes(role),
		).length;

		score += amountOfRolesThatMatch * 10;

		for (const repo of user.repos) {
			const amountOfTechStackThatMatch = repo.techStack.filter((tech) =>
				searchParams.techStack.includes(tech),
			).length;
			if (amountOfTechStackThatMatch > 0) {
				score +=
					Math.log(repo.stars + 1) *
					(repo.contribution.commitsCount +
						repo.contribution.issuesCount * 0.5 +
						repo.contribution.pullRequestsCount * 2) *
					amountOfTechStackThatMatch;
			}
		}

		return score;
	}

	const usersSorted = (
		usersFirstFilter.rows as (UserSelect & {
			potential_roles: string[];
			clerk_id: string;
			avatar_url: string;
			created_at: Date;
			updated_at: Date;
		})[]
	)
		.map(
			(u) =>
				({
					id: u.id,

					clerkId: u.clerk_id,
					score: calculateScore(u),

					username: u.username,
					fullname: u.fullname,
					email: u.email,
					avatarUrl: u.avatar_url,

					stars: u.stars,
					followers: u.followers,
					following: u.following,
					repositories: u.repositories,
					contributions: u.contributions,

					country: u.country,
					city: u.city,

					website: u.website,
					twitter: u.twitter,
					linkedin: u.linkedin,

					about: u.about,

					stack: u.stack,
					potentialRoles: u.potential_roles,
					repos: u.repos,

					createdAt: u.created_at,
					updatedAt: u.updated_at,
				}) satisfies UserSelect & {
					score: number;
				},
		)
		.sort((a, b) => b.score - a.score);

	return usersSorted;
}
