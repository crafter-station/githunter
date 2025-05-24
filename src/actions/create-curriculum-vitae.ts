"use server";

import { db } from "@/db";
import {
	type CurriculumVitae,
	type UserSelect,
	user as userTable,
} from "@/db/schema";
import { extractCurriculumVitaeFromURL } from "@/services/curriculum-vitae-extractor";
import { eq } from "drizzle-orm";

export async function createCurriculumVitae(
	userId: string,
	curriculumVitaeUrl: string,
): Promise<CurriculumVitae> {
	try {
		validateUrlFormat(curriculumVitaeUrl);
		await ensureUrlIsFetchable(curriculumVitaeUrl);

		const curriculumVitae =
			await extractCurriculumVitaeFromURL(curriculumVitaeUrl);
		const user = await findUserById(userId);

		if (!user) {
			throw new Error("User not found");
		}

		await updateUserCurriculumVitae(userId, curriculumVitae);

		return curriculumVitae;
	} catch (error) {
		console.error("Error creating curriculum vitae:", error);
		throw new Error("Failed to create curriculum vitae", { cause: error });
	}

	function validateUrlFormat(urlString: string): void {
		try {
			new URL(urlString);
		} catch {
			throw new Error("Invalid URL format");
		}
	}

	async function ensureUrlIsFetchable(urlString: string): Promise<void> {
		const response = await fetch(urlString, { method: "HEAD" });
		if (!response.ok) {
			throw new Error(`URL not reachable: HTTP ${response.status}`);
		}
	}

	async function findUserById(id: string): Promise<UserSelect | undefined> {
		return (await db.query.user.findFirst({
			where: eq(userTable.id, id),
		})) as UserSelect | undefined;
	}

	async function updateUserCurriculumVitae(
		id: string,
		curriculumVitae: CurriculumVitae,
	): Promise<void> {
		await db
			.update(userTable)
			.set({ curriculumVitae, updatedAt: new Date() })
			.where(eq(userTable.id, id));
	}
}
