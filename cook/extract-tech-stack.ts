import { TechStackExtractor } from "@/services/tech-stack-extractor";

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

const extractor = new TechStackExtractor();

extractor.extract(repo1, "main", filetree1).then((techStack) => {
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

extractor.extract(repo2, "main", filetree2).then((techStack) => {
  console.log(techStack);
});
