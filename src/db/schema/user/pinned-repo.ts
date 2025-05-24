import { z } from "zod";

export const PinnedRepoSchema = z.object({
	fullName: z.string(),
	description: z.string().nullable(),
	stars: z.number(),
});

export type PinnedRepo = z.infer<typeof PinnedRepoSchema>;
