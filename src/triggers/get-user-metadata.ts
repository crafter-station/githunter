import { RecentRepoSchema } from "@/db/schema";
import { UserMetadataExtractor } from "@/services/user-metadata-extractor";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const getUserMetadata = schemaTask({
	id: "get-user-metadata",
	schema: z.object({
		username: z.string(),
		repos: RecentRepoSchema.array(),
	}),
	run: async ({ username, repos }) => {
		return new UserMetadataExtractor().extract(username, repos);
	},
});
