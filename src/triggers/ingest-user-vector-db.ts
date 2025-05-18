import { vector } from "@/vector";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

export const ingestUserToVectorDb = schemaTask({
	id: "ingest-user-vector-db",
	schema: z.object({
		id: z.string(),
		username: z.string(),
		fullname: z.string(),
		avatarUrl: z.string(),
		country: z.string().nullish(),
	}),
	run: async ({ id, username, fullname, avatarUrl, country }) => {
		await vector.upsert([
			{
				id: `user-username-${id}`,
				data: username,
				metadata: {
					username,
					fullname,
					avatarUrl,
					country,
					field: "username",
				},
			},
			{
				id: `user-fullname-${id}`,
				data: fullname,
				metadata: {
					username,
					fullname,
					avatarUrl,
					country,
					field: "fullname",
				},
			},
		]);
	},
});
