import { getSubscription } from "@/lib/get-suscription";
import { ElevenLabsClient, ElevenLabsError } from "elevenlabs";
import type { NextRequest } from "next/server";

export const maxDuration = 60;

export async function POST(request: NextRequest) {
	try {
		const { text } = await request.json();

		if (!text) {
			return new Response("No text provided", { status: 400 });
		}

		const currentPlan = await getSubscription();

		if (!currentPlan) {
			return new Response("No subscription found", { status: 400 });
		}

		if (currentPlan.name === "Free") {
			return new Response("Free plan not allowed", { status: 400 });
		}

		// Inicializar el cliente de ElevenLabs
		const client = new ElevenLabsClient({
			apiKey: process.env.ELEVENLABS_API_KEY,
		});

		// Convertir el texto a audio usando el modelo multilingual
		// Usa la voz "Adam" (ID: JBFqnCBsd6RMkjVDRZzb) que funciona bien para este caso
		const audioStream = await client.textToSpeech.convert(
			"JBFqnCBsd6RMkjVDRZzb",
			{
				text,
				model_id: "eleven_multilingual_v2",
				output_format: "mp3_44100_128",
			},
		);

		// Collect chunks from the readable stream
		const chunks: Buffer[] = [];
		for await (const chunk of audioStream) {
			chunks.push(Buffer.from(chunk));
		}

		// Combine chunks into a single buffer and convert to base64
		const audioBuffer = Buffer.concat(chunks);
		const base64Audio = audioBuffer.toString("base64");

		// Devolver el audio como respuesta
		return new Response(base64Audio, {
			headers: {
				"Content-Type": "audio/mpeg",
				"Content-Length": audioBuffer.byteLength.toString(),
			},
		});
	} catch (error) {
		if (error instanceof ElevenLabsError) {
			console.log(error.name);
			console.log(error.message);
		}
		console.log(error);
		return new Response("Failed to generate audio", { status: 500 });
	}
}
