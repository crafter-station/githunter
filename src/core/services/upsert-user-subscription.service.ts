import type { UserSubscription } from "@/core/models/user-subscription";
import { SubscriptionPlanRepository } from "@/core/repositories/subscription-plan-repository";
import { UserSubscriptionRepository } from "@/core/repositories/user-subscription-repository";
import { nanoid } from "nanoid";

export class UpsertUserSubscription {
	private subscriptionPlanRepository: SubscriptionPlanRepository;
	private userSubscriptionRepository: UserSubscriptionRepository;

	constructor() {
		this.subscriptionPlanRepository = new SubscriptionPlanRepository();
		this.userSubscriptionRepository = new UserSubscriptionRepository();
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

		const subscription: UserSubscription = {
			id: nanoid(),
			polarCustomerId: data.polarCustomerId,
			polarProductId: data.polarProductId,
			userId: data.userId,
			subscriptionPlanId: plan.id,
			active: data.active,
		};

		const currentSubscription =
			await this.userSubscriptionRepository.findByUserId(data.userId);

		if (!currentSubscription) {
			return await this.userSubscriptionRepository.insert(subscription);
		}

		subscription.id = currentSubscription.id;
		return await this.userSubscriptionRepository.update(subscription);
	}
}
