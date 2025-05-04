import { z } from "zod";

export const RepoOfUserSchema = z.object({
	fullName: z.string(),
	description: z.string(),
	stars: z.number(),
	techStack: z.array(z.string()),
});

export const UserMetadata = z.object({
	roles: z.array(z.string()),
	about: z.string(),
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

	stack: z.array(z.string()).nullable(),
	potentialRoles: z.array(z.string()).nullable(),

	repos: z.array(RepoOfUserSchema).nullable(),
});

export type User = z.infer<typeof UserSchema>;
export type RepoOfUser = z.infer<typeof RepoOfUserSchema>;
export type UserMetadata = z.infer<typeof UserMetadata>;
