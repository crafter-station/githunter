"use server";

import { db } from "@/db";
import {
	type PersistentCurriculumVitae,
	type UserSelect,
	user as userTable,
} from "@/db/schema";
import { eq } from "drizzle-orm";

export async function findUserById(
	id: string,
): Promise<UserSelect | undefined> {
	return (await db.query.user.findFirst({
		where: eq(userTable.id, id),
	})) as UserSelect | undefined;
}

export async function updateUserCurriculumVitae({
	clerkUserId,
	curriculumVitae,
}: {
	clerkUserId: string;
	curriculumVitae: PersistentCurriculumVitae;
}): Promise<void> {
	await db
		.update(userTable)
		.set({ curriculumVitae, updatedAt: new Date() })
		.where(eq(userTable.clerkId, clerkUserId));
}
