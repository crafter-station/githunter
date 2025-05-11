import { currentUser } from "@clerk/nextjs/server";
import { PRICING_PLANS } from "./constants";

export async function getSubscription() {
	const user = await currentUser();

	if (!user) {
		return null;
	}

	if (user.publicMetadata.subscriptionStatus !== "active") {
		return null;
	}

	const currentPlan = PRICING_PLANS.find(
		(plan) => plan.id === user.publicMetadata.subscriptionPlanId,
	);

	return currentPlan;
}
