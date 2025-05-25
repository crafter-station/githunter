"use server";

import {
	type PersistentCurriculumVitae,
	PersistentCurriculumVitaeSchema,
} from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { updateUserCurriculumVitae } from "./shared";

export type UpdateCurriculumVitaeActionState =
	| {
			ok: false;
			error: string;
	  }
	| {
			ok: true;
			curriculumVitae: PersistentCurriculumVitae;
			updatedAt: string; // ISO string
	  };

export async function updateCurriculumVitaeAction(
	currentState: UpdateCurriculumVitaeActionState | undefined,
	formData: FormData,
): Promise<UpdateCurriculumVitaeActionState> {
	try {
		const curriculumVitaeResult = PersistentCurriculumVitaeSchema.safeParse(
			JSON.parse(formData.get("curriculumVitae") as string),
		);

		if (!curriculumVitaeResult.success) {
			console.error("Invalid curriculum vitae", curriculumVitaeResult.error);
			return { ok: false, error: "Invalid curriculum vitae" };
		}

		const session = await auth();

		if (!session.userId) {
			return {
				ok: false,
				error: "Please sign in to update your curriculum vitae",
			};
		}

		await updateUserCurriculumVitae(session.userId, curriculumVitaeResult.data);

		return {
			ok: true,
			curriculumVitae: curriculumVitaeResult.data,
			updatedAt: new Date().toISOString(),
		};
	} catch (error) {
		console.error("Error updating curriculum vitae:", error);
		return { ok: false, error: "Failed to update curriculum vitae" };
	}
}
