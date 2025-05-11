import { useUser } from "@clerk/nextjs";
import React from "react";

import { PRICING_PLANS } from "../constants";

export function useSubscription() {
	const { user } = useUser();

	const currentPlan = React.useMemo(() => {
		if (user?.publicMetadata.subscriptionStatus === "active") {
			return (
				PRICING_PLANS.find(
					(plan) => plan.id === user?.publicMetadata.subscriptionPlanId,
				) || null
			);
		}

		return null;
	}, [user]);

	return {
		currentPlan,
	};
}
