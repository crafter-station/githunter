import { z } from "zod";

export const RepoOfUserSchema = z.object({
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

export const PinnedRepoOfUserSchema = z.object({
	fullName: z.string(),
	description: z.string().nullable(),
	stars: z.number(),
});

export const UserMetadata = z.object({
	roles: z.array(z.string()),
	about: z.string(),
	stack: z.array(z.string()),
});

export const UserSchema = z.object({
	id: z.string(),

	username: z.string(),
	fullname: z.string(),
	avatarUrl: z.string(),

	stars: z.number(),
	followers: z.number(),
	following: z.number(),
	repositories: z.number(),
	contributions: z.number(),

	country: z.string().optional().nullable(),
	city: z.string().optional().nullable(),

	website: z.string().optional().nullable(),
	twitter: z.string().optional().nullable(),
	linkedin: z.string().optional().nullable(),

	about: z.string().optional().nullable(),

	stack: z.array(z.string()),
	potentialRoles: z.array(z.string()),
	repos: z.array(RepoOfUserSchema),
	pinnedRepos: z.array(PinnedRepoOfUserSchema),
});

export type User = z.infer<typeof UserSchema>;
export type RepoOfUser = z.infer<typeof RepoOfUserSchema>;
export type PinnedRepoOfUser = z.infer<typeof PinnedRepoOfUserSchema>;
export type UserMetadata = z.infer<typeof UserMetadata>;
