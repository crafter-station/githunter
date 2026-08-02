# 0002: Separate metric facts from ranking snapshots

## Status

Accepted

## Context

GitHub data is expensive to collect, arrives at different times, and can be corrected. Ranking directly from live API responses would be slow, rate-limit sensitive, and impossible to reproduce reliably.

## Decision

GitHunter stores dated metric facts independently from ranking snapshots. A ranking snapshot references a scope, cohort, lens version, evidence window, freshness timestamp, and the metric facts used to calculate each entry. Public pages read cached snapshots and may fall back to a bundled verified snapshot when infrastructure is unavailable.

## Consequences

- Public rankings stay fast and available during GitHub, database, or cache outages.
- Stored facts make future recalculation without recollection possible; the rebuild command is deferred until a second lens version exists.
- Provenance and freshness can be displayed per snapshot.
- Collection and ranking can evolve independently.
