import { db } from "@/db";
import { user } from "@/db/schema";
import { createClerkClient } from "@clerk/backend";
import { ilike } from "drizzle-orm";

const clerk = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

export async function updateClerkIds() {
	// Get all Clerk users
	const clerkUsers = await clerk.users.getUserList({
		limit: 100,
	});

	// For each Clerk user, try to find and update matching GitHub user
	for (const clerkUser of clerkUsers.data) {
		const githubUsername = clerkUser.username;

		if (!githubUsername) {
			continue;
		}

		// Update the user record with their Clerk ID
		try {
			await db
				.update(user)
				.set({
					clerkId: clerkUser.id,
				})
				.where(ilike(user.username, githubUsername));
		} catch (error) {
			console.error(error);
		}
	}
}

updateClerkIds();
