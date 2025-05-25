"use server";

import type { CurriculumVitae } from "@/db/schema";
import { findUserById, updateUserCurriculumVitae } from "./shared";

export async function updateCurriculumVitae(
	userId: string,
	curriculumVitae: CurriculumVitae,
): Promise<CurriculumVitae> {
	try {
		const user = await findUserById(userId);

		if (!user) {
			throw new Error("User not found");
		}

		await updateUserCurriculumVitae(userId, curriculumVitae);

		return curriculumVitae;
	} catch (error) {
		console.error("Error updating curriculum vitae:", error);
		throw new Error("Failed to update curriculum vitae", { cause: error });
	}
}
