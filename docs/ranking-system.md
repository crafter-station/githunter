# GitHunter Ranking System

## Autonomous product grilling

The product questions below were answered by default because the build was explicitly authorized to proceed autonomously.

### What is being ranked?

Public GitHub developer identities within a declared geographic scope. The first production scope is Peru. Country membership is evidence-backed and never inferred from nationality.

### Is there one objective best developer?

No. GitHunter provides objective calculations under explicit lenses. Balanced is the default overview, while Builder, OSS Impact, Maintainer, and Rising expose different legitimate interpretations.

### What makes a result trustworthy?

Every result exposes the cohort, evidence window, data timestamp, lens version, raw metrics, normalized metric contributions, exclusions, and confidence. Confidence reflects whether every evidence window required by the lens is available. An observed zero is scored as zero rather than treated as missing.

### How is gaming controlled?

Raw volume is capped through percentile normalization, so extreme totals cannot dominate by magnitude. Private activity is excluded. The cohort excludes identities found across four or more country rankings, and repository adoption ignores forks owned by the developer. GitHub does not expose commit substance through contribution totals, so empty, generated, or tiny commits are not silently treated as quality. Commit volume is one signal inside broader lenses and this limitation remains visible.

### How should time work?

Activity lenses use a trailing 365-day evidence window. Durable adoption metrics use the current public state, captured in the same dated snapshot. Rising compares recent pace against the preceding equivalent period when both windows are available.

### What happens when data is incomplete?

Collection only admits profiles with a complete current evidence window. Rising can retain a profile without a prior comparison window, scores only the available comparable facts, and lowers confidence explicitly.

### How often does it update?

Snapshots refresh daily. Public pages are served from versioned daily snapshots. A successful retry on the same day replaces that day's stable identifier, while snapshots from prior dates remain historical records. A verified bundled snapshot keeps the product available before the first database migration or during an infrastructure outage.

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

The first release supports Peru and the five fixed lenses. It uses the latest verified public dataset as a bundled baseline, a versioned scoring engine, a cache-ready snapshot store, a public JSON API, an indexable ranking interface, and a daily refresh task. LATAM aggregation and custom lenses follow through the same contracts without changing existing historical snapshots.

## Operations

Apply `drizzle/0011_ranking_snapshots.sql` before enabling refreshes. The Trigger.dev task `refresh-ranking-snapshots` runs every day at 06:00 in `America/Lima` and requires `GITHUB_TOKEN`, `DATABASE_URL`, `UPSTASH_REDIS_REST_URL`, and `UPSTASH_REDIS_REST_TOKEN`.

The same refresh can be run manually with `bun run rankings:refresh`. `bun run rankings:bundle` regenerates the audited fallback dataset and should only be committed after checking cohort membership and the resulting top ranks. Explicit source errors are recorded with evidence in `src/rankings/data/peru-exclusions.json` and removed before collection.

Public pages choose the freshest version-compatible snapshot from:

1. Latest Upstash snapshot
2. Latest persisted Postgres snapshot
3. Bundled audited snapshot

The JSON contract is available at `/api/rankings/:scope/:lens` and carries CDN cache headers for one hour with a one-day stale window.
