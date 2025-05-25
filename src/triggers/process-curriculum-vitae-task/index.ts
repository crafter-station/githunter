import { metadata, schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";
import { extractCurriculumVitaeTask } from "./extract-curriculum-vitae-task";
import { storeCurriculumVitaeTask } from "./store-curriculum-vitae-task";

export const processCurriculumVitaeTask = schemaTask({
	id: "process-curriculum-vitae",
	schema: z.object({
		clerkUserId: z.string(),
		fileUrl: z.string().url(),
	}),
	run: async ({ clerkUserId, fileUrl }) => {
		// Set initial progress
		metadata.set("progress", "ocr");

		const extractCurriculumVitaeRun =
			await extractCurriculumVitaeTask.triggerAndWait({
				fileUrl,
			});

		if (!extractCurriculumVitaeRun.ok) {
			throw new Error("Failed to extract curriculum vitae");
		}

		const cv = extractCurriculumVitaeRun.output;

		// Update progress to object generation
		metadata.set("progress", "object_generation");

		await storeCurriculumVitaeTask.trigger({
			clerkUserId,
			aiGeneratedCurriculumVitae: cv,
		});

		// Update progress to store curriculum vitae
		metadata.set("progress", "store_curriculum_vitae");

		// Set final progress
		metadata.set("progress", "completed");
	},
});
