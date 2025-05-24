import { db } from "@/db";
import { desc, eq, ilike, inArray } from "drizzle-orm";
import { type UserSelect, user } from "../schema/user";

export async function getFeaturedUsers(limit = 3, userIds?: string[]) {
	try {
		if (userIds && userIds.length > 0) {
			const users = await db.query.user.findMany({
				where: inArray(user.id, userIds),
				orderBy: [desc(user.stars)],
			});
			return users;
		}

		const users = await db.query.user.findMany({
			orderBy: [desc(user.stars)],
			limit,
		});

		return users;
	} catch (error) {
		console.error("Error fetching featured users:", error);
		return [];
	}
}

export async function getUserById(id: string) {
	try {
		const result = await db.query.user.findFirst({
			where: eq(user.id, id),
		});

		return result;
	} catch (error) {
		console.error("Error fetching user by id:", error);
		return null;
	}
}

export async function getUsersByTech(tech: string, limit = 10) {
	try {
		// This uses a different approach to query for tech in the stack array
		const users = await db.query.user
			.findMany({
				where: (users, { and, isNotNull }) =>
					and(
						isNotNull(users.stack),
						// We have to perform this check on the application level
						// since array contains is not directly supported in all SQL dialects
					),
				orderBy: [desc(user.stars)],
				limit,
			})
			.then((users) =>
				users.filter((user) => user.stack?.includes(tech) ?? false),
			);

		return users;
	} catch (error) {
		console.error("Error fetching users by tech:", error);
		return [];
	}
}

export async function getUsersByLocation(location: string, limit = 10) {
	try {
		// This handles both city and country searches
		const users = await db.query.user.findMany({
			where: (users, { or, ilike }) =>
				or(
					ilike(users.city, `%${location}%`),
					ilike(users.country, `%${location}%`),
				),
			orderBy: [desc(user.stars)],
			limit,
		});

		return users;
	} catch (error) {
		console.error("Error fetching users by location:", error);
		return [];
	}
}

export async function getUserByUsername(username?: string | null) {
	try {
		if (!username) {
			return null;
		}

		const result = await db.query.user.findFirst({
			where: ilike(user.username, username),
		});

		return result;
	} catch (error) {
		console.error("Error fetching user by username:", error);
		return null;
	}
}

export async function getSimilarUsers(
	userId: string,
	limit = 3,
): Promise<UserSelect[]> {
	try {
		const currentUser = await getUserById(userId);
		if (!currentUser) return [];

		const candidateUsers = await db.query.user.findMany({
			where: (users, { and, ne }) => and(ne(users.id, userId)),
			limit: limit * 10,
		});

		// Calculate similarity score focusing on technologies and contributions
		const usersWithScores = candidateUsers.map((candidate) => {
			let score = 0;

			// 1. Technology stack matching (highest weight - 70%)
			if (currentUser.stack?.length && candidate.stack?.length) {
				const matchingTech = candidate.stack.filter((tech) =>
					currentUser.stack?.includes(tech),
				);

				// High weight for matching technologies
				if (matchingTech.length > 0) {
					// Consider both the absolute number of matches and the percentage
					const matchPercentage =
						matchingTech.length / currentUser.stack.length;
					score += matchPercentage * 70;
				}
			}

			// 2. Similarity in contributions (30%)
			const currentContributions = currentUser.contributions || 0;
			const candidateContributions = candidate.contributions || 0;

			if (currentContributions > 0 && candidateContributions > 0) {
				// Calculate how similar the contribution counts are
				const contributionRatio =
					Math.min(currentContributions, candidateContributions) /
					Math.max(currentContributions, candidateContributions);
				score += contributionRatio * 30;
			}

			return {
				user: candidate as UserSelect,
				score,
			};
		});

		// Filter to require at least some technology overlap
		const minScore = 10; // Require at least some technology match
		const filteredUsers = usersWithScores.filter(
			(item) => item.score >= minScore,
		);
		const sortedUsers = filteredUsers.sort((a, b) => b.score - a.score);

		return sortedUsers.slice(0, limit).map((item) => item.user);
	} catch (error) {
		console.error("Error fetching similar users:", error);
		return [];
	}
}
