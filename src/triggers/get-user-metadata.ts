import { RepoOfUserSchema } from "@/core/models/user";
import { UserMetadataExtractor } from "@/services/user-metadata-extractor";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const getUserMetadata = schemaTask({
	id: "get-user-metadata",
	schema: z.object({ username: z.string(), repos: RepoOfUserSchema.array() }),
	run: async ({ username, repos }) => {
		return new UserMetadataExtractor().extract(username, repos);
	},
});
