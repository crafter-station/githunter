# 0001: Use versioned lenses instead of a universal score

## Status

Accepted

## Context

GitHub activity has multiple valid interpretations. Commit volume, open source adoption, review work, issue participation, and recent momentum describe different kinds of contribution. Combining them into one unnamed score would conceal value judgments and make historical comparisons unstable.

## Decision

GitHunter ranks developers through named, versioned lenses. Every lens publishes its evidence window, metrics, transformations, weights, exclusions, and version. Balanced is the default lens, not a claim of universal developer quality.

## Consequences

- Users can inspect and dispute the ranking method.
- Existing snapshots remain reproducible after a lens changes.
- Different lenses may produce different leaders without either result being treated as an error.
- A new weighting policy requires a new lens version.
