import * as fs from "node:fs/promises";
import path from "node:path";
import { Mistral } from "@mistralai/mistralai";

const apiKey = process.env.MISTRAL_API_KEY;
const client = new Mistral({ apiKey: apiKey });

async function extractPdfTextToJson(
	pdfFilePath: string,
): Promise<string | null> {
	try {
		const pdfFile = path.resolve(pdfFilePath);

		// Verify PDF file exists
		try {
			await fs.access(pdfFile);
		} catch (error) {
			console.error(`Error: PDF file not found at ${pdfFile}`);
			return null;
		}

		// Read PDF file content as bytes (Buffer in Node.js)
		const pdfContent = await fs.readFile(pdfFile);

		// Upload PDF file to Mistral's OCR service (adjust payload based on actual API)
		const uploadedFile = await client.files.upload({
			file: {
				fileName: path.basename(pdfFile, path.extname(pdfFile)),
				content: pdfContent,
			},
			purpose: "ocr",
		});

		// Get URL for the uploaded file
		const signedUrlResponse = await client.files.getSignedUrl({
			fileId: uploadedFile.id,
			expiry: 1, // Expiry in seconds (adjust as needed)
		});

		if (!signedUrlResponse?.url) {
			console.error("Error: Failed to get signed URL for the uploaded file.");
			return null;
		}

		// Process PDF with OCR, including embedded images (adjust payload based on actual API)
		const pdfResponse = await client.ocr.process({
			document: {
				documentUrl: signedUrlResponse.url,
			},
			model: "mistral-ocr-latest",
			includeImageBase64: true,
		});

		// Convert response to JSON format
		const responseDict = JSON.parse(JSON.stringify(pdfResponse)); // Simple way to convert the response object to a plain JavaScript object

		// Return the JSON string
		return JSON.stringify(responseDict, null, 4);
	} catch (error) {
		console.error("Error during PDF OCR:", error);
		return null;
	}
}

// Example usage:
const pdfFilePath = "Profile.pdf"; // Replace with the actual path to your PDF file

extractPdfTextToJson(pdfFilePath)
	.then((jsonOutput) => {
		if (jsonOutput) {
			console.log(jsonOutput.substring(0, 1000)); // Check the first 1000 characters
		} else {
			console.log("Failed to extract text from PDF.");
		}
	})
	.catch((error) => {
		console.error("An unexpected error occurred:", error);
	});
