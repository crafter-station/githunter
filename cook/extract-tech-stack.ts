import { openai } from "@ai-sdk/openai";
import { generateObject, generateText, tool } from "ai";
import { z } from "zod";

async function extractTechStack(
	repo: string,
	branch: string,
	filetree: string,
) {
	const response = await generateText({
		system: `You are a helpful assistant that extracts the tech stack from a filetree. 
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
    - For Python projects, look at requirements.txt, setup.py, or pyproject.toml.`,
		model: openai("gpt-4o-mini"),
		tools: {
			readFile: tool({
				description: "Read a file from github repository",
				parameters: z.object({
					path: z.string(),
				}),
				execute: async ({ path }) => {
					const content = await fetch(
						`https://raw.githubusercontent.com/${repo}/refs/heads/${branch}/${path}`,
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
			prompt: `Extract the tech stack of a repo given this text:
${response.text}.`,
		});
		techStackArray = object.techStack;
	}

	return techStackArray.map((tech) => tech.toLowerCase());
}

const filetree1 = `
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── actions/
│   ├── add-website-reference.ts
│   ├── docs.ts
│   └── websites.ts
├── app/
│   ├── (auth)/
│   │   └── sign-in/
│   │       └── [[...sign-in]]/
│   │           └── page.tsx
│   ├── (protected)/
│   │   ├── components/
│   │   │   ├── data-table.tsx
│   │   │   ├── file-card.tsx
│   │   │   ├── files-grid.tsx
│   │   │   └── table-columns.tsx
│   │   ├── docs/
│   │   │   └── [doc_id]/
│   │   │       ├── text-editor/
│   │   │       │   ├── ai-chat-sidebar.tsx
│   │   │       │   ├── ai-chat-trigger.tsx
│   │   │       │   ├── index.tsx
│   │   │       │   ├── model-selector.tsx
│   │   │       │   ├── reference-selector.tsx
│   │   │       │   ├── text-to-speech.tsx
│   │   │       │   └── voice-transcription.tsx
│   │   │       ├── loading.tsx
│   │   │       ├── page.tsx
│   │   │       └── tour.tsx
│   │   ├── home/
│   │   │   ├── new-doc.tsx
│   │   │   ├── page.tsx
│   │   │   ├── search-command.tsx
│   │   │   └── tour.tsx
│   │   ├── integrations/
│   │   │   ├── discord/
│   │   │   │   └── page.tsx
│   │   │   ├── github/
│   │   │   │   └── page.tsx
│   │   │   ├── linear/
│   │   │   │   └── page.tsx
│   │   │   ├── notion/
│   │   │   │   └── page.tsx
│   │   │   └── page.tsx
│   │   ├── references/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── actions/
│   │   ├── textToSpeech.ts
│   │   └── transcribe.ts
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.ts
│   │   ├── completion/
│   │   │   └── route.ts
│   │   ├── discord/
│   │   │   └── data/
│   │   │       └── route.ts
│   │   ├── docs/
│   │   │   └── [doc_id]/
│   │   │       └── route.ts
│   │   ├── github/
│   │   │   ├── data/
│   │   │   │   └── route.ts
│   │   │   └── sync/
│   │   │       └── route.ts
│   │   ├── linear/
│   │   │   ├── data/
│   │   │   │   └── route.ts
│   │   │   ├── sync/
│   │   │   │   └── route.ts
│   │   │   └── sync.ts
│   │   ├── notion/
│   │   │   ├── data/
│   │   │   │   └── route.ts
│   │   │   └── sync/
│   │   │       └── route.ts
│   │   ├── references/
│   │   │   └── route.ts
│   │   ├── text-modification/
│   │   │   └── route.ts
│   │   ├── transcribe/
│   │   │   └── route.ts
│   │   └── uploadthing/
│   │       ├── core.ts
│   │       └── route.ts
│   ├── components/
│   │   ├── announcement-bar/
│   │   │   ├── AnnouncementBar.tsx
│   │   │   ├── AnnouncementBarWrapper.tsx
│   │   │   └── index.ts
│   │   └── PleaseStarUsOnGitHub.tsx
│   ├── globals.css
│   ├── icon.svg
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── providers.tsx
├── components/
│   ├── home/
│   │   ├── app-header.tsx
│   │   ├── quick-action-button.tsx
│   │   ├── recent-files-card.tsx
│   │   └── status-bar.tsx
│   ├── ui/
│   │   ├── icons/
│   │   │   ├── crafter.tsx
│   │   │   ├── discord.tsx
│   │   │   ├── github.tsx
│   │   │   ├── gmail.tsx
│   │   │   ├── google-calendar.tsx
│   │   │   ├── google-docs.tsx
│   │   │   ├── index.ts
│   │   │   ├── linear.tsx
│   │   │   ├── ms-teams.tsx
│   │   │   ├── notion.tsx
│   │   │   ├── slack.tsx
│   │   │   ├── spinner.tsx
│   │   │   ├── t0-logo.tsx
│   │   │   ├── vercel.tsx
│   │   │   └── x-icon.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── anthropic-logo.tsx
│   │   ├── badge.tsx
│   │   ├── bounce-spinner.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── file-upload.tsx
│   │   ├── google-logo.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── llama-logo.tsx
│   │   ├── menubar.tsx
│   │   ├── openai-logo.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── progress.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toggle.tsx
│   │   ├── tooltip.tsx
│   │   └── xai-logo.tsx
│   ├── add-reference.tsx
│   ├── animated-badge.tsx
│   ├── animated-prompt.tsx
│   ├── command-menu.tsx
│   ├── editable-document-name.tsx
│   ├── inline-diff-view.tsx
│   ├── integration-sidebar.tsx
│   ├── new-document-button.tsx
│   ├── t0-keycap.tsx
│   ├── text-diff-view.tsx
│   ├── text-scramble.tsx
│   ├── text-selection-menu.tsx
│   └── tour.tsx
├── hooks/
│   ├── use-debounced-callback.ts
│   ├── use-document-references.ts
│   ├── use-media-query.ts
│   ├── use-mobile.ts
│   ├── use-model.ts
│   ├── use-reference-processing.ts
│   ├── use-references.ts
│   └── use-selected-references.ts
├── lib/
│   ├── auth/
│   │   └── server.ts
│   ├── firecrawl.ts
│   ├── local-cookies.ts
│   ├── models.ts
│   ├── nanoid.ts
│   ├── redis.ts
│   ├── tour-constants.ts
│   ├── trigger-hooks.ts
│   ├── uploadthing.ts
│   ├── utils.ts
│   └── vector.ts
├── public/
│   ├── autocomplete.png
│   ├── bghero.webp
│   ├── default-content.json
│   ├── file.svg
│   ├── globe.svg
│   ├── home.png
│   ├── keytype.mp3
│   ├── landing.png
│   ├── next.svg
│   ├── t0-logo-bg.svg
│   ├── t0-logo.svg
│   ├── vercel.svg
│   └── window.svg
├── trigger/
│   └── process-document.ts
├── .gitignore
├── biome.json
├── bun.lock
├── components.json
├── LICENSE
├── middleware.ts
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── trigger.config.ts
└── tsconfig.json
`;
const repo1 = "crafter-station/text0";

extractTechStack(repo1, "main", filetree1).then((techStack) => {
	console.log(techStack);
});

const filetree2 = `
├── .idea/
│   ├── .gitignore
│   ├── gostore.iml
│   ├── modules.xml
│   └── vcs.xml
├── assets/
│   └── images/
│       └── logo.png
├── bin/
│   └── .gitkeep
├── cmd/
│   └── main/
│       └── main.go
├── internal/
│   ├── application/
│   │   ├── create_bucket_service_test.go
│   │   ├── create_bucket_service.go
│   │   ├── create_object_service.go
│   │   ├── delete_bucket_service.go
│   │   ├── delete_object_service_test.go
│   │   ├── delete_object_service.go
│   │   ├── generate_bucket_path_service_test.go
│   │   ├── generate_bucket_path_service.go
│   │   ├── generate_object_path_service_test.go
│   │   ├── generate_object_path_service.go
│   │   ├── get_buckets_in_bucket_service_test.go
│   │   ├── get_buckets_in_bucket_service.go
│   │   ├── get_buckets_service_test.go
│   │   ├── get_buckets_service.go
│   │   ├── get_objects_in_bucket_service_test.go
│   │   └── get_objects_in_bucket_service.go
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── bucket_test.go
│   │   │   ├── bucket.go
│   │   │   ├── object_test.go
│   │   │   └── object.go
│   │   └── repositories/
│   │       ├── bucket_respository.go
│   │       └── object_repository.go
│   ├── infrastructure/
│   │   ├── controllers/
│   │   │   ├── dtos/
│   │   │   │   └── message.go
│   │   │   ├── create_bucket.go
│   │   │   ├── create_object.go
│   │   │   ├── delete_bucket.go
│   │   │   ├── delete_object.go
│   │   │   ├── download_object.go
│   │   │   ├── get_buckets_in_bucket.go
│   │   │   ├── get_buckets.go
│   │   │   └── get_objects_in_bucket.go
│   │   └── repositories/
│   │       ├── file_bucket_repository_test.go
│   │       ├── file_bucket_repository.go
│   │       ├── file_object_repository_test.go
│   │       ├── file_object_repository.go
│   │       ├── ram_bucket_repository.go
│   │       └── ram_object_repository.go
│   └── shared/
│       ├── filesystem_test.go
│       ├── filesystem.go
│       ├── url_generator_test.go
│       └── url_generator.go
├── migrations/
│   ├── 001_buckets.sql
│   └── 002_objects.sql
├── storage/
│   └── .gitkeep
├── .gitignore
├── build.sh
├── go.mod
├── go.sum
└── README.md
`;
const repo2 = "Jibaru/gostore";

extractTechStack(repo2, "main", filetree2).then((techStack) => {
	console.log(techStack);
});
