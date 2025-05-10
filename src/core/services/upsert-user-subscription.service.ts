import { clerkClient } from "@clerk/nextjs/server";
import { nanoid } from "nanoid";

import type { UserSubscription } from "@/core/models/user-subscription";
import { SubscriptionPlanRepository } from "@/core/repositories/subscription-plan-repository";
import { UserRepository } from "@/core/repositories/user-repository";
import { UserSubscriptionRepository } from "@/core/repositories/user-subscription-repository";
export class UpsertUserSubscription {
	private subscriptionPlanRepository: SubscriptionPlanRepository;
	private userSubscriptionRepository: UserSubscriptionRepository;
	private userRepository: UserRepository;

	constructor() {
		this.subscriptionPlanRepository = new SubscriptionPlanRepository();
		this.userSubscriptionRepository = new UserSubscriptionRepository();
		this.userRepository = new UserRepository();
	}

	public async exec(data: {
		userId: string;
		polarProductId: string;
		polarCustomerId: string;
		active: boolean;
	}) {
		const plan = await this.subscriptionPlanRepository.findByPolarProductId(
			data.polarProductId,
		);

		if (!plan) {
			throw new Error(
				`plan not found for polarProductId ${data.polarProductId}`,
			);
		}

		const user = await this.userRepository.findById(data.userId);

		if (!user) {
			throw new Error(`user not found for userId ${data.userId}`);
		}

		if (!user.clerkId) {
			throw new Error(`user has no clerkId for userId ${data.userId}`);
		}

		const subscription: UserSubscription = {
			id: nanoid(),
			polarCustomerId: data.polarCustomerId,
			polarProductId: data.polarProductId,
			userId: user.id,
			subscriptionPlanId: plan.id,
			active: data.active,
		};

		const currentSubscription =
			await this.userSubscriptionRepository.findByUserId(data.userId);

		if (!currentSubscription) {
			return await this.userSubscriptionRepository.insert(subscription);
		}

		const client = await clerkClient();

		await client.users.updateUserMetadata(user.clerkId, {
			publicMetadata: {
				subscriptionPlanId: plan.id,
				subscriptionStatus: data.active ? "active" : "inactive",
			},
			privateMetadata: {
				polarCustomerId: data.polarCustomerId,
			},
		});

		subscription.id = currentSubscription.id;
		return await this.userSubscriptionRepository.update(subscription);
	}
}
