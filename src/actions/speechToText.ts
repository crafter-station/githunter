"use server";

import { ElevenLabsClient } from "elevenlabs";

export async function speechToText(audioBlob: Blob) {
	try {
		const client = new ElevenLabsClient({
			apiKey: process.env.ELEVENLABS_API_KEY,
		});

		const buffer = Buffer.from(await audioBlob.arrayBuffer());
		const blob = new Blob([buffer], { type: "audio/wav" });

		const response = await client.speechToText.convert({
			file: blob,
			model_id: "scribe_v1",
		});

		return {
			success: true,
			text: response.text,
		};
	} catch (error) {
		console.error("Speech-to-text error:", error);
		return {
			success: false,
			error: "Failed to convert speech to text",
		};
	}
}
