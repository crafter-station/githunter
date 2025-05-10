import { z } from "zod";

export const UserSubscriptionSchema = z.object({
	id: z.string(),

	polarCustomerId: z.string(),
	polarProductId: z.string(),

	userId: z.string(),
	subscriptionPlanId: z.string(),
	active: z.boolean(),
});

export type UserSubscription = z.infer<typeof UserSubscriptionSchema>;
