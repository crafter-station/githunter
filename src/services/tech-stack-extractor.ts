import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, tool } from "ai";
import { z } from "zod";

export class TechStackExtractor {
  public async extract(
    repo: string,
    branch: string,
    filetree: string
  ): Promise<string[]> {
    const response = await generateText({
      system: this.systemText(),
      model: openai("gpt-4o-mini"),
      tools: {
        readFile: tool({
          description: "Read a file from github repository",
          parameters: z.object({
            path: z.string(),
          }),
          execute: async ({ path }) => {
            const content = await fetch(
              `https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${path}`
            );
            const text = await content.text();
            return text;
          },
        }),
      },
      maxSteps: 10,
      prompt: `Extract the tech stack from the following filetree:
${filetree}. Return just the array of consolidated technologies used in the project.`,
    });

    let techStackArray: string[] = [];
    if (response.text.includes("<tech-stack>")) {
      const techStack = response.text
        .split("<tech-stack>")[1]
        .split("</tech-stack>")[0];
      const _techStackArray = techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter((tech) => tech !== "");
      techStackArray = _techStackArray;
    } else {
      const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
          techStack: z.array(z.string()),
        }),
        prompt: `Extract the tech stack of a repo given this text: ${response.text}.`,
      });
      techStackArray = object.techStack;
    }

    return techStackArray.map((tech) => tech.toLowerCase());
  }

  private systemText(): string {
    return `You are a helpful assistant that extracts the tech stack from a filetree. 
      Use the readFile tool to read special files like package.json for node projects or the equivalent for other languages.
      Detail as much as possible about the tech stack, but consolidate related technologies under their parent names.
      
      Consolidation rules:
      - Group all dependencies from the same family under a single entry (e.g., all @radix-ui/* becomes just "radix-ui")
      - For language ecosystems, use the main technology name (e.g., "react" not "react-dom", "react-router", etc.)
      - For build tools, use the primary tool name (e.g., "webpack" not all its plugins)
      - For cloud providers, use the main provider name (e.g., "aws" not individual services)
      
      Each technology should be written in lowercase. Must be a keyword, avoid spaces and special characters.
      Avoid using @, #, $, %, &, *, etc as part of the technology name.
      The name must be a keyword like we would find in npm or pypi or gem or maven or etc.
      Return an array of consolidated technologies used in the project. Separate each technology with a comma.
      The array should be wrapped in <tech-stack>...</tech-stack> tags.
  
      Examples:
      <tech-stack>
      node, react, tailwindcss, shadcn, typescript, vite, vercel, supabase, prisma, nextjs, radix-ui
      </tech-stack>
  
      or
  
      <tech-stack>
      python, flask, sqlite, django, kubernetes, docker, aws, terraform
      </tech-stack>
      
      Hints: 
      - If the project has a components.json file at the root, it is using shadcn.
      - Look for configuration files (.config.js, pyproject.toml, Gemfile, etc.) to identify core technologies.
      - For Java projects, look at pom.xml or build.gradle.
      - For .NET projects, look at .csproj or .sln files.
      - For Python projects, look at requirements.txt, setup.py, or pyproject.toml.`;
  }
}
