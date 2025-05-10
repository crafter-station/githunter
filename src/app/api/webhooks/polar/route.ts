import { UpsertUserSubscription } from "@/core/services/upsert-user-subscription.service";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
	onSubscriptionActive: async (payload) => {
		new UpsertUserSubscription().exec({
			userId: payload.data.metadata.userId as string,
			polarCustomerId: payload.data.customerId,
			polarProductId: payload.data.productId,
			active: true, // TODO: check if this is really active
		});
	},
	onSubscriptionCanceled: async (payload) => {
		new UpsertUserSubscription().exec({
			userId: payload.data.metadata.userId as string,
			polarCustomerId: payload.data.customerId,
			polarProductId: payload.data.productId,
			active: false, // TODO: check if this is really active
		});
	},
});
