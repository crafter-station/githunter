import { boolean, index, integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

export const SubscriptionPlanSchema = z.object({
	id: z.string(),
	name: z.string(),
	currency: z.string(),
	amount: z.number(), // in cents
	polarProductId: z.string(),
	polarPriceId: z.string(),
	isSandbox: z.boolean(),
});

export type SubscriptionPlan = z.infer<typeof SubscriptionPlanSchema>;

export const UserSubscriptionSchema = z.object({
	id: z.string(),
	polarCustomerId: z.string(),
	polarProductId: z.string(),
	userId: z.string(),
	subscriptionPlanId: z.string(),
	active: z.boolean(),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;

export const subscriptionPlan = pgTable(
	"subscription_plan",
	{
		id: varchar("id").primaryKey(),
		name: varchar("name").notNull(),
		currency: varchar("currency").notNull(),
		amount: integer("amount").notNull(),
		polarProductId: varchar("polar_product_id").notNull(),
		polarPriceId: varchar("polar_price_id").notNull(),
		isSandbox: boolean("is_sandbox").notNull().default(false),
	},
	(table) => [
		index("subscription_plan_product_idx").on(table.polarProductId),
		index("subscription_plan_price_idx").on(table.polarPriceId),
		index("subscription_plan_sandbox_idx").on(table.isSandbox),
	],
);

export type SubscriptionPlanSelect = typeof subscriptionPlan.$inferSelect;

export const userSubscription = pgTable(
	"user_subscription",
	{
		id: varchar("id").primaryKey(),
		polarCustomerId: varchar("polar_customer_id").notNull(),
		polarProductId: varchar("polar_product_id").notNull(),
		userId: varchar("user_id").notNull(),
		subscriptionPlanId: varchar("subscription_plan_id").notNull(),
		active: boolean("active").notNull().default(true),
	},
	(table) => [
		index("user_subscription_user_idx").on(table.userId),
		index("user_subscription_plan_idx").on(table.subscriptionPlanId),
		index("user_subscription_active_idx").on(table.active),
	],
);

export type UserSubscriptionSelect = typeof userSubscription.$inferSelect;
