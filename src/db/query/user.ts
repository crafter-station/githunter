import { db } from "@/db";
import { desc, eq } from "drizzle-orm";
import { user } from "../schema/user";

export async function getFeaturedUsers(limit = 3) {
	try {
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
