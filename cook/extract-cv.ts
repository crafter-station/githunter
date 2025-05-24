import { extractCurriculumVitaeFromFile } from "@/services/curriculum-vitae-extractor";

// Test
if (require.main === module) {
	extractCurriculumVitaeFromFile("cueva.docx")
		.then((cv) => console.log("Extracted CV:", cv))
		.catch((error) => console.error("Error:", error));
}
