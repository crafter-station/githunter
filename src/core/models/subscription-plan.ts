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
