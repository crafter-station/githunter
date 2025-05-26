import { db } from "@/db";
import { user } from "@/db/schema";
import { createClerkClient } from "@clerk/backend";
import { eq, ilike } from "drizzle-orm";

const clerk = createClerkClient({
	secretKey: process.env.CLERK_SECRET_KEY,
});

export async function removeUsersDuplicateIlikeUsername() {
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
		console.log(githubUsername);

		const users = await db
			.select({ username: user.username, id: user.id, clerkId: user.clerkId })
			.from(user)
			.where(ilike(user.username, githubUsername));

		if (users.length > 1) {
			// Find the user with exact lowercase match
			const exactMatch = users.find(
				(u) => u.username.toLowerCase() === githubUsername.toLowerCase(),
			);

			// Delete all other users
			for (const u of users) {
				if (u.id !== exactMatch?.id) {
					await db.delete(user).where(eq(user.id, u.id));
					console.log(`Deleted duplicate user: ${u.username}`);
				}
			}
		}

		console.log(users);
	}
}

removeUsersDuplicateIlikeUsername();
