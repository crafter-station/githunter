import { db } from "@/db";
import {
	type UserSubscription,
	userSubscription as userSubscriptionTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export class UserSubscriptionRepository {
	public async insert(userSub: UserSubscription): Promise<void> {
		await db.insert(userSubscriptionTable).values({ ...userSub });
	}

	public async update(userSub: UserSubscription): Promise<void> {
		await db
			.update(userSubscriptionTable)
			.set({ ...userSub, id: userSub.id })
			.where(eq(userSubscriptionTable.id, userSub.id));
	}

	public async findByUserId(userId: string): Promise<UserSubscription | null> {
		const subscription = await db.query.userSubscription.findFirst({
			where: eq(userSubscriptionTable.userId, userId),
		});

		if (!subscription) {
			return null;
		}

		return subscription;
	}
}
