import { SubscriptionPlanRepository } from "@/core/repositories/subscription-plan-repository";
import { PolarService } from "@/services/polar-service";
import { nanoid } from "nanoid";

async function main() {
	const polarService = new PolarService();
	const subPlanRepo = new SubscriptionPlanRepository();

	const plans = [
		{ name: "starter", description: "starter plan", amount: 500 },
		{ name: "pro", description: "pro plan", amount: 2900 },
		{ name: "enterprise", description: "enterprise plan", amount: 9900 },
	];

	const plansToInsert = [];
	for (const plan of plans) {
		const existing = await subPlanRepo.findByName(plan.name);
		if (!existing) {
			plansToInsert.push(plan);
		}
	}

	if (plansToInsert.length === 0) {
		console.log("there is no plans to insert");
		return;
	}

	const createdPlans = await polarService.createPlans(plansToInsert);

	for (const createdPlan of createdPlans) {
		const plan = {
			id: nanoid(),
			name: createdPlan.config.name,
			currency: "usd",
			amount: createdPlan.config.amount,
			polarProductId: createdPlan.productId,
			polarPriceId: createdPlan.priceId,
			isSandbox: subPlanRepo.isSandbox,
		};
		await subPlanRepo.insert(plan);
		console.log(plan);
	}
}

main();
