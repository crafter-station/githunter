import { db } from "@/db";
import { subscriptionPlan as subscriptionPlanTable } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { SubscriptionPlan } from "../models/subscription-plan";

export class SubscriptionPlanRepository {
	public readonly isSandbox: boolean;

	constructor() {
		this.isSandbox = process.env.POLAR_SERVER === "sandbox";
	}

	public async insert(subPlan: SubscriptionPlan): Promise<void> {
		await db.insert(subscriptionPlanTable).values({ ...subPlan });
	}

	public async findById(id: string): Promise<SubscriptionPlan | null> {
		const plan = await db.query.subscriptionPlan.findFirst({
			where: and(
				eq(subscriptionPlanTable.isSandbox, this.isSandbox),
				eq(subscriptionPlanTable.id, id),
			),
		});

		if (!plan) {
			return null;
		}

		return plan;
	}

	public async findByName(name: string): Promise<SubscriptionPlan | null> {
		const plan = await db.query.subscriptionPlan.findFirst({
			where: and(
				eq(subscriptionPlanTable.isSandbox, this.isSandbox),
				eq(subscriptionPlanTable.name, name),
			),
		});

		if (!plan) {
			return null;
		}

		return plan;
	}

	public async findByPolarProductId(
		polarProductId: string,
	): Promise<SubscriptionPlan | null> {
		const plan = await db.query.subscriptionPlan.findFirst({
			where: and(
				eq(subscriptionPlanTable.isSandbox, this.isSandbox),
				eq(subscriptionPlanTable.polarProductId, polarProductId),
			),
		});

		if (!plan) {
			return null;
		}

		return plan;
	}
}
