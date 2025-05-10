import "dotenv/config";
import { Index } from "@upstash/vector";

// Check for required environment variables
if (
	!process.env.UPSTASH_VECTOR_REST_URL ||
	!process.env.UPSTASH_VECTOR_REST_TOKEN
) {
	console.error(
		"❌ Missing UPSTASH_VECTOR_REST_URL or UPSTASH_VECTOR_REST_TOKEN environment variables",
	);
	process.exit(1);
}

// Initialize Upstash Vector index
const index = new Index({
	url: process.env.UPSTASH_VECTOR_REST_URL,
	token: process.env.UPSTASH_VECTOR_REST_TOKEN,
});

// Define batch size for optimal performance
const BATCH_SIZE = 500;

/**
 * Generate search query combinations optimized for autocomplete
 * @returns Array of search queries
 */
function generateSearchQueries() {
	// Core roles in both English and Spanish
	const roles = [
		// English core roles
		"frontend developer",
		"backend developer",
		"fullstack developer",
		"frontend engineer",
		"backend engineer",
		"fullstack engineer",
		"software developer",
		"software engineer",
		"web developer",
		"web dev",
		"react developer",
		"vue developer",
		"angular developer",
		"next.js developer",
		"react engineer",
		"next.js engineer",
		"product designer",
		"product engineer",
		"design engineer",
		"mobile developer",
		"devops engineer",
		"cloud engineer",
		"data engineer",
		"machine learning engineer",
		"ai engineer",
		"prompt engineer",
		"game dev",
		"senior developer",
		"junior developer",
		"tech lead",

		// Spanish core roles
		"desarrollador frontend",
		"desarrollador backend",
		"desarrollador fullstack",
		"ingeniero frontend",
		"ingeniero backend",
		"ingeniero fullstack",
		"desarrollador de software",
		"ingeniero de software",
		"desarrollador web",
		"programador web",
		"desarrollador de react",
		"desarrollador de vue",
		"desarrollador de angular",
		"desarrollador de next.js",
		"ingeniero de react",
		"ingeniero de next.js",
		"diseñador de producto",
		"ingeniero de producto",
		"ingeniero de diseño",
		"desarrollador móvil",
		"ingeniero devops",
		"ingeniero de nube",
		"ingeniero de datos",
		"ingeniero de machine learning",
		"ingeniero de ia",
		"ingeniero de prompts",
		"desarrollador de juegos",
		"desarrollador senior",
		"desarrollador junior",
		"líder técnico",
	];

	// Locations - keeping limited to avoid explosion of combinations
	const locations = [
		"remote",
		"New York",
		"San Francisco",
		"London",
		"Berlin",
		"Madrid",
		"Mexico City",
		"remoto",
		"Nueva York",
		"San Francisco",
		"Londres",
		"Berlín",
		"Madrid",
		"Ciudad de México",
	];

	// Tech stacks - selected most popular
	const techStacks = [
		"react",
		"vue",
		"angular",
		"nextjs",
		"typescript",
		"javascript",
		"node",
		"python",
		"django",
		"flask",
		"ruby",
		"rails",
		"php",
		"laravel",
		"java",
		"spring",
		"golang",
		"rust",
		"aws",
		"azure",
		"gcp",
		"kubernetes",
		"docker",
		"graphql",
		"rest",
		"mongodb",
		"postgresql",
		"mysql",
		"redis",
		"firebase",
		"supabase",
		"tailwindcss",
		"threejs",
		"bun",
		"pnpm",
		"anthropic",
		"openai",
		"elevenlabs",
		"upstash",
		"vercel",
		"netlify",
	];

	// Metrics for filtering
	const metrics = [
		"stars",
		"repositories",
		"repos",
		"followers",
		"contributions",
		"estrellas",
		"repositorios",
		"repos",
		"seguidores",
		"contribuciones",
	];

	// Arrays to collect our queries
	let searchQueries: string[] = [];

	// --- 1. BASIC ROLE QUERIES ---
	// These are the foundational autocomplete suggestions
	searchQueries = [...searchQueries, ...roles];

	// --- 2. ROLE + LOCATION COMBINATIONS ---
	// e.g. "frontend developer in San Francisco", "desarrollador frontend en Madrid"
	for (const role of roles) {
		for (const location of locations) {
			// English pattern
			if (role.match(/developer|engineer|designer|lead|senior|junior/)) {
				searchQueries.push(`${role} in ${location}`);
				searchQueries.push(`${role} from ${location}`);
			}

			// Spanish pattern
			if (role.match(/desarrollador|ingeniero|diseñador|líder|senior|junior/)) {
				searchQueries.push(`${role} en ${location}`);
				searchQueries.push(`${role} de ${location}`);
			}
		}
	}

	// --- 3. ROLE + TECH COMBINATIONS ---
	// e.g. "react developer", "desarrollador de python"
	for (const role of roles) {
		for (const tech of techStacks) {
			// For English roles, add "with X experience"
			if (role.match(/developer|engineer|designer|lead|senior|junior/)) {
				searchQueries.push(`${role} with ${tech} experience`);
				searchQueries.push(`${role} using ${tech}`);
				searchQueries.push(`${role} skilled in ${tech}`);

				// Add for some common roles technology-specific roles like "react developer"
				if (
					role === "frontend developer" ||
					role === "backend developer" ||
					role === "fullstack developer" ||
					role === "software developer" ||
					role === "web developer" ||
					role === "web dev"
				) {
					searchQueries.push(`${tech} developer`);
					searchQueries.push(`${tech} engineer`);
				}
			}

			// For Spanish roles, add "con experiencia en X"
			if (role.match(/desarrollador|ingeniero|diseñador|líder|senior|junior/)) {
				searchQueries.push(`${role} con experiencia en ${tech}`);
				searchQueries.push(`${role} usando ${tech}`);
				searchQueries.push(`${role} especializado en ${tech}`);

				// Add technology-specific roles in Spanish
				if (
					role === "desarrollador frontend" ||
					role === "desarrollador backend" ||
					role === "desarrollador fullstack" ||
					role === "desarrollador de software" ||
					role === "desarrollador web" ||
					role === "programador web"
				) {
					searchQueries.push(`desarrollador de ${tech}`);
					searchQueries.push(`ingeniero de ${tech}`);
				}
			}
		}
	}

	// --- 4. ROLE + METRIC COMBINATIONS ---
	// e.g. "frontend developer with 100+ stars", "desarrollador con 500+ repos"
	const numbers = ["10", "50", "100", "200", "500", "1000"];

	for (const role of roles) {
		for (const metric of metrics) {
			for (const number of numbers) {
				// English pattern
				if (
					role.match(/developer|engineer|designer|lead|senior|junior/) &&
					!metric.match(/estrellas|repositorios|seguidores|contribuciones/)
				) {
					searchQueries.push(`${role} with ${number}+ ${metric}`);
					searchQueries.push(`${role} with more than ${number} ${metric}`);
				}

				// Spanish pattern
				if (
					role.match(/desarrollador|ingeniero|diseñador|líder|senior|junior/) &&
					!metric.match(/stars|repositories|repos|followers|contributions/)
				) {
					searchQueries.push(`${role} con ${number}+ ${metric}`);
					searchQueries.push(`${role} con más de ${number} ${metric}`);
				}
			}
		}
	}

	// --- 5. ROLE + TECH + LOCATION ---
	// Limited selection to avoid combinatorial explosion
	const topRoles = [
		"frontend developer",
		"backend developer",
		"fullstack developer",
		"desarrollador frontend",
		"desarrollador backend",
		"desarrollador fullstack",
	];
	const topTech = ["react", "typescript", "python", "nodejs", "aws"];
	const topLocations = ["remote", "remoto", "New York", "San Francisco"];

	for (const role of topRoles) {
		for (const tech of topTech) {
			for (const location of topLocations) {
				// English pattern
				if (role.match(/developer|engineer/)) {
					searchQueries.push(`${role} with ${tech} experience in ${location}`);
				}

				// Spanish pattern
				if (role.match(/desarrollador|ingeniero/)) {
					searchQueries.push(
						`${role} con experiencia en ${tech} en ${location}`,
					);
				}
			}
		}
	}

	// --- 6. SPECIFIC CULTURAL TERMS ---
	// Spanish and Spanglish specific queries
	const culturalTerms = [
		"crack en",
		"que domine",
		"que sabe spanglish",
		"experto en recruitment",
		"rockstar developer",
		"ninja developer",
		"guru de",
		"maestro de",
		"mago de",
		"crack del codigo",
	];

	const topTechForCulturalTerms = [
		"react",
		"typescript",
		"python",
		"nodejs",
		"aws",
		"nextjs",
		"tailwindcss",
	];

	for (const term of culturalTerms) {
		for (const tech of topTechForCulturalTerms) {
			if (
				term === "crack en" ||
				term === "que domine" ||
				term === "guru de" ||
				term === "maestro de" ||
				term === "mago de"
			) {
				searchQueries.push(`${term} ${tech}`);
			} else if (term === "rockstar developer" || term === "ninja developer") {
				searchQueries.push(`${tech} ${term}`);
			} else if (term === "crack del codigo") {
				searchQueries.push(`${term} con ${tech}`);
			} else {
				searchQueries.push(`${term} con ${tech}`);
				searchQueries.push(`${term} y ${tech}`);
			}
		}
	}

	// --- 7. AI SPECIFIC QUERIES ---
	// These are specialized queries for AI-related developers
	const aiTerms = [
		"prompt engineer",
		"ai engineer",
		"machine learning engineer",
		"ingeniero de prompts",
		"ingeniero de ia",
		"ingeniero de machine learning",
	];

	const aiTechnologies = [
		"anthropic",
		"openai",
		"langchain",
		"hugging face",
		"tensorflow",
		"pytorch",
		"gpt",
		"claude",
		"llama",
		"elevenlabs",
		"whisper",
		"stable diffusion",
		"midjourney",
		"dall-e",
		"gemini",
	];

	for (const term of aiTerms) {
		for (const tech of aiTechnologies) {
			if (term.match(/engineer|ingeniero/)) {
				// English pattern
				if (!term.match(/ingeniero/)) {
					searchQueries.push(`${term} with ${tech} experience`);
					searchQueries.push(`${term} skilled in ${tech}`);
				}

				// Spanish pattern
				if (term.match(/ingeniero/)) {
					searchQueries.push(`${term} con experiencia en ${tech}`);
					searchQueries.push(`${term} especializado en ${tech}`);
				}
			}
		}
	}

	// --- 8. COMMON FULL PHRASES ---
	// These are complete specific search queries that are particularly common or useful
	const commonPhrases = [
		// English
		"best developers",
		"top engineers",
		"experienced developers",
		"remote developers",
		"developers with open source experience",
		"senior react developers",
		"typescript developers with next.js",
		"product designers with figma skills",
		"frontend developers with tailwind experience",
		"developers with upstash experience",
		"engineers with elevenlabs experience",
		"developers using anthropic",
		"developers who know bun and pnpm",
		"remote typescript developers",

		// Spanish
		"mejores desarrolladores",
		"ingenieros top",
		"desarrolladores con experiencia",
		"desarrolladores remotos",
		"desarrolladores con experiencia en open source",
		"desarrolladores senior de react",
		"desarrolladores de typescript con next.js",
		"diseñadores de producto con figma",
		"desarrolladores frontend con tailwind",
		"desarrolladores con experiencia en upstash",
		"ingenieros con experiencia en elevenlabs",
		"desarrolladores usando anthropic",
		"desarrolladores que conocen bun y pnpm",
		"desarrolladores de typescript remotos",
	];

	searchQueries = [...searchQueries, ...commonPhrases];

	// Remove duplicates and sort alphabetically
	const uniqueQueries = [...new Set(searchQueries)].sort();

	console.log(`Generated ${uniqueQueries.length} unique search queries`);
	return uniqueQueries;
}

/**
 * Index search queries into Upstash Vector
 */
async function indexSearchQueries() {
	try {
		console.log("🔄 Generating search query combinations...");
		const searchQueries = generateSearchQueries();
		console.log(
			`✅ Generated ${searchQueries.length} search query combinations`,
		);

		// Create a batch of query combinations
		let batch = [];
		let successCount = 0;
		let errorCount = 0;

		console.log("🔄 Starting batch indexing of search queries...");

		// Process queries in batches
		for (let i = 0; i < searchQueries.length; i++) {
			const queryText = searchQueries[i];

			batch.push({
				id: `query:${queryText}`,
				data: queryText,
			});

			// When batch reaches BATCH_SIZE or we're at the last query, process it
			if (batch.length >= BATCH_SIZE || i === searchQueries.length - 1) {
				try {
					// Process the batch
					await index.upsert(batch);
					// Update success count
					successCount += batch.length;
					console.log(
						`✅ Indexed batch: ${successCount}/${searchQueries.length} search queries`,
					);
				} catch (error) {
					console.error("❌ Failed to index batch:", error);
					errorCount += batch.length;
				}
				// Reset batch for next iteration
				batch = [];
			}
		}

		console.log(`
✅ Search query indexing complete:
- Total queries: ${searchQueries.length}
- Successfully indexed: ${successCount}
- Errors: ${errorCount}
- Total batches: ${Math.ceil(successCount / BATCH_SIZE)}
- Average batch size: ${(successCount / Math.ceil(successCount / BATCH_SIZE)).toFixed(2)} queries
    `);
	} catch (error) {
		console.error("❌ Failed to index search queries:", error);
		process.exit(1);
	}
}

/**
 * Main function to run all indexing operations
 */
async function main() {
	try {
		// Then index search queries
		await indexSearchQueries();

		console.log("✅ All indexing operations complete");
	} catch (error) {
		console.error("❌ Indexing failed:", error);
		process.exit(1);
	}
}

// Execute the main function
main().catch(console.error);
