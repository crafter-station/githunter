import { schemaTask } from "@trigger.dev/sdk/v3";
import { eq } from "drizzle-orm";

import { UserInsertSchema, db, user as userTable } from "@/db";

export const insertUserToDbTask = schemaTask({
	id: "insert-user-to-db",
	schema: UserInsertSchema,
	run: async (user) => {
		const existingUser = await db.query.user.findFirst({
			where: (table, { ilike }) => ilike(table.username, user.username),
		});
		if (existingUser) {
			user.id = existingUser.id;
			await db.update(userTable).set(user).where(eq(userTable.id, user.id));
		} else {
			await db.insert(userTable).values(user);
		}
		return user;
	},
});
