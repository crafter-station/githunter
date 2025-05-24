import * as fs from "node:fs/promises";
import path from "node:path";
import { Mistral } from "@mistralai/mistralai";
import { responseFormatFromZodObject } from "@mistralai/mistralai/extra/structChat.js";
import axios from "axios";
import { z } from "zod";
import type { CurriculumVitae } from "../src/db/schema/user";

// this should not contain validations
const curriculumSchemaForAI = z.object({
	fullName: z.string(),
	email: z.string(),
	phone: z.string().optional(),
	location: z.string().optional(), // city, country
	linkedin: z.string().optional(),
	github: z.string().optional(),
	portfolio: z.string().optional(),

	summary: z.string().optional(),

	experience: z.array(
		z.object({
			title: z.string(),
			company: z.string(),
			location: z.string().optional(),
			startDate: z.string(), // ISO 8601 o "MMM YYYY"
			endDate: z.string().optional(), // "Present" o "MMM YYYY"
			descriptions: z.array(z.string()).optional(), // ej. as a list of bullet points
			keywords: z.array(z.string()).optional(), // ej. ['React', 'TypeScript']
		}),
	),

	education: z.array(
		z.object({
			degree: z.string(),
			institution: z.string(),
			location: z.string().optional(),
			graduationYear: z.string(),
		}),
	),

	skills: z.array(z.string()),

	certifications: z
		.array(
			z.object({
				name: z.string(),
				year: z.string(),
			}),
		)
		.optional(),

	projects: z
		.array(
			z.object({
				name: z.string(),
				description: z.string(),
				techStack: z.array(z.string()).optional(),
				link: z.string().optional(),
			}),
		)
		.optional(),
});

function createClient() {
	const apiKey = process.env.MISTRAL_API_KEY;
	if (!apiKey) {
		throw new Error("MISTRAL_API_KEY is not defined in environment variables");
	}
	return new Mistral({ apiKey });
}

async function getSignedPdfUrl(
	client: Mistral,
	pdfBuffer: Buffer,
): Promise<string> {
	const uploaded = await client.files.upload({
		file: { fileName: "document", content: pdfBuffer },
		purpose: "ocr",
	});
	const signed = await client.files.getSignedUrl({
		fileId: uploaded.id,
		expiry: 300,
	});
	if (!signed.url) throw new Error("Failed to obtain signed URL for PDF");
	return signed.url;
}

async function ocrProcess(
	client: Mistral,
	documentUrl: string,
): Promise<CurriculumVitae> {
	const result = await client.ocr.process({
		document: { documentUrl },
		model: "mistral-ocr-latest",
		includeImageBase64: false,
		documentAnnotationFormat: responseFormatFromZodObject(
			curriculumSchemaForAI,
		),
		imageLimit: 0, // to load docx
	});

	if (!result.documentAnnotation) {
		throw new Error("Failed to process OCR");
	}

	const obj = JSON.parse(result.documentAnnotation);

	return {
		fullName: obj.fullName,
		email: obj.email,
		phone: obj.phone,
		location: obj.location,
		linkedin: obj.linkedin,
		github: obj.github,
		portfolio: obj.portfolio,
		summary: obj.summary,
		experience: obj.experience,
		education: obj.education,
		skills: obj.skills,
		certifications: obj.certifications,
		projects: obj.projects,
	} as CurriculumVitae;
}

export async function extractCurriculumVitaeFromURL(
	pdfUrl: string,
): Promise<CurriculumVitae> {
	try {
		const client = createClient();
		return await ocrProcess(client, pdfUrl);
	} catch (error) {
		console.error("Error extracting CV from URL:", error);
		throw new Error("Failed to extract CV from URL", { cause: error });
	}

	async function downloadPdfBuffer(url: string): Promise<Buffer> {
		const response = await axios.get<ArrayBuffer>(url, {
			responseType: "arraybuffer",
		});
		return Buffer.from(response.data);
	}
}

export async function extractCurriculumVitaeFromFile(
	filePath: string,
): Promise<CurriculumVitae> {
	try {
		const client = createClient();
		const buffer = await pdfBuffer(filePath);
		const signedUrl = await getSignedPdfUrl(client, buffer);
		return await ocrProcess(client, signedUrl);
	} catch (error) {
		console.error("Error extracting CV from file:", error);
		throw new Error("Failed to extract CV from file", { cause: error });
	}

	async function pdfBuffer(pdfFilePath: string): Promise<Buffer> {
		const pdfFile = path.resolve(pdfFilePath);
		await fs.access(pdfFile);
		return await fs.readFile(pdfFile);
	}
}

// Test
if (require.main === module) {
	extractCurriculumVitaeFromFile("cueva.docx")
		.then((cv) => console.log("Extracted CV:", cv))
		.catch((error) => console.error("Error:", error));
}
