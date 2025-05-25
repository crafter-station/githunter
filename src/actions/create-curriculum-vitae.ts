"use server";
import type { CurriculumVitae } from "@/db/schema";
import { extractCurriculumVitaeFromURL } from "@/services/curriculum-vitae-extractor";
import { findUserById, updateUserCurriculumVitae } from "./shared";

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
}
