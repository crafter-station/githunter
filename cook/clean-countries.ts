import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { eq, or } from "drizzle-orm";

const users = await db.query.user.findMany();

const countries = new Set<string>();

for (const user of users) {
	if (user.country) {
		countries.add(user.country);
	}
}

console.log(Array.from(countries).sort());

await db
	.update(userTable)
	.set({
		country: "united_states",
	})
	.where(
		or(
			eq(userTable.country, "united states"),
			eq(userTable.country, "United States of America"),
		),
	);

console.log(users.length);
