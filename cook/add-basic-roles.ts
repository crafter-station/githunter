import { db } from "@/db";
import { user as userTable } from "@/db/schema";
import { sql } from "drizzle-orm";

// Add new potential roles to all users, ensuring no duplicates
await db.update(userTable).set({
	potentialRoles: sql`array(
			SELECT DISTINCT unnest(
				COALESCE(${userTable.potentialRoles}, ARRAY[]::text[]) || 
				ARRAY['software engineer', 'programmer', 'developer']
			)
		)`,
});
