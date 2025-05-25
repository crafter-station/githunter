"use server";

import type { CurriculumVitae } from "@/db/schema/user";
import { extractCurriculumVitaeFromFile } from "@/services/curriculum-vitae-extractor";

interface ProcessCVState {
	error: string | null;
	success?: boolean;
	data?: CurriculumVitae;
	redirectUrl?: string;
}

export async function processCVAction(
	prevState: ProcessCVState,
	formData: FormData,
): Promise<ProcessCVState> {
	try {
		const file = formData.get("cv-file") as File;

		if (!file) {
			return {
				error: "No file provided",
			};
		}

		// Validate file type
		const allowedTypes = [
			"application/pdf",
			"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"application/msword",
		];

		if (!allowedTypes.includes(file.type)) {
			return {
				error: "Invalid file type. Please upload a PDF or Word document.",
			};
		}

		// Validate file size (10MB max)
		if (file.size > 10 * 1024 * 1024) {
			return {
				error: "File too large. Please upload a file smaller than 10MB.",
			};
		}

		// Save file temporarily
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Create a temporary file path
		const tempFilePath = `/tmp/cv-${Date.now()}-${file.name}`;
		const fs = await import("node:fs/promises");
		await fs.writeFile(tempFilePath, buffer);

		try {
			// Extract CV data using the existing function
			const cvData = await extractCurriculumVitaeFromFile(tempFilePath);

			// Clean up temporary file
			await fs.unlink(tempFilePath);

			// Generate a unique identifier for this CV processing session
			const sessionId = `cv-${Date.now()}`;

			return {
				error: null,
				success: true,
				data: cvData,
				redirectUrl: `/cv/edit/${encodeURIComponent(file.name.split(".")[0])}?session=${sessionId}&extracted=true`,
			};
		} catch (extractError) {
			// Clean up temporary file even on error
			try {
				await fs.unlink(tempFilePath);
			} catch {
				// Ignore cleanup errors
			}

			throw extractError;
		}
	} catch (error) {
		console.error("Error processing CV:", error);
		return {
			error: error instanceof Error ? error.message : "Failed to process CV",
		};
	}
}
