# Canonical Doc Sync (POC)

## Policy

During POC, the Perplexity Space is the runtime source-of-truth for canonical docs.
GitHub canonical-doc copies may be edited, but edits only become effective once the
operator applies the same changes to the Space.

## Operator checklist (after any GitHub edit)

- Apply the identical edit to the matching Space file(s) immediately.
- Note the canonical docs git commit SHA you consider "current".
- In the next produced output, ensure Retrieval metadata includes:
  - Canonical docs version (git SHA)
  - Space canonical sync timestamp
