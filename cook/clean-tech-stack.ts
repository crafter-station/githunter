import { db } from "@/db";

const users = await db.query.user.findMany();

const techs = new Set<string>();

for (const user of users) {
	for (const tech of user.stack) {
		techs.add(tech.toLowerCase());
	}
}

console.log(Array.from(techs).sort());
