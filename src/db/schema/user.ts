import { sql } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

export const repoSchema = z.object({
	fullName: z.string(),
	description: z.string(),
	stars: z.number(),
	techStack: z.array(z.string()),
});

export type Repo = z.infer<typeof repoSchema>;

export const user = pgTable(
	"user",
	{
		// custom alphabet nanoid
		id: varchar("id").primaryKey(),

		// if the user is not logged in, the clerk id is not available,
		// but it's ok, as we will prepopulate the database
		clerkId: varchar("clerk_id").unique(),

		username: varchar("username").notNull(),
		fullname: varchar("fullname").notNull(),
		email: varchar("email"),
		avatarUrl: text("avatar_url").notNull(),

		stars: integer("stars").notNull().default(0),
		followers: integer("followers").notNull().default(0),
		following: integer("following").notNull().default(0),
		repositories: integer("repositories").notNull().default(0),
		contributions: integer("contributions").notNull().default(0),

		country: text("country"),
		city: text("city"),

		// social links. can be extracted from their github profile
		website: text("website"),
		twitter: text("twitter"),
		linkedin: text("linkedin"),

		// about
		about: text("about"),

		// e.g.: [react, next, typescript, tailwind, node, express, postgres]
		stack: text("stack").array().notNull().default(sql`ARRAY[]::text[]`),

		// e.g.: [frontend engineer, frontend developer]
		potentialRoles: text("potential_roles")
			.array()
			.notNull()
			.default(sql`ARRAY[]::text[]`),

		createdAt: timestamp("created_at").notNull().defaultNow(),
		updatedAt: timestamp("updated_at").notNull().defaultNow(),

		repos: jsonb("repos").array().default([]).$type<Repo[]>(),
	},
	(table) => [
		// Individual column indexes - use GIN for arrays, B-tree for regular columns
		index("roles_idx").using("gin", table.potentialRoles),
		index("stack_idx").using("gin", table.stack),
		index("city_idx").on(table.city),
		index("country_idx").on(table.country),
		index("contributions_idx").on(table.contributions),

		// Specialized indexes for common query combinations

		// For combinations with array columns, we need separate indexes
		// These index the array columns with GIN for array operations
		index("roles_only_gin_idx").using("gin", table.potentialRoles),
		index("stack_only_gin_idx").using("gin", table.stack),

		// B-tree indexes for exact matching on regular columns
		index("city_country_idx").on(table.city, table.country),

		// For jsonb, GIN is appropriate
		index("repos_gin_idx").using("gin", table.repos),

		// Additional indexes for other important fields
		index("username_idx").on(table.username),
		index("stars_idx").on(table.stars),
		index("followers_idx").on(table.followers),
		index("repositories_idx").on(table.repositories),

		// Composite indexes for common sorting/filtering patterns
		index("stars_contributions_idx").on(table.stars, table.contributions),
		index("followers_stars_idx").on(table.followers, table.stars),

		// Index for email lookups
		index("email_idx").on(table.email),
	],
);

export type UserSelect = typeof user.$inferSelect;
