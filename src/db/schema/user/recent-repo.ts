import { z } from "zod";

export const RecentRepoSchema = z.object({
	fullName: z.string(),
	description: z.string(),
	stars: z.number(),
	techStack: z.array(z.string()),
	contribution: z.object({
		issuesCount: z.number(),
		pullRequestsCount: z.number(),
		commitsCount: z.number(),
	}),
});

export type RecentRepo = z.infer<typeof RecentRepoSchema>;
