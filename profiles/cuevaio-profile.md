# Anthony Cueva's GitHub Profile

- **Username**: [@cuevaio](https://github.com/cuevaio)
- **Bio**: human software engineer
- **Location**: Lima
- **Public Repositories**: 73
- **Followers**: 29
- **Following**: 33
- **Total Stars Earned**: 319 (including organization repositories)
- **Total Contributions 2025**: 0
## Top Repositories (Including Organizations)

| Repository | Stars | URL |
|------------|-------|-----|
| text0 | 286 | [View](https://github.com/crafter-station/text0) |
| utec-classrooms | 6 | [View](https://github.com/cuevaio/utec-classrooms) |
| compy-ai | 3 | [View](https://github.com/cuevaio/compy-ai) |
| gradual | 3 | [View](https://github.com/crafter-station/gradual) |
| retest | 2 | [View](https://github.com/cuevaio/retest) |
| CoordConv | 2 | [View](https://github.com/cuevaio/CoordConv) |
| spookie.cam | 2 | [View](https://github.com/crafter-station/spookie.cam) |
| cuevaio | 1 | [View](https://github.com/cuevaio/cuevaio) |
| mistral-ocr | 1 | [View](https://github.com/cuevaio/mistral-ocr) |
| mygoodday | 1 | [View](https://github.com/cuevaio/mygoodday) |

## Repository File Trees

### text0

**Languages**: TypeScript, CSS, JavaScript

**File Tree**:

```
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
```

### utec-classrooms

**Languages**: JavaScript, Svelte, TypeScript, CSS, HTML

**File Tree**:

```
├── .svelte-kit/
│   └── tsconfig.json
├── .xata/
│   └── migrations/
│       └── .ledger
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── day/
│   │   │   │   ├── DayNavigationPrimary.svelte
│   │   │   │   └── DayNavigationSecondary.svelte
│   │   │   ├── ui/
│   │   │   │   └── button/
│   │   │   │       ├── button.svelte
│   │   │   │       └── index.ts
│   │   │   ├── Layout.svelte
│   │   │   ├── TheFirstClone.svelte
│   │   │   └── TypographyLink.svelte
│   │   ├── stores/
│   │   │   └── selected-classroom.js
│   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   ├── parse-datetime.js
│   │   │   └── storable.js
│   │   ├── xata/
│   │   │   ├── index.js
│   │   │   ├── schema.json
│   │   │   └── types.d.ts
│   │   └── classrooms.js
│   ├── routes/
│   │   ├── [date]/
│   │   │   ├── [classroom]/
│   │   │   │   ├── +page.server.js
│   │   │   │   ├── +page.svelte
│   │   │   │   └── get-data.js
│   │   │   ├── +page.server.js
│   │   │   └── +page.svelte
│   │   ├── api/
│   │   │   ├── refresh/
│   │   │   │   └── +server.js
│   │   │   └── robot/
│   │   │       └── +server.js
│   │   ├── sponsors/
│   │   │   └── +page.svelte
│   │   ├── the-first-clone/
│   │   │   └── +page.svelte
│   │   ├── +layout.svelte
│   │   ├── +page.server.js
│   │   ├── +page.svelte
│   │   └── get-data.js
│   ├── app.d.ts
│   ├── app.html
│   └── app.postcss
├── static/
│   ├── analytics/
│   │   ├── 2023-10-03-19_15.png
│   │   ├── 2023-10-04-12_45.png
│   │   ├── 2023-10-04-14_20.png
│   │   ├── 2023-10-04-16_05.png
│   │   ├── 2023-10-05-01_50.png
│   │   ├── 2023-10-06-18_00.png
│   │   ├── vercel-100-web-analytics-mail.png
│   │   ├── week-2023-10-02-15_50.png
│   │   └── week-2023-10-04-16_15.png
│   ├── data/
│   │   ├── 24h/
│   │   │   ├── 2023-10-02.json
│   │   │   ├── 2023-10-03.json
│   │   │   ├── 2023-10-04.json
│   │   │   ├── 2023-10-05.json
│   │   │   └── 2023-10-06.json
│   │   └── 7d.json
│   ├── TheFirstClone/
│   │   ├── mail.png
│   │   └── vercel.png
│   ├── example.md
│   ├── favicon.png
│   ├── homepage_ss.png
│   └── yape-qr.png
├── .env.example
├── .eslintignore
├── .eslintrc.cjs
├── .gitignore
├── .npmrc
├── .prettierignore
├── .prettierrc
├── .xatarc
├── components.json
├── jsconfig.json
├── LICENSE
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── svelte.config.js
├── tailwind.config.js
└── vite.config.js
```

### compy-ai

**Languages**: TypeScript, CSS, JavaScript

**File Tree**:

```
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   └── ui/
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── textarea.tsx
│   ├── labs/
│   │   ├── data/
│   │   │   ├── products-for-embedding.json
│   │   │   └── products-without-specs.json
│   │   ├── generate-markdown.ts
│   │   └── populate.ts
│   └── lib/
│       ├── utils.ts
│       └── vector.ts
├── .gitignore
├── biome.json
├── bun.lock
├── components.json
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

### gradual

**Languages**: TypeScript, CSS, JavaScript, Makefile

**File Tree**:

```
├── .husky/
│   ├── commit-msg
│   └── pre-commit
├── .vscode/
│   ├── extensions.json
│   └── settings.json
├── cook/
│   ├── create-alternative-steps.ts
│   ├── create-lesson-steps.ts
│   ├── create-user.ts
│   ├── reset-db.ts
│   ├── syllabus.json
│   ├── trigger-full.ts
│   ├── trigger.ts
│   └── update-counters.ts
├── drizzle/
│   ├── meta/
│   │   ├── _journal.json
│   │   └── 0000_snapshot.json
│   └── 0000_thin_mephistopheles.sql
├── public/
│   ├── fonts/
│   │   ├── Geist-Bold.ttf
│   │   └── Geist-Regular.ttf
│   ├── file.svg
│   ├── globe.svg
│   ├── gradual-logo.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (app)/
│   │   │   │   ├── achievements/
│   │   │   │   │   └── [achievementId]/
│   │   │   │   │       └── metadata.ts
│   │   │   │   ├── home/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── learn/
│   │   │   │   │   └── courses/
│   │   │   │   │       ├── [course_id]/
│   │   │   │   │       │   ├── (course)/
│   │   │   │   │       │   │   ├── components/
│   │   │   │   │       │   │   ├── students/
│   │   │   │   │       │   │   ├── syllabus/
│   │   │   │   │       │   │   ├── tasks/
│   │   │   │   │       │   │   ├── layout.tsx
│   │   │   │   │       │   │   ├── metadata.ts
│   │   │   │   │       │   │   └── page.tsx
│   │   │   │   │       │   └── tasks/
│   │   │   │   │       │       └── [task_id]/
│   │   │   │   │       ├── new/
│   │   │   │   │       │   ├── create-course.action.ts
│   │   │   │   │       │   ├── form.tsx
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── profile/
│   │   │   │   │   └── [userId]/
│   │   │   │   │       └── metadata.ts
│   │   │   │   └── layout.tsx
│   │   │   ├── (debug)/
│   │   │   │   ├── book-card-showcase/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── debug/
│   │   │   │   │   ├── metadata.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── design/
│   │   │   │   │   └── steps/
│   │   │   │   │       ├── analogy/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── binary/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── definition/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── fill_in_the_blank/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── fun_fact/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── introduction/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── multiple_choice/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── question/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── quote/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── solved_exercise/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── tutorial/
│   │   │   │   │       │   └── page.tsx
│   │   │   │   │       ├── helpers.ts
│   │   │   │   │       ├── layout.tsx
│   │   │   │   │       ├── loading.tsx
│   │   │   │   │       ├── page.tsx
│   │   │   │   │       └── step-button.tsx
│   │   │   │   └── layout.tsx
│   │   │   ├── (landing)/
│   │   │   │   ├── about/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── blog/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── placeholder.tsx
│   │   │   │   ├── careers/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── changelog/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── docs/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── features/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── methodology/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── our-vision/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── pricing/
│   │   │   │   │   ├── metadata.ts
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── roadmap/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── success-stories/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── tutorials/
│   │   │   │   │   ├── [slug]/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── waitlist/
│   │   │   │   │   ├── empty-state.tsx
│   │   │   │   │   ├── helpers.ts
│   │   │   │   │   ├── page-title.tsx
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── update-user.action.ts
│   │   │   │   │   ├── user-card.tsx
│   │   │   │   │   └── waitlist-actions.tsx
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── sign-in/
│   │   │   │   └── [[...sign-in]]/
│   │   │   │       └── page.tsx
│   │   │   ├── action.ts
│   │   │   ├── favicon.ico
│   │   │   ├── flexoki.css
│   │   │   ├── form.tsx
│   │   │   ├── globals.css
│   │   │   ├── layout.tsx
│   │   │   └── shadcn.css
│   │   ├── api/
│   │   │   ├── og/
│   │   │   │   └── route.tsx
│   │   │   ├── uploadthing/
│   │   │   │   ├── core.ts
│   │   │   │   └── route.ts
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   └── icon.svg
│   ├── components/
│   │   ├── sidebar/
│   │   │   ├── app-sidebar.tsx
│   │   │   ├── command-menu.tsx
│   │   │   ├── nav-main.tsx
│   │   │   ├── nav-projects.tsx
│   │   │   ├── nav-user.tsx
│   │   │   └── sidebar-data.ts
│   │   ├── ui/
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── blur-number.tsx
│   │   │   ├── breadcrumb.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── collapsible.tsx
│   │   │   ├── command.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   ├── book-card-showcase.tsx
│   │   ├── book-card.tsx
│   │   ├── book.tsx
│   │   ├── cover.tsx
│   │   ├── gauge.tsx
│   │   ├── gradual-logo.tsx
│   │   ├── markdown-components.tsx
│   │   ├── step-card.tsx
│   │   ├── task-card.tsx
│   │   ├── task-progress.tsx
│   │   ├── theme.ts
│   │   └── units-with-connector.tsx
│   ├── core/
│   │   ├── domain/
│   │   │   ├── aigen.ts
│   │   │   ├── alternative-step-repo.ts
│   │   │   ├── alternative-step.ts
│   │   │   ├── chunk-repo.ts
│   │   │   ├── chunk.ts
│   │   │   ├── course-repo.ts
│   │   │   ├── course.ts
│   │   │   ├── embedding.ts
│   │   │   ├── mail-sender.ts
│   │   │   ├── scrapper.ts
│   │   │   ├── section-repo.ts
│   │   │   ├── section.ts
│   │   │   ├── source-repo.ts
│   │   │   ├── source.ts
│   │   │   ├── step-repo.ts
│   │   │   ├── step.ts
│   │   │   ├── task-repo.ts
│   │   │   ├── task.ts
│   │   │   ├── unit-repo.ts
│   │   │   ├── unit.ts
│   │   │   ├── user-repo.ts
│   │   │   ├── user.ts
│   │   │   ├── wait-record-repo.ts
│   │   │   └── wait-record.ts
│   │   ├── services/
│   │   │   ├── container.ts
│   │   │   ├── create-chunks.service.ts
│   │   │   ├── create-course.service.ts
│   │   │   ├── create-embedding.ts
│   │   │   ├── create-source.service.ts
│   │   │   ├── enrich-chunk-content.service.ts
│   │   │   ├── enrich-chunk.service.ts
│   │   │   ├── extract-chunks-texts.ts
│   │   │   ├── generate-course-syllabus.service.ts
│   │   │   ├── generate-lessons-steps.service.ts
│   │   │   ├── generate-syllabus-embeddings.service.ts
│   │   │   ├── parse-source.service.ts
│   │   │   ├── store-course.service.ts
│   │   │   ├── summarize-chunk-content.service.ts
│   │   │   └── summarize-source-content.service.ts
│   │   └── usecases/
│   │       ├── container.ts
│   │       ├── create-alternative-steps.usecase.ts
│   │       ├── create-course.usecase.ts
│   │       ├── join-waitlist.usecase.ts
│   │       ├── list-pending-waitlist.usecase.ts
│   │       └── update-waitlist-status.usecase.ts
│   ├── db/
│   │   ├── schema/
│   │   │   ├── alternative-step/
│   │   │   │   └── index.ts
│   │   │   ├── step/
│   │   │   │   ├── analogy.ts
│   │   │   │   ├── binary.ts
│   │   │   │   ├── definition.ts
│   │   │   │   ├── fill-in-the-blank.ts
│   │   │   │   ├── fun-fact.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── introduction.ts
│   │   │   │   ├── multiple-choice.ts
│   │   │   │   ├── progress-state.ts
│   │   │   │   ├── question.ts
│   │   │   │   ├── quote.ts
│   │   │   │   ├── solved-exercise.ts
│   │   │   │   └── tutorial.ts
│   │   │   ├── chunk.ts
│   │   │   ├── course.ts
│   │   │   ├── enrollment.ts
│   │   │   ├── index.ts
│   │   │   ├── section.ts
│   │   │   ├── source.ts
│   │   │   ├── step-progress.ts
│   │   │   ├── task-progress.ts
│   │   │   ├── task.ts
│   │   │   ├── unit.ts
│   │   │   ├── user.ts
│   │   │   └── waitlist.ts
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── emails/
│   │   ├── helpers/
│   │   │   └── waitlist-emails.ts
│   │   └── templates/
│   │       └── waitlist.ts
│   ├── hooks/
│   │   └── use-mobile.tsx
│   ├── lib/
│   │   ├── prompts/
│   │   │   ├── enrich_chunk.ts
│   │   │   ├── generate_course_syllabus.ts
│   │   │   ├── generate_lesson.ts
│   │   │   ├── generate-alternative-steps.ts
│   │   │   ├── index.ts
│   │   │   ├── summarize_chunk.ts
│   │   │   └── summarize-document.ts
│   │   ├── utils/
│   │   │   ├── index.ts
│   │   │   └── uploadthing.ts
│   │   ├── constants.ts
│   │   ├── og-helpers.ts
│   │   └── schemas.ts
│   ├── locales/
│   │   ├── client.ts
│   │   ├── en.ts
│   │   ├── es.ts
│   │   ├── server.ts
│   │   └── types.ts
│   ├── trigger/
│   │   ├── create-course.ts
│   │   ├── enrich-chunk-content.task.ts
│   │   ├── enrich-chunk.task.ts
│   │   ├── example-2.ts
│   │   ├── example.ts
│   │   ├── extract-chunks.task.ts
│   │   ├── generate-course-syllabus.task.ts
│   │   ├── generate-lesson-step.task.ts
│   │   ├── generate-syllabus-embedding.task.ts
│   │   ├── parse-source.task.ts
│   │   ├── store-chunks.task.ts
│   │   ├── store-source.task.ts
│   │   ├── store-syllabus.task.ts
│   │   ├── summarize-chunk-content.task.ts
│   │   └── summarize-source-content.task.ts
│   └── middleware.ts
├── .env.example
├── .gitignore
├── biome.json
├── bun.lock
├── components.json
├── drizzle.config.ts
├── LICENSE.md
├── Makefile
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── README.md
├── trigger.config.ts
└── tsconfig.json
```

### retest

**Languages**: TypeScript, JavaScript, CSS

**File Tree**:

```
├── .vscode/
│   └── settings.json
├── .xata/
│   └── version/
│       └── compatibility.json
├── apps/
│   ├── docs/
│   │   ├── public/
│   │   │   ├── circles.svg
│   │   │   ├── next.svg
│   │   │   ├── turborepo.svg
│   │   │   └── vercel.svg
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── api/
│   │   │   │   │   ├── hi/
│   │   │   │   │   │   └── route.ts
│   │   │   │   │   └── retest/
│   │   │   │   │       └── [action]/
│   │   │   │   │           └── route.ts
│   │   │   │   ├── client-page/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── test/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── favicon.ico
│   │   │   │   ├── globals.css
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── lib/
│   │   │   │   └── retest/
│   │   │   │       ├── client.ts
│   │   │   │       ├── index.ts
│   │   │   │       └── server.ts
│   │   │   └── middleware.ts
│   │   ├── .env.example
│   │   ├── .eslintrc.js
│   │   ├── next-env.d.ts
│   │   ├── next.config.js
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── README.md
│   │   ├── tailwind.config.js
│   │   └── tsconfig.json
│   └── web/
│       ├── .xata/
│       │   └── version/
│       │       └── compatibility.json
│       ├── public/
│       │   ├── circles.svg
│       │   ├── next.svg
│       │   ├── turborepo.svg
│       │   └── vercel.svg
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/
│       │   │   │   ├── auth/
│       │   │   │   │   └── [...nextauth]/
│       │   │   │   │       └── route.ts
│       │   │   │   ├── trpc/
│       │   │   │   │   └── [trpc]/
│       │   │   │   │       └── route.ts
│       │   │   │   └── v0/
│       │   │   │       ├── experiment-variants/
│       │   │   │       │   └── route.ts
│       │   │   │       ├── getVariant/
│       │   │   │       │   └── route.ts
│       │   │   │       └── getVariantsForCompletedExperiments/
│       │   │   │           └── route.ts
│       │   │   ├── app/
│       │   │   │   ├── [workspace]/
│       │   │   │   │   ├── experiments/
│       │   │   │   │   │   ├── [experimentId]/
│       │   │   │   │   │   │   ├── events/
│       │   │   │   │   │   │   ├── varitants/
│       │   │   │   │   │   │   ├── delete-form.tsx
│       │   │   │   │   │   │   └── page.tsx
│       │   │   │   │   │   ├── create/
│       │   │   │   │   │   │   ├── duration-input.tsx
│       │   │   │   │   │   │   ├── page.tsx
│       │   │   │   │   │   │   └── sample-size-input.tsx
│       │   │   │   │   │   ├── experiment-card.tsx
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   ├── members/
│       │   │   │   │   │   ├── invitations.tsx
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   ├── settings/
│       │   │   │   │   │   └── page.tsx
│       │   │   │   │   ├── setup/
│       │   │   │   │   │   ├── page.tsx
│       │   │   │   │   │   └── theme.json
│       │   │   │   │   ├── layout.tsx
│       │   │   │   │   ├── nav-buttons.tsx
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── settings/
│       │   │   │   │   └── page.tsx
│       │   │   │   ├── create-workspace.tsx
│       │   │   │   ├── layout.tsx
│       │   │   │   ├── page.tsx
│       │   │   │   ├── workspace-invites.tsx
│       │   │   │   └── workspace-list.tsx
│       │   │   ├── providers/
│       │   │   │   ├── index.tsx
│       │   │   │   ├── next-auth.tsx
│       │   │   │   ├── theme-provider.tsx
│       │   │   │   └── trpc-react-query-provider.tsx
│       │   │   ├── .page.tsx.swp
│       │   │   ├── favicon.ico
│       │   │   ├── globals.css
│       │   │   ├── layout.tsx
│       │   │   └── page.tsx
│       │   ├── components/
│       │   │   ├── auth-buttons.tsx
│       │   │   ├── header.tsx
│       │   │   ├── input-hint.tsx
│       │   │   ├── title.tsx
│       │   │   └── user-button.tsx
│       │   ├── hooks/
│       │   │   └── use-user.ts
│       │   ├── lib/
│       │   │   ├── resend.ts
│       │   │   ├── trpc.ts
│       │   │   ├── xata-nextauth-adapter.ts
│       │   │   └── xata.ts
│       │   ├── server/
│       │   │   ├── routes/
│       │   │   │   ├── events.ts
│       │   │   │   ├── experiments.ts
│       │   │   │   ├── users.ts
│       │   │   │   ├── utils.ts
│       │   │   │   ├── variants.ts
│       │   │   │   └── workspaces.ts
│       │   │   ├── context.ts
│       │   │   ├── index.ts
│       │   │   └── trpc.ts
│       │   ├── auth.ts
│       │   └── newFile.ts
│       ├── .env.example
│       ├── .eslintrc.js
│       ├── .xatarc
│       ├── LICENSE.md
│       ├── next-env.d.ts
│       ├── next.config.js
│       ├── package.json
│       ├── postcss.config.js
│       ├── README.md
│       ├── tailwind.config.js
│       └── tsconfig.json
├── packages/
│   ├── eslint-config/
│   │   ├── library.js
│   │   ├── next.js
│   │   ├── package.json
│   │   ├── react-internal.js
│   │   └── README.md
│   ├── nextjs/
│   │   ├── src/
│   │   │   ├── api/
│   │   │   │   └── index.ts
│   │   │   ├── get-client-data-edge/
│   │   │   │   └── index.ts
│   │   │   ├── get-experiments-from-retest-cookies/
│   │   │   │   └── index.ts
│   │   │   ├── get-variant-client/
│   │   │   │   └── index.tsx
│   │   │   ├── get-variant-server/
│   │   │   │   └── index.tsx
│   │   │   ├── get-variant-server-edge/
│   │   │   │   └── index.tsx
│   │   │   ├── get-variants-server/
│   │   │   │   └── index.ts
│   │   │   ├── get-variants-server-edge/
│   │   │   │   └── index.ts
│   │   │   ├── middleware/
│   │   │   │   └── index.ts
│   │   │   ├── retest-block-client/
│   │   │   │   └── index.tsx
│   │   │   ├── retest-block-server/
│   │   │   │   └── index.tsx
│   │   │   ├── types/
│   │   │   │   └── experiment.d.ts
│   │   │   ├── use-experiments/
│   │   │   │   └── index.ts
│   │   │   ├── use-retest-client/
│   │   │   │   └── index.tsx
│   │   │   ├── use-retest-server/
│   │   │   │   └── index.ts
│   │   │   ├── utils/
│   │   │   │   ├── fetcher.ts
│   │   │   │   └── get-retest-api-url.ts
│   │   │   ├── client.ts
│   │   │   └── server.ts
│   │   ├── .eslintrc.js
│   │   ├── LICENSE.md
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.lint.json
│   ├── tailwind-config/
│   │   ├── config.ts
│   │   └── package.json
│   ├── typescript-config/
│   │   ├── base.json
│   │   ├── nextjs.json
│   │   ├── package.json
│   │   └── react-library.json
│   ├── ui/
│   │   ├── src/
│   │   │   ├── time-picker/
│   │   │   │   ├── index.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   └── utils.ts
│   │   │   ├── accordion.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── code.tsx
│   │   │   ├── date-time-picker.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── ditto.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── use-toast.ts
│   │   ├── .eslintrc.js
│   │   ├── components.json
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.lint.json
│   └── utils/
│       ├── src/
│       │   ├── cn.ts
│       │   ├── index.ts
│       │   └── prettify.d.ts
│       ├── .eslintrc.js
│       ├── package.json
│       └── tsconfig.json
├── :w
├── .eslintrc.js
├── .gitignore
├── .npmrc
├── .prettierrc
├── LICENSE.md
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── tsconfig.json
└── turbo.json
```

### CoordConv

**Languages**: Python

**File Tree**:

```
├── example/
│   ├── convertCoords.py
│   ├── getCoords.py
│   ├── input.csv
│   └── output.csv
├── lib/
│   ├── __init__.py
│   ├── classes.py
│   └── functions.py
├── tests/
│   ├── test1.csv
│   ├── test1.py
│   ├── test2.csv
│   └── test2.py
├── .gitignore
├── main.py
└── README.md
```

### spookie.cam

**Languages**: TypeScript, CSS, Shell, JavaScript

**File Tree**:

```
├── .husky/
│   ├── pre-commit
│   └── pre-push
├── app/
│   ├── (app)/
│   │   ├── catalog/
│   │   │   ├── [pageIndex]/
│   │   │   │   └── page.tsx
│   │   │   ├── actions/
│   │   │   │   └── generate-creature.ts
│   │   │   ├── page.tsx
│   │   │   └── pagination.tsx
│   │   ├── mine/
│   │   │   └── page.tsx
│   │   ├── pic/
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   ├── layout.tsx
│   │   ├── new-pic.tsx
│   │   └── upload-image.action.ts
│   ├── api/
│   │   └── og/
│   │       ├── [id]/
│   │       │   └── route.tsx
│   │       └── route.tsx
│   ├── fonts/
│   │   ├── GeistMonoVF.woff
│   │   ├── GeistVF.woff
│   │   └── VCR_OSD_MONO_1.001.ttf
│   ├── background-noise.tsx
│   ├── c-date.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── robots.txt
├── components/
│   ├── providers/
│   │   └── index.tsx
│   ├── ui/
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── icons.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── progress.tsx
│   │   ├── resizable.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── slider.tsx
│   │   ├── sonner.tsx
│   │   ├── switch.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toaster.tsx
│   │   └── tooltip.tsx
│   ├── audio-player.tsx
│   ├── creature-details.tsx
│   ├── dithered-image.tsx
│   ├── download-button.tsx
│   ├── foggy-background.tsx
│   ├── horrific-creature-card.tsx
│   ├── horrific-image-filter.tsx
│   ├── image-processor.worker.ts
│   ├── meme-generator.tsx
│   ├── nav-bar-shader.tsx
│   ├── progress-bar-group.tsx
│   ├── share-button.tsx
│   └── spooky-image.tsx
├── hooks/
│   ├── use-duration.ts
│   ├── use-progress.ts
│   └── use-toast.ts
├── lib/
│   ├── cloudinary.ts
│   ├── constants.ts
│   ├── db.ts
│   ├── get-base-64-image.ts
│   ├── get-embeddings.ts
│   ├── get-user-id.ts
│   ├── ratelimit.ts
│   ├── utils.ts
│   └── vector.ts
├── public/
│   ├── audios/
│   │   ├── horror-ambience.mp3
│   │   ├── nivel-0.mp3
│   │   ├── nivel-1.mp3
│   │   ├── nivel-2.mp3
│   │   ├── nivel-3.mp3
│   │   ├── nivel-4.mp3
│   │   ├── nivel-5.mp3
│   │   ├── nivel-6.mp3
│   │   ├── nivel-7.mp3
│   │   ├── nivel-8.mp3
│   │   ├── nivel-9.mp3
│   │   ├── scream.mp3
│   │   ├── terror.mp3
│   │   └── whispers.mp3
│   ├── black-man.jpg
│   ├── black-woman.webp
│   ├── cueva.jpeg
│   ├── dog_2.jpeg
│   ├── dog.jpeg
│   ├── image_3.enc
│   ├── man-2.jpeg
│   ├── man-3.webp
│   ├── man.jpg
│   ├── midudev.jpeg
│   ├── pancho.jpeg
│   ├── people.webp
│   ├── shiara.enc
│   ├── shiara.jpeg
│   ├── sticker.webp
│   ├── typewriter-1.mp3
│   ├── typewriter-return-1.mp3
│   ├── woman-2.jpeg
│   ├── woman-3.jpg
│   └── woman.jpg
├── .eslintrc.json
├── .gitignore
├── .prettierignore
├── .prettierrc
├── bun.lockb
├── components.json
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
├── test.ts
└── tsconfig.json
```

### cuevaio

**Languages**: TypeScript, CSS, JavaScript

**File Tree**:

```
├── public/
│   ├── sounds/
│   │   └── bite.mp3
│   ├── meet.png
│   ├── movies.png
│   ├── next.svg
│   └── vercel.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── hello/
│   │   │       └── route.ts
│   │   ├── cal/
│   │   │   └── page.tsx
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   ├── call/
│   │   │   └── page.tsx
│   │   ├── meet/
│   │   │   └── page.tsx
│   │   ├── movies/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── not-found.tsx
│   │   ├── page.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── icons/
│   │   │   └── ui/
│   │   │       ├── github.tsx
│   │   │       ├── index.ts
│   │   │       ├── linkedin.tsx
│   │   │       └── x.tsx
│   │   ├── slides/
│   │   │   ├── contact.tsx
│   │   │   ├── hero.tsx
│   │   │   └── projects.tsx
│   │   ├── ui/
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── hover-card.tsx
│   │   │   └── scroll-area.tsx
│   │   ├── animated-text.tsx
│   │   ├── fathom.tsx
│   │   └── noise.tsx
│   ├── lib/
│   │   ├── bots-list.ts
│   │   ├── detect-bot.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .eslintrc.json
├── .gitignore
├── env.d.ts
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
└── wrangler.toml
```

### mistral-ocr

**Languages**: TypeScript

**File Tree**:

```
├── .gitignore
├── bun.lock
├── index.ts
├── package.json
├── README.md
└── tsconfig.json
```

### mygoodday

**Languages**: TypeScript, CSS, JavaScript

**File Tree**:

```
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/
│   │   │   │   ├── fitia.ts
│   │   │   │   └── route.ts
│   │   │   └── webhooks/
│   │   │       └── route.ts
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── chat/
│   │   │   ├── DateDivider.tsx
│   │   │   └── MessageItem.tsx
│   │   ├── macro-summary/
│   │   │   ├── index.tsx
│   │   │   └── skeleton.tsx
│   │   └── ui/
│   │       ├── accordion.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       └── skeleton.tsx
│   ├── db/
│   │   └── redis.ts
│   ├── lib/
│   │   ├── indexedDB.ts
│   │   └── utils.ts
│   └── middleware.ts
├── .gitignore
├── .prettierignore
├── .prettierrc
├── components.json
├── eslint.config.mjs
├── LICENSE
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
├── tailwind.config.ts
└── tsconfig.json
```



---

*Generated on 2025-05-03*
