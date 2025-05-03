# Ignacior's GitHub Profile

- **Username**: [@Jibaru](https://github.com/Jibaru)
- **Location**: Lima, Perú
- **Public Repositories**: 109
- **Followers**: 36
- **Following**: 48
- **Total Stars Earned**: 397 (including organization repositories)

## Top Repositories (Including Organizations)

| Repository | Stars | URL |
|------------|-------|-----|
| text0 | 284 | [View](https://github.com/crafter-station/text0) |
| gobeats | 38 | [View](https://github.com/Jibaru/gobeats) |
| gostore | 24 | [View](https://github.com/Jibaru/gostore) |
| drive-music-player | 7 | [View](https://github.com/Jibaru/drive-music-player) |
| home-inventory-api | 5 | [View](https://github.com/Jibaru/home-inventory-api) |
| red-cetario | 3 | [View](https://github.com/Jibaru/red-cetario) |
| patterns-of-enterprise-application-in-go | 3 | [View](https://github.com/Jibaru/patterns-of-enterprise-application-in-go) |
| umineko-chiru-steam-spanish | 3 | [View](https://github.com/Jibaru/umineko-chiru-steam-spanish) |
| gradual | 3 | [View](https://github.com/crafter-station/gradual) |
| golang-data-structures | 2 | [View](https://github.com/Jibaru/golang-data-structures) |

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

### gobeats

**Languages**: Go, Shell, Dockerfile

**File Tree**:

```
├── .idea/
│   ├── .gitignore
│   ├── gobeats.iml
│   ├── modules.xml
│   └── vcs.xml
├── assets/
│   └── images/
│       ├── icon.png
│       └── windows_screenshot.png
├── bin/
│   └── .gitkeep
├── cmd/
│   ├── config/
│   │   ├── app.go
│   │   └── context.go
│   └── gobeats/
│       └── main.go
├── internal/
│   ├── entities/
│   │   ├── drive_file.go
│   │   └── drive_player.go
│   ├── services/
│   │   ├── cached_drive_files_service.go
│   │   ├── get_drive_files_service_test.go
│   │   └── get_drive_files_service.go
│   └── ui/
│       └── cmd_user_interface.go
├── pkg/
│   └── time/
│       └── format.go
├── .gitignore
├── build.sh
├── config.example.yml
├── Dockerfile
├── go.mod
├── go.sum
├── LICENSE
└── README.md
```

### gostore

**Languages**: Go, Shell

**File Tree**:

```
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
```

### drive-music-player

**Languages**: JavaScript, Vue, Shell, HTML

**File Tree**:

```
├── screenshots/
│   ├── screenshot-1.png
│   ├── screenshot-2.png
│   ├── screenshot-3.png
│   └── screenshot-4.png
├── server/
│   ├── app/
│   │   ├── public/
│   │   │   ├── favicon.ico
│   │   │   └── index.html
│   │   ├── src/
│   │   │   ├── assets/
│   │   │   │   ├── fonts/
│   │   │   │   │   └── roboto/
│   │   │   │   │       ├── Roboto-Black.ttf
│   │   │   │   │       ├── Roboto-BlackItalic.ttf
│   │   │   │   │       ├── Roboto-Bold.ttf
│   │   │   │   │       ├── Roboto-BoldItalic.ttf
│   │   │   │   │       ├── Roboto-Italic.ttf
│   │   │   │   │       ├── Roboto-Light.ttf
│   │   │   │   │       ├── Roboto-LightItalic.ttf
│   │   │   │   │       ├── Roboto-Medium.ttf
│   │   │   │   │       ├── Roboto-MediumItalic.ttf
│   │   │   │   │       ├── Roboto-Regular.ttf
│   │   │   │   │       ├── Roboto-Thin.ttf
│   │   │   │   │       └── Roboto-ThinItalic.ttf
│   │   │   │   ├── img/
│   │   │   │   │   ├── background.svg
│   │   │   │   │   └── default-song-image.jpg
│   │   │   │   └── logo.png
│   │   │   ├── components/
│   │   │   │   ├── menu/
│   │   │   │   │   ├── TheMenu.vue
│   │   │   │   │   └── TheSongsMenu.vue
│   │   │   │   ├── nav/
│   │   │   │   │   └── TheNavbar.vue
│   │   │   │   ├── play-control/
│   │   │   │   │   ├── ElapsedTimeBar.vue
│   │   │   │   │   ├── PlayControl.vue
│   │   │   │   │   └── VolumeControl.vue
│   │   │   │   ├── playlist/
│   │   │   │   │   ├── AddSongsToPlaylistDialog.vue
│   │   │   │   │   ├── DeletePlaylistDialog.vue
│   │   │   │   │   ├── NewPlaylistDialog.vue
│   │   │   │   │   ├── PlaylistItem.vue
│   │   │   │   │   └── PlaylistList.vue
│   │   │   │   ├── song/
│   │   │   │   │   ├── AddSongToPlaylistsDialog.vue
│   │   │   │   │   ├── CurrentSong.vue
│   │   │   │   │   ├── CurrentSongList.vue
│   │   │   │   │   ├── FavoriteSongsList.vue
│   │   │   │   │   ├── SongItem.vue
│   │   │   │   │   └── SongList.vue
│   │   │   │   ├── ui/
│   │   │   │   │   ├── BaseButton.vue
│   │   │   │   │   ├── BaseConfirmDialog.vue
│   │   │   │   │   ├── BaseDialog.vue
│   │   │   │   │   ├── BaseIcon.vue
│   │   │   │   │   ├── BaseIconButton.vue
│   │   │   │   │   ├── BaseSnackbar.vue
│   │   │   │   │   └── BaseSpinner.vue
│   │   │   │   └── user/
│   │   │   │       ├── ChangeRootDriveKey.vue
│   │   │   │       └── UserData.vue
│   │   │   ├── config/
│   │   │   │   └── api-uri.js
│   │   │   ├── pages/
│   │   │   │   ├── mobile/
│   │   │   │   │   ├── CurrentPlaylistPage.vue
│   │   │   │   │   ├── CurrentSongPage.vue
│   │   │   │   │   ├── MenuPage.vue
│   │   │   │   │   └── MobilePage.vue
│   │   │   │   ├── HomePage.vue
│   │   │   │   ├── LoginPage.vue
│   │   │   │   └── RegisterPage.vue
│   │   │   ├── plugins/
│   │   │   │   └── fortawesome.js
│   │   │   ├── services/
│   │   │   │   ├── playlist/
│   │   │   │   │   ├── create-user-playlist-song.service.js
│   │   │   │   │   ├── create-user-playlist.service.js
│   │   │   │   │   ├── delete-user-playlist-song.service.js
│   │   │   │   │   ├── delete-user-playlist.service.js
│   │   │   │   │   └── get-user-playlists.service.js
│   │   │   │   ├── song/
│   │   │   │   │   ├── get-user-songs.service.js
│   │   │   │   │   ├── increase-times-played-by-one-user-song.service.js
│   │   │   │   │   ├── set-duration-user-song.service.js
│   │   │   │   │   └── update-favorite-user-song.service.js
│   │   │   │   ├── user/
│   │   │   │   │   ├── refresh-user-songs.service.js
│   │   │   │   │   └── update-user-root-drive-key.service.js
│   │   │   │   └── auth.service.js
│   │   │   ├── store/
│   │   │   │   ├── modules/
│   │   │   │   │   ├── auth/
│   │   │   │   │   │   ├── actions.js
│   │   │   │   │   │   ├── getters.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── mutations.js
│   │   │   │   │   ├── current-playback/
│   │   │   │   │   │   ├── actions.js
│   │   │   │   │   │   ├── getters.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── mutations.js
│   │   │   │   │   ├── playlist/
│   │   │   │   │   │   ├── actions.js
│   │   │   │   │   │   ├── getters.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── mutations.js
│   │   │   │   │   ├── song/
│   │   │   │   │   │   ├── actions.js
│   │   │   │   │   │   ├── getters.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── mutations.js
│   │   │   │   │   └── user/
│   │   │   │   │       ├── actions.js
│   │   │   │   │       ├── getters.js
│   │   │   │   │       ├── index.js
│   │   │   │   │       └── mutations.js
│   │   │   │   └── index.js
│   │   │   ├── utils/
│   │   │   │   └── fetch.utils.js
│   │   │   ├── App.vue
│   │   │   ├── main.js
│   │   │   └── routes.js
│   │   ├── .env.development
│   │   ├── .gitignore
│   │   ├── babel.config.js
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── README.md
│   │   └── vue.config.js
│   ├── src/
│   │   ├── api/
│   │   │   ├── constants/
│   │   │   │   └── google-drive/
│   │   │   │       ├── google-drive.mimetype.js
│   │   │   │       └── google-drive.uri.js
│   │   │   ├── controllers/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.controller.js
│   │   │   │   │   ├── pre-register.controller.js
│   │   │   │   │   └── register.controller.js
│   │   │   │   ├── playlist/
│   │   │   │   │   └── get-playlist-songs.controller.js
│   │   │   │   └── user/
│   │   │   │       ├── create-user-playlist-song.controller.js
│   │   │   │       ├── create-user-playlist.controller.js
│   │   │   │       ├── delete-user-playlist-song-controller.js
│   │   │   │       ├── delete-user-playlist.controller.js
│   │   │   │       ├── get-user-playlists.controller.js
│   │   │   │       ├── get-user-songs.controller.js
│   │   │   │       ├── increase-times-played-by-one-user-song.controller.js
│   │   │   │       ├── refresh-user-songs.controller.js
│   │   │   │       ├── set-duration-milliseconds-user-song.controller.js
│   │   │   │       ├── update-favorite-user-song.controller.js
│   │   │   │       └── update-user-root-drive-key.controller.js
│   │   │   ├── middlewares/
│   │   │   │   └── auth/
│   │   │   │       ├── check-admin-role.middleware.js
│   │   │   │       └── check-token.middleware.js
│   │   │   ├── routes/
│   │   │   │   ├── auth.routes.js
│   │   │   │   ├── index.js
│   │   │   │   ├── playlist.routes.js
│   │   │   │   └── user.routes.js
│   │   │   ├── services/
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.service.js
│   │   │   │   │   └── register.service.js
│   │   │   │   ├── external/
│   │   │   │   │   └── get-drive-files-metadata.service.js
│   │   │   │   ├── mail/
│   │   │   │   │   └── send-mail.service.js
│   │   │   │   ├── playlists/
│   │   │   │   │   ├── contains-user-playlist.service.js
│   │   │   │   │   ├── create-one-playlist.service.js
│   │   │   │   │   ├── create-playlist-song.service.js
│   │   │   │   │   ├── delete-playlist-song.service.js
│   │   │   │   │   ├── delete-playlist.service.js
│   │   │   │   │   ├── get-all-playlist-songs.service.js
│   │   │   │   │   └── get-all-playlists.service.js
│   │   │   │   ├── signup-information/
│   │   │   │   │   ├── create-one-signup-information.service.js
│   │   │   │   │   ├── exists-signup-information.service.js
│   │   │   │   │   ├── get-one-signup-information.service.js
│   │   │   │   │   └── update-signup-information.service.js
│   │   │   │   ├── songs/
│   │   │   │   │   ├── contains-user-song.service.js
│   │   │   │   │   ├── get-all-songs.service.js
│   │   │   │   │   ├── increase-times-played-song.service.js
│   │   │   │   │   ├── update-or-create-songs-from-metadata.service.js
│   │   │   │   │   └── update-song.service.js
│   │   │   │   └── users/
│   │   │   │       ├── exists-user.service.js
│   │   │   │       ├── get-one-user.service.js
│   │   │   │       └── update-user-root-drive-key.service.js
│   │   │   └── index.js
│   │   ├── db/
│   │   │   ├── config/
│   │   │   │   └── config.js
│   │   │   ├── migrations/
│   │   │   │   ├── 20210210014604-users-migration-skeleton.js
│   │   │   │   ├── 20210210014919-songs-migration-skeleton.js
│   │   │   │   ├── 20210210015247-playlists-migration-skeleton.js
│   │   │   │   ├── 20210210015358-playlists-songs-migration-skeleton.js
│   │   │   │   └── 20210210015359-signup-informations-migration-skeleton.js
│   │   │   └── models/
│   │   │       ├── index.js
│   │   │       ├── playlist-song.js
│   │   │       ├── playlist.js
│   │   │       ├── signup-information.js
│   │   │       ├── song.js
│   │   │       └── user.js
│   │   ├── utils/
│   │   │   ├── jwt.util.js
│   │   │   └── random-pin.util.js
│   │   └── server.js
│   ├── .env.example
│   ├── .env.old
│   ├── .gitignore
│   ├── .sequelizerc
│   ├── package-lock.json
│   ├── package.json
│   └── README.md
├── .gitignore
└── README.md
```

### home-inventory-api

**Languages**: Go, Shell, Makefile, Dockerfile

**File Tree**:

```
├── .github/
│   └── workflows/
│       └── go.yml
├── .idea/
│   ├── .gitignore
│   ├── home-inventory-api.iml
│   ├── modules.xml
│   └── vcs.xml
├── assets/
│   └── images/
│       ├── app-schema.png
│       └── logo.png
├── bin/
│   └── .gitkeep
├── cmd/
│   └── app/
│       ├── config.go
│       └── main.go
├── internal/
│   └── app/
│       ├── application/
│       │   ├── listeners/
│       │   │   ├── create_add_box_transaction.go
│       │   │   ├── create_remove_box_transaction.go
│       │   │   └── rollback_asset.go
│       │   └── services/
│       │       ├── arguments.go
│       │       ├── asset_test.go
│       │       ├── asset.go
│       │       ├── auth_test.go
│       │       ├── auth.go
│       │       ├── box_test.go
│       │       ├── box.go
│       │       ├── item_test.go
│       │       ├── item.go
│       │       ├── room_test.go
│       │       ├── room.go
│       │       ├── user_test.go
│       │       ├── user.go
│       │       ├── version_test.go
│       │       └── version.go
│       ├── domain/
│       │   ├── entities/
│       │   │   ├── asset_test.go
│       │   │   ├── asset.go
│       │   │   ├── box_item_test.go
│       │   │   ├── box_item.go
│       │   │   ├── box_test.go
│       │   │   ├── box_transaction_test.go
│       │   │   ├── box_transaction.go
│       │   │   ├── box.go
│       │   │   ├── entity.go
│       │   │   ├── item_keyword_test.go
│       │   │   ├── item_keyword.go
│       │   │   ├── item_test.go
│       │   │   ├── item.go
│       │   │   ├── room_test.go
│       │   │   ├── room.go
│       │   │   ├── user_test.go
│       │   │   ├── user.go
│       │   │   └── version.go
│       │   ├── repositories/
│       │   │   ├── arguments.go
│       │   │   ├── asset.go
│       │   │   ├── box.go
│       │   │   ├── item_keyword.go
│       │   │   ├── item.go
│       │   │   ├── room.go
│       │   │   ├── user.go
│       │   │   └── version.go
│       │   └── services/
│       │       ├── event_bus.go
│       │       ├── file_manager.go
│       │       ├── mail_sender.go
│       │       └── token_generator.go
│       └── infrastructure/
│           ├── controllers/
│           │   ├── add_item_into_box.go
│           │   ├── change_box_room.go
│           │   ├── create_asset.go
│           │   ├── create_box.go
│           │   ├── create_item.go
│           │   ├── create_room.go
│           │   ├── delete_box.go
│           │   ├── delete_room.go
│           │   ├── get_box_transactions.go
│           │   ├── get_boxes.go
│           │   ├── get_items.go
│           │   ├── get_rooms.go
│           │   ├── health.go
│           │   ├── login.go
│           │   ├── mappers.go
│           │   ├── remove_item_from_box.go
│           │   ├── signon.go
│           │   ├── transfer_item.go
│           │   ├── update_box.go
│           │   ├── update_item.go
│           │   └── update_room.go
│           ├── database/
│           │   ├── connection_test.go
│           │   ├── connection.go
│           │   └── logger.go
│           ├── http/
│           │   ├── middlewares/
│           │   │   ├── logger.go
│           │   │   └── needs_auth.go
│           │   └── server.go
│           ├── repositories/
│           │   ├── gorm/
│           │   │   ├── asset_test.go
│           │   │   ├── asset.go
│           │   │   ├── box_test.go
│           │   │   ├── box.go
│           │   │   ├── db.go
│           │   │   ├── helpers_test.go
│           │   │   ├── helpers.go
│           │   │   ├── item_keyword_test.go
│           │   │   ├── item_keyword.go
│           │   │   ├── item_test.go
│           │   │   ├── item.go
│           │   │   ├── room_test.go
│           │   │   ├── room.go
│           │   │   ├── user_test.go
│           │   │   ├── user.go
│           │   │   ├── version_test.go
│           │   │   └── version.go
│           │   └── stub/
│           │       ├── asset.go
│           │       ├── box.go
│           │       ├── item_keyword.go
│           │       ├── item.go
│           │       ├── room.go
│           │       ├── user.go
│           │       └── version.go
│           ├── responses/
│           │   ├── data_test.go
│           │   ├── data.go
│           │   ├── message_test.go
│           │   ├── message.go
│           │   ├── paginated_test.go
│           │   └── paginated.go
│           └── services/
│               ├── aws/
│               │   ├── file_manager_test.go
│               │   └── file_manager.go
│               ├── gmail/
│               │   ├── mail_sender.go
│               │   └── mal_sender_test.go
│               ├── jwt/
│               │   ├── token_generator_test.go
│               │   └── token_generator.go
│               ├── memory/
│               │   ├── event_bus_test.go
│               │   └── event_bus.go
│               └── stub/
│                   ├── event_bus.go
│                   ├── file_manager.go
│                   ├── mail_sender.go
│                   └── token_generator.go
├── logger/
│   └── logger.go
├── logs/
│   └── .gitkeep
├── migrations/
│   ├── 20240112030314_create_versions_table.sql
│   ├── 20240112030533_create_users_table.sql
│   ├── 20240117211440_create_rooms_table.sql
│   ├── 20240120225709_create_assets_table.sql
│   ├── 20240124032431_create_boxes_table.sql
│   ├── 20240124204303_create_items_table.sql
│   ├── 20240124204314_create_item_keywords_table.sql
│   ├── 20240127233223_create_box_items_table.sql
│   └── 20240127233226_create_box_transactions_table.sql
├── notifier/
│   └── notifier.go
├── .gitignore
├── app.env.example
├── build.sh
├── docker-compose.yml
├── Dockerfile
├── go.mod
├── go.sum
├── LICENSE.txt
├── Makefile
└── README.md
```

### red-cetario

**Languages**: Kotlin

**File Tree**:

```
├── app/
│   ├── src/
│   │   ├── androidTest/
│   │   │   └── java/
│   │   │       └── com/
│   │   │           └── untels/
│   │   │               └── redcetario/
│   │   │                   └── ExampleInstrumentedTest.kt
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── untels/
│   │   │   │           └── redcetario/
│   │   │   │               ├── activities/
│   │   │   │               │   ├── InicioSesionActivity.kt
│   │   │   │               │   ├── MainActivity.kt
│   │   │   │               │   ├── NotificacionesActivity.kt
│   │   │   │               │   ├── PerfilActivity.kt
│   │   │   │               │   ├── RecetaActivity.kt
│   │   │   │               │   ├── RecetasActivity.kt
│   │   │   │               │   └── RegistroActivity.kt
│   │   │   │               ├── adapter/
│   │   │   │               │   ├── ComentarioAdapter.kt
│   │   │   │               │   ├── IngredienteAdapter.kt
│   │   │   │               │   ├── MaterialAdapter.kt
│   │   │   │               │   ├── NotificacionAdapter.kt
│   │   │   │               │   ├── PasoAdapter.kt
│   │   │   │               │   └── RecetaCabeceraAdapter.kt
│   │   │   │               ├── constant/
│   │   │   │               │   └── Constantes.kt
│   │   │   │               ├── dialogos/
│   │   │   │               │   ├── DialogoCarga.kt
│   │   │   │               │   ├── DialogoMensaje.kt
│   │   │   │               │   └── DialogoNotificacion.kt
│   │   │   │               ├── model/
│   │   │   │               │   ├── Cliente.kt
│   │   │   │               │   ├── ClienteId.kt
│   │   │   │               │   ├── Comentario.kt
│   │   │   │               │   ├── Ingrediente.kt
│   │   │   │               │   ├── Material.kt
│   │   │   │               │   ├── Notificacion.kt
│   │   │   │               │   ├── Paso.kt
│   │   │   │               │   ├── PivotIngrediente.kt
│   │   │   │               │   ├── Receta.kt
│   │   │   │               │   └── RecetaCabecera.kt
│   │   │   │               ├── response/
│   │   │   │               │   ├── ActualizarClienteResponse.kt
│   │   │   │               │   ├── InicioSesionResponse.kt
│   │   │   │               │   ├── NotificacionesResponse.kt
│   │   │   │               │   ├── RecetaResponse.kt
│   │   │   │               │   ├── RecetasResponse.kt
│   │   │   │               │   └── RegistroResponse.kt
│   │   │   │               ├── service/
│   │   │   │               │   ├── AutenticacionService.kt
│   │   │   │               │   ├── ClienteService.kt
│   │   │   │               │   ├── NotificacionService.kt
│   │   │   │               │   ├── RecetaService.kt
│   │   │   │               │   └── ServiceManager.kt
│   │   │   │               └── utils/
│   │   │   │                   ├── CargadorUtil.kt
│   │   │   │                   ├── DialogoMensajeUtil.kt
│   │   │   │                   └── DialogoNotificacionUtil.kt
│   │   │   ├── res/
│   │   │   │   ├── drawable/
│   │   │   │   │   ├── ic_launcher_background.xml
│   │   │   │   │   ├── icono_advertencia.png
│   │   │   │   │   ├── icono_calendario.png
│   │   │   │   │   ├── icono_flecha_atras.png
│   │   │   │   │   ├── icono_letra_a.png
│   │   │   │   │   ├── icono_nuevo.png
│   │   │   │   │   ├── icono_usuario.png
│   │   │   │   │   ├── logo_redcetario_titulo.png
│   │   │   │   │   ├── logo_redcetario.png
│   │   │   │   │   ├── shape_cuadro_texto.xml
│   │   │   │   │   └── splash_background.xml
│   │   │   │   ├── drawable-v24/
│   │   │   │   │   └── ic_launcher_foreground.xml
│   │   │   │   ├── layout/
│   │   │   │   │   ├── activity_inicio_sesion.xml
│   │   │   │   │   ├── activity_main.xml
│   │   │   │   │   ├── activity_notificaciones.xml
│   │   │   │   │   ├── activity_perfil.xml
│   │   │   │   │   ├── activity_receta.xml
│   │   │   │   │   ├── activity_recetas.xml
│   │   │   │   │   ├── activity_registro.xml
│   │   │   │   │   ├── dialogo_carga.xml
│   │   │   │   │   ├── dialogo_mensaje.xml
│   │   │   │   │   ├── dialogo_notificacion.xml
│   │   │   │   │   ├── item_comentario.xml
│   │   │   │   │   ├── item_ingrediente.xml
│   │   │   │   │   ├── item_material.xml
│   │   │   │   │   ├── item_notificacion.xml
│   │   │   │   │   ├── item_paso.xml
│   │   │   │   │   └── item_receta.xml
│   │   │   │   ├── menu/
│   │   │   │   │   ├── item_menu_notificaciones.xml
│   │   │   │   │   └── item_menu.xml
│   │   │   │   ├── mipmap-anydpi-v26/
│   │   │   │   │   ├── ic_launcher_round.xml
│   │   │   │   │   └── ic_launcher.xml
│   │   │   │   ├── mipmap-hdpi/
│   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   ├── ic_launcher_round.png
│   │   │   │   │   └── ic_launcher.png
│   │   │   │   ├── mipmap-mdpi/
│   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   ├── ic_launcher_round.png
│   │   │   │   │   └── ic_launcher.png
│   │   │   │   ├── mipmap-xhdpi/
│   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   ├── ic_launcher_round.png
│   │   │   │   │   └── ic_launcher.png
│   │   │   │   ├── mipmap-xxhdpi/
│   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   ├── ic_launcher_round.png
│   │   │   │   │   └── ic_launcher.png
│   │   │   │   ├── mipmap-xxxhdpi/
│   │   │   │   │   ├── ic_launcher_foreground.png
│   │   │   │   │   ├── ic_launcher_round.png
│   │   │   │   │   └── ic_launcher.png
│   │   │   │   ├── raw/
│   │   │   │   │   └── circular_animations.json
│   │   │   │   ├── values/
│   │   │   │   │   ├── colors.xml
│   │   │   │   │   ├── strings.xml
│   │   │   │   │   └── themes.xml
│   │   │   │   └── values-night/
│   │   │   │       └── themes.xml
│   │   │   ├── AndroidManifest.xml
│   │   │   └── ic_launcher-playstore.png
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── untels/
│   │                   └── redcetario/
│   │                       └── ExampleUnitTest.kt
│   ├── .gitignore
│   ├── build.gradle
│   └── proguard-rules.pro
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar
│       └── gradle-wrapper.properties
├── screenshots/
│   ├── 01.png
│   ├── 02.png
│   ├── 03.png
│   ├── 04.png
│   ├── 05.png
│   ├── 06.png
│   ├── 1.png
│   ├── 2.png
│   └── 3.png
├── .gitignore
├── build.gradle
├── gradle.properties
├── gradlew
├── gradlew.bat
├── LICENSE
├── README.md
└── settings.gradle
```

### patterns-of-enterprise-application-in-go

**Languages**: Go, HTML

**File Tree**:

```
├── 01-domain-logic/
│   ├── 01-transaction-script/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── scripts/
│   │   │       └── transfer.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-domain-model/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── models/
│   │   │       ├── storage/
│   │   │       │   └── orders.go
│   │   │       ├── customer.go
│   │   │       ├── order.go
│   │   │       └── product.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 03-table-module/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── modules/
│   │   │       ├── contract.go
│   │   │       ├── product.go
│   │   │       └── revenue_recognition.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 04-service-layer/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── data/
│       │   │   └── user.go
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── repositories/
│       │   │   └── user_repository.go
│       │   └── services/
│       │       └── user_service.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 02-data-source-architectural/
│   ├── 01-table-data-gateway/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── gateways/
│   │   │       └── employee_gateway.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-row-data-gateway/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── gateways/
│   │   │       └── employee_gateway.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 03-active-record/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       └── person.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 04-data-mapper/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── domain/
│       │   │   └── person.go
│       │   └── mappers/
│       │       └── person_mapper.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 03-object-relational-behavioral/
│   ├── 01-unit-of-work/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   ├── db.go
│   │   │   │   └── unit_of_work.go
│   │   │   ├── domain/
│   │   │   │   └── book.go
│   │   │   └── scripts/
│   │   │       ├── delete_books.go
│   │   │       ├── register_books.go
│   │   │       └── update_books.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-identity-map/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   ├── db.go
│   │   │   │   └── identity_map.go
│   │   │   ├── domain/
│   │   │   │   └── drone.go
│   │   │   └── services/
│   │   │       └── drone_service.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 03-lazy-load/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── domain/
│       │   │   ├── customer.go
│       │   │   └── order.go
│       │   └── services/
│       │       └── customer_service.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 04-object-relational-structural/
│   ├── 01-identity-field/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       └── device.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-foreign-key-mapping/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       ├── album.go
│   │   │       └── artist.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 03-association-table-mapping/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       ├── author_book.go
│   │   │       ├── author.go
│   │   │       └── book.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 04-dependent-mapping/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       ├── album.go
│   │   │       └── track.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 05-embedded-value/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       ├── daterange.go
│   │   │       ├── employment.go
│   │   │       ├── money.go
│   │   │       └── person.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 06-serialized-lob/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       ├── customer.go
│   │   │       └── department.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 07-single-table-inheritance/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       └── player.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 08-class-table-inheritance/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       └── player.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 09-concrete-table-inheritance/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   └── domain/
│   │   │       └── player.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 10-inheritance-mappers/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── domain/
│       │   │   └── domain.go
│       │   └── mapper/
│       │       ├── bowler.go
│       │       ├── cricketer.go
│       │       ├── footballer.go
│       │       └── player.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 05-object-relational-metadata-mapping/
│   ├── 01-metadata-mapping/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── domain/
│   │   │   │   ├── customer.go
│   │   │   │   └── product.go
│   │   │   ├── mapper/
│   │   │   │   ├── json.go
│   │   │   │   └── tag.go
│   │   │   └── metadata/
│   │   │       └── mapping.json
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-query-object/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── domain/
│   │   │   │   └── product.go
│   │   │   └── persistence/
│   │   │       ├── criteria.go
│   │   │       └── product_repository.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 03-repository/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── domain/
│       │   │   └── user.go
│       │   └── repository/
│       │       └── user.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 06-web-presentation/
│   ├── 01-model-view-controller/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── todo.go
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   └── todo.go
│   │   │   └── views/
│   │   │       └── templates/
│   │   │           ├── create.html
│   │   │           ├── edit.html
│   │   │           └── index.html
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-page-controller/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   ├── home.go
│   │   │   │   └── post.go
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   └── post.go
│   │   │   └── views/
│   │   │       └── templates/
│   │   │           ├── create.html
│   │   │           ├── edit.html
│   │   │           └── home.html
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 03-front-controller/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   ├── create_post_command.go
│   │   │   │   ├── edit_post_command.go
│   │   │   │   ├── front_controller.go
│   │   │   │   └── home_command.go
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   └── post.go
│   │   │   └── views/
│   │   │       └── templates/
│   │   │           ├── create.html
│   │   │           ├── edit.html
│   │   │           └── home.html
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 04-template-view/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── book.go
│   │   │   ├── domain/
│   │   │   │   └── book.go
│   │   │   └── views/
│   │   │       ├── helpers/
│   │   │       │   └── book_helper.go
│   │   │       └── templates/
│   │   │           └── book.html
│   │   ├── go.mod
│   │   └── README.md
│   ├── 05-transform-view/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── controller.go
│   │   │   ├── domain/
│   │   │   │   ├── album.go
│   │   │   │   └── artist.go
│   │   │   └── views/
│   │   │       └── transformers/
│   │   │           ├── album.go
│   │   │           ├── artist.go
│   │   │           └── transformers.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 06-two-step-view/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── controllers.go
│   │   │   ├── domain/
│   │   │   │   └── domain.go
│   │   │   └── views/
│   │   │       ├── format/
│   │   │       │   └── format.go
│   │   │       └── logical/
│   │   │           ├── album.go
│   │   │           └── artist.go
│   │   ├── go.mod
│   │   └── README.md
│   └── 07-application-controller/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── commands/
│       │   │   └── commands.go
│       │   ├── controllers/
│       │   │   ├── application.go
│       │   │   └── input.go
│       │   ├── models/
│       │   │   └── user.go
│       │   └── views/
│       │       ├── templates/
│       │       │   └── user-view.html
│       │       └── views.go
│       ├── go.mod
│       └── README.md
├── 07-distribution/
│   ├── 01-remote-facade/
│   │   ├── client/
│   │   │   ├── cmd/
│   │   │   │   └── app/
│   │   │   │       └── main.go
│   │   │   ├── internal/
│   │   │   │   ├── domain/
│   │   │   │   │   └── address.go
│   │   │   │   ├── remote/
│   │   │   │   │   └── address_facade.go
│   │   │   │   └── utils/
│   │   │   │       └── utils.go
│   │   │   └── go.mod
│   │   ├── server/
│   │   │   ├── cmd/
│   │   │   │   └── app/
│   │   │   │       └── main.go
│   │   │   ├── internal/
│   │   │   │   ├── controllers/
│   │   │   │   │   └── controllers.go
│   │   │   │   └── domain/
│   │   │   │       └── address.go
│   │   │   └── go.mod
│   │   └── README.md
│   └── 02-data-transfer-object/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── dto/
│       │   │   └── user.go
│       │   ├── models/
│       │   │   └── user.go
│       │   └── services/
│       │       └── user.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 08-offline-concurrency/
│   ├── 01-optimistic-offline-lock/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   └── product.go
│   │   │   └── services/
│   │   │       └── product.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 02-pessimistic-offline-lock/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   └── product.go
│   │   │   └── services/
│   │   │       └── product.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 03-coarse-grained-lock/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── db/
│   │   │   │   └── db.go
│   │   │   ├── models/
│   │   │   │   ├── address.go
│   │   │   │   └── customer.go
│   │   │   └── services/
│   │   │       └── customer.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   └── 04-implicit-lock/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── models/
│       │   │   └── order.go
│       │   └── services/
│       │       └── order.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 09-session-state/
│   ├── 01-client-session-state/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── session.go
│   │   │   ├── models/
│   │   │   │   └── session.go
│   │   │   └── views/
│   │   │       ├── templates/
│   │   │       │   └── home.html
│   │   │       └── session.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 02-server-session-state/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── controllers/
│   │   │   │   └── session.go
│   │   │   ├── session/
│   │   │   │   └── manager.go
│   │   │   └── views/
│   │   │       └── templates/
│   │   │           └── home.html
│   │   ├── go.mod
│   │   └── README.md
│   └── 03-database-session-state/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── controllers/
│       │   │   └── session.go
│       │   ├── db/
│       │   │   └── db.go
│       │   ├── session/
│       │   │   └── manager.go
│       │   └── views/
│       │       └── templates/
│       │           └── home.html
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── 10-base/
│   ├── 01-gateway/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── gateways/
│   │   │   │   └── user.go
│   │   │   └── models/
│   │   │       └── user.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 02-mapper/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── models/
│   │   │   │   ├── asset.go
│   │   │   │   ├── customer.go
│   │   │   │   └── lease.go
│   │   │   └── pricing/
│   │   │       ├── mapper.go
│   │   │       └── pricing.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 03-layer-supertype/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   └── entities/
│   │   │       ├── customer.go
│   │   │       ├── entity.go
│   │   │       └── order.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 04-separated-interface/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── memory/
│   │   │   │   └── storage.go
│   │   │   ├── sqlite/
│   │   │   │   └── storage.go
│   │   │   └── storage/
│   │   │       └── storage.go
│   │   ├── go.mod
│   │   ├── go.sum
│   │   └── README.md
│   ├── 05-registry/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── registry/
│   │   │   │   └── registry.go
│   │   │   └── services/
│   │   │       ├── email.go
│   │   │       ├── payment.go
│   │   │       └── service.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 06-value-object/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   └── domain/
│   │   │       ├── entities/
│   │   │       │   └── user.go
│   │   │       └── values/
│   │   │           ├── address.go
│   │   │           ├── date_of_birth.go
│   │   │           ├── email.go
│   │   │           ├── name.go
│   │   │           └── phone.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 07-money/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   └── domain/
│   │   │       ├── entities/
│   │   │       │   └── product.go
│   │   │       └── values/
│   │   │           └── money.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 08-special-case/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── domain/
│   │   │   │   ├── specialcase/
│   │   │   │   │   └── no_order.go
│   │   │   │   └── order.go
│   │   │   └── repository/
│   │   │       └── order.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 09-plugin/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── domain/
│   │   │   │   └── plugin.go
│   │   │   ├── plugins/
│   │   │   │   ├── json.go
│   │   │   │   └── xml.go
│   │   │   └── processor/
│   │   │       └── processor.go
│   │   ├── go.mod
│   │   └── README.md
│   ├── 10-service-stub/
│   │   ├── cmd/
│   │   │   └── app/
│   │   │       └── main.go
│   │   ├── internal/
│   │   │   ├── domain/
│   │   │   │   └── user.go
│   │   │   ├── processor/
│   │   │   │   ├── user_test.go
│   │   │   │   └── user.go
│   │   │   └── services/
│   │   │       ├── user_stub.go
│   │   │       └── user.go
│   │   ├── go.mod
│   │   └── README.md
│   └── 11-record-set/
│       ├── cmd/
│       │   └── app/
│       │       └── main.go
│       ├── internal/
│       │   ├── data/
│       │   │   └── user.go
│       │   ├── db/
│       │   │   └── db.go
│       │   └── repositories/
│       │       └── user_repository.go
│       ├── go.mod
│       ├── go.sum
│       └── README.md
├── assets/
│   └── images/
│       └── logo.png
├── .gitignore
└── README.md
```

### umineko-chiru-steam-spanish

**Languages**: Python

**File Tree**:

```
├── screenshots/
│   ├── 01.jpg
│   ├── 02.jpg
│   ├── 03.jpg
│   ├── 04.jpg
│   ├── 05.jpg
│   └── 06.jpg
├── 0.utf
├── CONTRIBUTE.md
├── editor.py
├── main_old.py
├── metadata.yml
├── percentage_calc.py
└── README.md
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

### golang-data-structures

**Languages**: Go, Makefile

**File Tree**:

```
├── cmd/
│   └── main.go
├── diagrams/
│   ├── img/
│   │   ├── 01_stack.png
│   │   ├── 02_queue.png
│   │   ├── 03_simple_linked_list.png
│   │   ├── 04_double_linked_list.png
│   │   ├── 05_hashmap.png
│   │   ├── 06_tree.png
│   │   ├── 07_search_binary_tree.png
│   │   ├── 08_priority_queue.png
│   │   └── 09_graph.png
│   └── uxf/
│       ├── 01_stack.uxf
│       ├── 02_queue.uxf
│       ├── 03_simple_linked_list.uxf
│       ├── 04_double_linked_list.uxf
│       ├── 05_hashmap.uxf
│       ├── 06_tree.uxf
│       ├── 07_search_binary_tree.uxf
│       ├── 08_priority_queue.uxf
│       └── 09_graph.uxf
├── structures/
│   ├── adjacency_list_graph_test.go
│   ├── adjacency_list_graph.go
│   ├── adjacency_matrix_graph_test.go
│   ├── adjacency_matrix_graph.go
│   ├── common.go
│   ├── double_linked_list_test.go
│   ├── double_linked_list.go
│   ├── hashmap_test.go
│   ├── hashmap.go
│   ├── interfaces.go
│   ├── node.go
│   ├── priority_queue_test.go
│   ├── priority_queue.go
│   ├── queue_test.go
│   ├── queue.go
│   ├── search_binary_tree_test.go
│   ├── search_binary_tree.go
│   ├── simple_linked_list_test.go
│   ├── simple_linked_list.go
│   ├── stack_test.go
│   ├── stack.go
│   ├── tree_test.go
│   └── tree.go
├── .gitignore
├── go.mod
├── go.sum
├── LICENSE.md
├── Makefile
└── README.md
```



---

*Generated on 2025-05-03*
