# MiniV corrected long-context retrieval ladder

**Date:** 2026-07-10  
**Scope:** public-safe context retrieval evidence for the Corsair AI Workstation 300 / MiniV gallery.

## Executive result

- **86 rows** over **21 registered aliases**.
- **82 visible exact PASS**, **1 partial**, **2 retrieval miss**, and **1 service/proxy error**.
- `architect-35b-q6` passed every tested request class through **120K**, with **117,814 observed prompt tokens** in its largest visible PASS.
- The production decision remains **TurboQuant + MTP, `architect-35b-q6` default**. No global Q8 promotion follows from this run.

## Method

1. Generate a plain-word long document with one deterministic marker placed in the middle.
2. Ask for only the marker and its line number.
3. Record `usage.prompt_tokens`, server prefill/decode timings, and visible-answer retrieval status.
4. Treat exact marker in visible `message.content` as `PASS`; marker found only in reasoning as `PARTIAL`.

## Boundaries

- Request class is not a tokenizer estimate. The displayed input is the authoritative server-reported prompt-token count.
- The ladder is a **retrieval-envelope** probe, not a generic quality leaderboard.
- Public files intentionally exclude local paths, IP addresses, credentials, raw prompts, model-file details, and raw logs.

## Files

- `index.html` — browser-readable report.
- `results.json` — sanitized metric dataset.
- `SHA256SUMS.json` — integrity manifest for this package.
