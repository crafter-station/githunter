import { openai } from "@ai-sdk/openai";
import { schemaTask } from "@trigger.dev/sdk/v3";
import { generateObject } from "ai";
import { z } from "zod";

import { AIGeneratedCurriculumVitaeSchema } from "@/db/schema/user/curriculum-vitae";

export const objectGenerationTask = schemaTask({
	id: "object-generation",
	schema: z.object({
		text: z.string(),
	}),
	run: async ({ text }) => {
		const result = await generateObject({
			model: openai("gpt-4.1-nano"),
			schema: AIGeneratedCurriculumVitaeSchema,
			prompt: `Extract the curriculum vitae from the following text: ${text}. 
      Generate a JSON object with the provided schema.
			The text provided is a curriculum vitae, so the object should be a curriculum vitae.`,
			experimental_telemetry: {
				isEnabled: true,
				functionId: "object-generation",
			},
		});

		if (!result.object) {
			throw new Error("Failed to generate object");
		}

		return result.object;
	},
});
