import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { objectGenerationTask } from "./object-generation-task";
import { ocrTask } from "./ocr-task";

export const extractCurriculumVitaeTask = schemaTask({
	id: "extract-curriculum-vitae",
	schema: z.object({
		fileUrl: z.string(),
	}),
	run: async ({ fileUrl }) => {
		const ocrRun = await ocrTask.triggerAndWait({
			fileUrl,
		});

		if (!ocrRun.ok) {
			throw new Error("Failed to process OCR");
		}

		const objectGenerationRun = await objectGenerationTask.triggerAndWait({
			text: ocrRun.output,
		});

		if (!objectGenerationRun.ok) {
			throw new Error("Failed to generate object");
		}

		return objectGenerationRun.output;
	},
});
