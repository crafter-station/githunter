import { clerkClient } from "@clerk/nextjs/server";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
	onSubscriptionUpdated: async (payload) => {
		const polarCustomerId = payload.data.customerId;
		const polarProductId = payload.data.productId;
		const status = payload.data.status;

		const clerkId = payload.data.customer.externalId;

		if (!clerkId) {
			throw new Error("Clerk ID not found");
		}

		const clerk = await clerkClient();
		const user = await clerk.users.getUser(clerkId);

		if (!user) {
			throw new Error("User not found in Clerk");
		}

		await clerk.users.updateUserMetadata(user.id, {
			privateMetadata: {
				polarCustomerId,
			},
			publicMetadata: {
				subscriptionPlanId: polarProductId,
				subscriptionStatus: status,
			},
		});
	},
});
