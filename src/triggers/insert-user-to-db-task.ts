import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { nanoid } from "@/lib/nanoid";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const insertUserToDbTask = schemaTask({
	id: "insert-user-to-db",
	schema: z.object({
		username: z.string(),
		fullname: z.string(),
		avatarUrl: z.string(),

		stars: z.number(),
		followers: z.number(),
		following: z.number(),
		repositories: z.number(),
		contributions: z.number(),

		country: z.string().optional(),
		city: z.string().optional(),

		website: z.string().optional(),
		twitter: z.string().optional(),
		linkedin: z.string().optional(),

		about: z.string().optional(),

		stack: z.array(z.string()),
		potentialRoles: z.array(z.string()),

		repos: z.array(
			z.object({
				fullName: z.string(),
				description: z.string(),
				stars: z.number(),
				techStack: z.array(z.string()),
			}),
		),
	}),
	run: async (user) => {
		const existingUser = await db.query.user.findFirst({
			where: eq(userTable.username, user.username),
		});

		if (existingUser) {
			await db
				.update(userTable)
				.set({ ...user, id: existingUser.id, updatedAt: new Date() })
				.where(eq(userTable.id, existingUser.id));
		} else {
			await db.insert(userTable).values({ ...user, id: nanoid() });
		}
	},
});
