import { writeFileSync } from "node:fs";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { sql } from "drizzle-orm";

// Normalize both kabul and herat variations using SQL
await db
	.update(userTable)
	.set({
		city: sql`CASE 
			WHEN LOWER(${userTable.city}) LIKE '%kabul%' THEN 'kabul'
			WHEN LOWER(${userTable.city}) LIKE '%herat%' THEN 'herat'
			ELSE ${userTable.city}
		END`,
	})
	.where(
		sql`LOWER(${userTable.city}) LIKE '%kabul%' OR LOWER(${userTable.city}) LIKE '%herat%'`,
	);

// Get all unique cities
const uniqueCities = await db
	.select({ city: userTable.city })
	.from(userTable)
	.where(sql`${userTable.city} IS NOT NULL`)
	.groupBy(userTable.city);

const sortedCities = uniqueCities
	.map((row) => row.city)
	.filter((city): city is string => city !== null)
	.sort();

writeFileSync("cities.json", JSON.stringify(sortedCities, null, 2));
console.log("✅ Cities normalized and written to cities.json");
