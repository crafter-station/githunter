#!/usr/bin/env node
import { generateGithubProfileMarkdown } from './github-profile-generator';
import * as path from 'node:path';

// Default values
const DEFAULT_USERNAME = 'octocat';
const DEFAULT_OUTPUT_DIR = './profiles';
const DEFAULT_REPO_COUNT = 10;

// Parse command line arguments
const args = process.argv.slice(2);
const username = args[0] || DEFAULT_USERNAME;
const outputDir = args[1] || DEFAULT_OUTPUT_DIR;
const repoCount = args[2] ? Number.parseInt(args[2], 10) : DEFAULT_REPO_COUNT;

// Create the output filename
const outputFile = path.join(outputDir, `${username}-profile.md`);

async function main() {
  try {
    console.log(`Generating GitHub profile for: ${username}`);
    console.log(`Including top ${repoCount} repositories`);
    console.log(`Output will be saved to: ${outputFile}`);
    
    // Generate the profile markdown
    const markdown = await generateGithubProfileMarkdown(
      username,
      outputFile,
      repoCount
    );
    
    console.log('Profile generation completed successfully!');
    console.log(`Profile saved to: ${outputFile}`);
    
    // Also output the first few lines to preview
    const previewLines = markdown.split('\n').slice(0, 10).join('\n');
    console.log('\nPreview:');
    console.log('-------------------');
    console.log(`${previewLines}\n...`);
    console.log('-------------------');
  } catch (error) {
    console.error('Error generating profile:');
    if (error instanceof Error) {
      console.error(`${error.name}: ${error.message}`);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
}

main(); 