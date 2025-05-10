import { PolarService } from "@/services/polar-service";
import { SubscriptionPlanRepository } from "../repositories/subscription-plan-repository";
import { UserRepository } from "../repositories/user-repository";

export class CreateCheckout {
	private polarService: PolarService;
	private subscriptionPlanRepository: SubscriptionPlanRepository;
	private userRepository: UserRepository;

	constructor() {
		this.polarService = new PolarService();
		this.subscriptionPlanRepository = new SubscriptionPlanRepository();
		this.userRepository = new UserRepository();
	}

	public async exec(userId: string, subscriptionPlanId: string) {
		const plan =
			await this.subscriptionPlanRepository.findById(subscriptionPlanId);
		if (!plan) {
			throw new Error(`plan not found for the given id ${subscriptionPlanId}`);
		}

		const user = await this.userRepository.findById(userId);
		if (!plan) {
			throw new Error(`user not found for the given id ${userId}`);
		}

		return await this.polarService.createCheckout(plan.polarProductId, userId);
	}
}
