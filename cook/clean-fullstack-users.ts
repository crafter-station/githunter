import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const users = await db.query.user.findMany();

const roles = new Set<string>();

for (const user of users) {
	for (const role of user.potentialRoles) {
		roles.add(role);
	}
}

console.log(Array.from(roles).sort());

for (const user of users) {
	if (
		user.potentialRoles.includes("frontend developer") ||
		user.potentialRoles.includes("frontend engineer")
	) {
		await db
			.update(userTable)
			.set({
				potentialRoles: Array.from(
					new Set([
						...user.potentialRoles.filter((role) => !role.includes("frontend")),
						"frontend developer",
						"frontend engineer",
					]),
				),
			})
			.where(eq(userTable.id, user.id));
	}
}
