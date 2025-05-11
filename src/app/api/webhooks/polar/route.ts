import { type User, clerkClient } from "@clerk/nextjs/server";
import { Webhooks } from "@polar-sh/nextjs";

export const POST = Webhooks({
	webhookSecret: process.env.POLAR_WEBHOOK_SECRET as string,
	onSubscriptionUpdated: async (payload) => {
		const polarCustomerId = payload.data.customerId;
		const polarProductId = payload.data.productId;
		const status = payload.data.status;

		const clerk = await clerkClient();

		let clerkId = payload.data.customer.externalId;
		let user: User | null = null;

		if (!clerkId) {
			const email = payload.data.customer.email;
			if (!email) {
				throw new Error("No email found for customer");
			}

			const users = await clerk.users.getUserList({
				emailAddress: [email],
			});

			if (users.totalCount === 0) {
				throw new Error("No user found with email");
			}

			// Use the first matching user's ID
			clerkId = users.data[0].id;
			user = users.data[0];
		} else {
			user = await clerk.users.getUser(clerkId);
		}

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
