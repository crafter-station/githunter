import {
	pgTable,
	text,
	varchar,
	integer,
	timestamp,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
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

	country: text("country"),
	city: text("city"),

	// social links. can be extracted from their github profile
	website: text("website"),
	twitter: text("twitter"),
	linkedin: text("linkedin"),

	// about
	about: text("about"),

	// e.g.: [react, next, typescript, tailwind, node, express, postgres]
	stack: text("stack").array().default([]),

	// e.g.: [frontend engineer, frontend developer]
	potentialRoles: text("potential_roles").array().default([]),

	createdAt: timestamp("created_at").notNull().defaultNow(),
	updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
