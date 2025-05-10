import "dotenv/config";
import { Index } from "@upstash/vector";
import { db } from "../src/db";
import { user } from "../src/db/schema/user";
import type { UserSearchMetadata } from "../src/types";

// Check for required environment variables
if (
	!process.env.UPSTASH_VECTOR_REST_URL ||
	!process.env.UPSTASH_VECTOR_REST_TOKEN
) {
	console.error(
		"❌ Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN environment variables",
	);
	process.exit(1);
}

// Initialize Upstash Vector index
const index = new Index({
	url: process.env.UPSTASH_VECTOR_REST_URL,
	token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Define batch size for optimal performance (adjust based on testing)
const BATCH_SIZE = 100;

/**
 * Index all users in the database into Upstash Vector
 */
async function indexUsers() {
	try {
		console.log("🔄 Fetching all users from database...");
		const users = await db.select().from(user);
		console.log(`✅ Found ${users.length} users to index`);

		// Optional: Reset the index to start fresh
		console.log("🔄 Resetting vector index...");
		await index.reset();
		console.log("✅ Vector index reset complete");

		let successCount = 0;
		let errorCount = 0;
		let batch = [];

		console.log("🔄 Starting batch indexing...");

		// Process users in batches
		for (let i = 0; i < users.length; i++) {
			const userData = users[i];

			// Create metadata for search results
			const metadata: UserSearchMetadata = {
				username: userData.username,
				fullname: userData.fullname,
				avatarUrl: userData.avatarUrl,
				country: userData.country || undefined,
				field: "username", // Will be overridden
			};

			// Add username entry to batch
			batch.push({
				id: `user-username-${userData.id}`,
				data: userData.username,
				metadata: { ...metadata, field: "username" },
			});

			// Add fullname entry to batch
			batch.push({
				id: `user-fullname-${userData.id}`,
				data: userData.fullname,
				metadata: { ...metadata, field: "fullname" },
			});

			// When batch reaches BATCH_SIZE or we're at the last user, process it
			if (batch.length >= BATCH_SIZE || i === users.length - 1) {
				try {
					// Process the batch
					await index.upsert(batch);

					// Update success count
					successCount += batch.length;

					console.log(
						`✅ Indexed batch: ${successCount} records (${Math.ceil(successCount / 2)} users)`,
					);
				} catch (error) {
					console.error("❌ Failed to index batch:", error);
					errorCount += batch.length;
				}

				// Reset batch for next iteration
				batch = [];
			}
		}

		console.log(`
✅ Indexing complete:
- Total users: ${users.length}
- Total records: ${successCount}
- Errors: ${errorCount}
- Total batches: ${Math.ceil(successCount / BATCH_SIZE)}
- Average batch size: ${(successCount / Math.ceil(successCount / BATCH_SIZE)).toFixed(2)} records
		`);
	} catch (error) {
		console.error("❌ Failed to index users:", error);
		process.exit(1);
	}
}

// Execute the indexing function
indexUsers().catch(console.error);
