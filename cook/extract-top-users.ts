#!/usr/bin/env ts-node

import { execSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, readdir, writeFile } from "node:fs/promises";
import * as os from "node:os";
import * as path from "node:path";
import { load } from "cheerio";

//
// Configuration
//

const REPO_URL = "https://github.com/gayanvoice/top-github-users.git";
const REPO_SUBDIR = path.join("markdown", "total_contributions");
const DEFAULT_OUTPUT_DIR = "./output-json";

//
// CLI args
//

const [, , outputDirArg] = process.argv;
const OUTPUT_DIR = outputDirArg ?? DEFAULT_OUTPUT_DIR;

//
// Helpers
//

/**
 * Clone the GitHub repo into a temp directory and return the path
 * to its `markdown/total_contributions` folder.
 */
async function cloneRepo(): Promise<string> {
	const tmpBase = os.tmpdir();
	const tmpDir = await mkdtemp(path.join(tmpBase, "tghu-"));
	console.log(`Cloning into temporary directory: ${tmpDir}`);

	// Shallow clone
	execSync(`git clone --depth 1 ${REPO_URL} ${tmpDir}`, { stdio: "inherit" });

	return path.join(tmpDir, REPO_SUBDIR);
}

/**
 * Given the path to a country .md file, parse its HTML table
 * and extract a map of { githubUsername → { twitter: url | null } }.
 */
async function processFile(
	filePath: string,
): Promise<Record<string, { twitter: string | null }>> {
	const html = await readFile(filePath, "utf8");
	const $ = load(html);
	const data: Record<string, { twitter: string | null }> = {};

	// Skip header row, then for each data row...
	$("table tr")
		.slice(1)
		.each((_, tr) => {
			const tds = $(tr).find("td");
			const nameCell = tds.eq(1);
			const twitterCell = tds.eq(3);

			const ghHref = nameCell.find("a[href*='github.com']").attr("href") ?? "";
			const username = path.basename(ghHref);

			const twitterHref = twitterCell.find("a").attr("href") ?? null;

			if (username) {
				data[username] = { twitter: twitterHref };
			}
		});

	return data;
}

//
// Main
//

async function main(): Promise<void> {
	try {
		// 1) Clone and locate markdown folder
		const inputDir = await cloneRepo();

		// 2) Prepare output
		await mkdir(OUTPUT_DIR, { recursive: true });
		console.log(`\nReading markdown files from: ${inputDir}`);
		console.log(`Writing JSON files to:      ${OUTPUT_DIR}\n`);

		// 3) Process each .md file
		const files = await readdir(inputDir);
		for (const file of files.filter((f) => f.endsWith(".md"))) {
			const country = path.basename(file, ".md");
			const fullPath = path.join(inputDir, file);

			console.log(`→ ${file} → ${country}.json`);
			const countryData = await processFile(fullPath);

			const outPath = path.join(OUTPUT_DIR, `${country}.json`);
			await writeFile(outPath, JSON.stringify(countryData, null, 2), "utf8");
			console.log(`   • ${Object.keys(countryData).length} users`);
		}

		console.log("\n✅ All done!");
	} catch (err) {
		console.error("Fatal error:", err);
		process.exit(1);
	}
}

main();
