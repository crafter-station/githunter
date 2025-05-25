import { schemaTask } from "@trigger.dev/sdk/v3";
import { z } from "zod";

import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

export const ocrTask = schemaTask({
	id: "ocr",
	schema: z.object({
		fileUrl: z.string(),
	}),
	run: async ({ fileUrl }) => {
		const ocrResponse = await client.ocr.process({
			model: "mistral-ocr-latest",
			document: {
				type: "document_url",
				documentUrl: fileUrl,
			},
			includeImageBase64: false,
		});

		const text = ocrResponse.pages
			.toSorted((a, b) => a.index - b.index)
			.map((page) => page.markdown)
			.join("\n");

		return text;
	},
});
