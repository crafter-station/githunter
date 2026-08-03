# GitHunter Ranking System

## Autonomous product grilling

The product questions below were answered by default because the build was explicitly authorized to proceed autonomously.

### What is being ranked?

Public GitHub developer identities within a declared geographic scope. The launch scopes are Peru, Colombia, Venezuela, Bolivia, Chile, Ecuador, Argentina, Brazil, and Mexico. Country membership comes from a declared public cohort and is never inferred from nationality.

### Is there one objective best developer?

No. GitHunter provides objective calculations under explicit lenses. Balanced is the default overview, while Builder, OSS Impact, Maintainer, and Rising expose different legitimate interpretations.

### What makes a result trustworthy?

Every result exposes the cohort, evidence window, data timestamp, lens version, raw metrics, normalized metric contributions, exclusions, and confidence. Confidence reflects whether every evidence window required by the lens is available. An observed zero is scored as zero rather than treated as missing.

### How is gaming controlled?

Raw volume is capped through percentile normalization, so extreme totals cannot dominate by magnitude. Private activity is excluded. Known source errors can be excluded with published evidence, and repository adoption ignores forks owned by the developer. GitHub does not expose commit substance through contribution totals, so empty, generated, or tiny commits are not silently treated as quality. Commit volume is one signal inside broader lenses and this limitation remains visible.

### How should time work?

Activity lenses reset at the beginning of each calendar quarter. Durable adoption metrics use the current public state, captured in the same dated snapshot. Rising compares quarter-to-date activity against the same elapsed window in the preceding quarter.

Historical 2026 Q1 and Q2 activity is reconstructed from GitHub's dated contribution record. Stars, forks, followers, and repository reach cannot be recovered at their past values, so they are excluded from reconstructed scores. Reconstructed quarters contribute to Form but never award championships, podiums, or official All-Time points.

### What happens when data is incomplete?

Collection only admits profiles with a complete current evidence window. Rising can retain a profile without a prior comparison window, scores only the available comparable facts, and lowers confidence explicitly.

### How often does it update?

Live standings refresh daily. Public pages are served from versioned daily snapshots and normalized season results. A successful retry on the same day replaces that day's provisional result. Quarter close freezes the cohort, ruleset, champion, and complete standings. A verified bundled snapshot keeps the product available before the first database migration or during an infrastructure outage.

### How do seasons and the historical record work?

The current season is provisional until quarter close. Form averages the latest four available season scores. All-Time sums official closed-season scores, while championships and podiums remain separate honors. The public table may show a bounded ranking, but the index persists every eligible result so a developer can retrieve an exact position within the declared cohort.

### Can users create arbitrary rankings?

The production MVP ships stable named lenses first. Custom weights are deferred until saved, shareable definitions can also be versioned and reproduced.

## Production lenses

| Lens | Question answered | Default emphasis |
| --- | --- | --- |
| Balanced | Who combines sustained work, collaboration, and public impact? | Activity, merged work, adoption, maintenance |
| Builder | Who consistently ships public work? | Commits, public contributions, merged pull requests, external repositories |
| OSS Impact | Whose public work is adopted by others? | Stars, forks, followers |
| Maintainer | Who keeps projects and collaboration healthy? | Reviews, merged pull requests, issues, pull requests, external repositories |
| Rising | Who has the strongest recent acceleration? | Recent pace relative to prior pace, with minimum evidence requirements |

## Ranking contract

Each public snapshot contains:

- Scope and cohort definition
- Lens identifier and immutable version
- Evidence window and generation timestamp
- Ranked entries with score, rank movement, confidence, and metric breakdown
- Data-source provenance and documented exclusions
- A stable latest URL, dated snapshot identifier, and direct URL for every GitHub profile

## Initial production boundary

The first release supports nine Latin American countries and five fixed lenses. It uses the latest verified public datasets as bundled baselines, a versioned scoring engine, a cache-ready snapshot store, a public JSON API, an indexable ranking interface, and a daily refresh task. LATAM aggregation and custom lenses follow through the same contracts without changing existing historical snapshots.

## Remaining shaped scope

The original shape is not complete. The next product slices are:

1. Saved, shareable custom lenses with explicit weights, evidence window, version, and a reproducible lens hash.
2. Daily immutable snapshots with rank movement instead of a latest-only fallback.
3. Visible multi-country evidence and a primary-country policy for profiles that appear in more than one cohort.
4. Cohort expansion beyond the 256-account committers.top discovery list.
5. Per-profile score explanations with sensitivity checks and missing-data warnings.

Custom lenses must remain separate from the fixed defaults. They cannot silently replace Balanced or rewrite historical results.

## Operations

Apply migrations through `drizzle/0012_github_ladder_seasons.sql` before enabling refreshes. The Trigger.dev task `refresh-ranking-snapshots` runs every day at 06:00 in `America/Lima` and requires `GITHUB_TOKEN`, `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.

The same refresh can be run manually with `bun run rankings:refresh` for every launch country or `bun run rankings:refresh peru` for one scope. `bun run rankings:bundle <country>` regenerates an audited fallback dataset and should only be committed after checking cohort membership and the resulting top ranks. Explicit source errors are recorded with evidence in a country exclusions file and removed before collection.

Run `bun run rankings:seasons:backfill:2026` to reconstruct 2026 Q1 and Q2 from dated public activity. The command is idempotent and deliberately omits OSS Impact because GitHub does not expose historical adoption totals.

Public pages choose the freshest version-compatible snapshot from:

1. Latest Upstash snapshot
2. Latest persisted Postgres snapshot
3. Bundled audited snapshot

The JSON contract is available at `/api/rankings/:scope/:lens` and carries CDN cache headers for one hour with a one-day stale window.
