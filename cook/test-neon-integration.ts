import { db } from "@/db";
import { user } from "@/db/schema";
import { sql } from "drizzle-orm";

console.log("TEST NEON INTEGRATION");

const result = await db.select({ count: sql<number>`count(*)` }).from(user);

console.log(result);

/* const deleteResult = await db
  .delete(user)
  .where(
    sql`${user.id} IN (
      SELECT id FROM ${user} 
      ORDER BY ${user.createdAt} DESC 
      LIMIT 500
    )`
  );

console.log("Deleted users:", deleteResult.rowCount);
 */
