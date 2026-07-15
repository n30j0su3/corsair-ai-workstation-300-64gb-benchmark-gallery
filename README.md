# Corsair AI Workstation 300 64GB Benchmark Gallery

> **FreakingJSON Agencia • MiniV Vulkan UMA benchmark gallery — fully local, zero cloud**

Public SPA: <https://n30j0su3.github.io/corsair-ai-workstation-300-64gb-benchmark-gallery/>

---

## What Is This?

This gallery publishes reproducible, public-safe benchmark evidence from the **MiniV Vulkan UMA** stack — a local-first AI inference platform running on a Corsair AI Workstation 300 (64GB UMA, AMD Ryzen AI MAX 385, Radeon 8050S Graphics). All benchmarks are orchestrated and directed by **N30** with zero cloud dependency.

### Hardware

- **APU**: AMD Ryzen AI MAX 385 (16C/16T, up to 5.0 GHz)
- **GPU**: Radeon 8050S Graphics (RADV Vulkan, GFX1151)
- **Memory**: 64GB LPDDR5X 8000MHz UMA (48GB VRAM allocation)
- **Backend**: llama-cpp-turboquant fork (Vulkan build b9677-4595fff0b)

### Methodology — Bench v2.2

- **4 tasks**: tool_call, coding_fix, context_heavy, deep_context_retrieval
- **Separated metrics** from llama-server API `timings` object:
  - `prompt_per_second` = prefill speed (input processing)
  - `predicted_per_second` = decode speed (output generation)
  - `reasoning_content` = thinking tokens (separated from output)
  - `draft_n` / `draft_n_accepted` = MTP acceptance rate
- **Adaptive timeouts** based on context size (not fixed 600s)
- **No LLM-as-judge** — deterministic checkers only

---

## Report Index

| Report | Date | Description |
|--------|------|-------------|
| [`best-real-bench/`](best-real-bench/index.html) | 2026-07-08 | Best-real TurboQuant+MTP validation — 8/8 PASS across top 35B Q6 lanes |
| [`context-ladder-20260710/`](context-ladder-20260710/index.html) | 2026-07-10 | Corrected 120K context retrieval ladder — 86 rows, 21 aliases |
| [`dflash-bench/`](dflash-bench/index.html) | 2026-07-08 | DFlash pilot — measured negative, not promoted |
| [`dflash-bench/turboquant-followup/`](dflash-bench/turboquant-followup/index.html) | 2026-07-08 | TurboQuant + DFlash follow-up appendix |
| [`visual-3d-bench/`](visual-3d-bench/index.html) | 2026-07-08 | Visual 3D benchmark — 11 models, 49 HTML deliverables, 0 runtime issues |
| [`visual-3d-bench/pi-dev/`](visual-3d-bench/pi-dev/index.html) | 2026-07-08 | Pi-dev harness — 15 additional pi-agent-generated deliverables |
| [`index.html`](index.html) | 2026-07-15 | Main SPA gallery with ES/EN toggle, dark/light mode |

---

## Latest Update — 2026-07-15 (Gallery Overhaul)

### What's New

- **Reference Context section** added at the top of the SPA — explains hardware, methodology, inference backend, and scope for new visitors.
- **Report Index** added for quick navigation to all benchmark reports.
- **Visual 3D Benchmark Gallery** now properly linked and discoverable from the main SPA.
- **Full ES/EN i18n coverage** — all sections (best-real, context ladder, DFlash, visual 3D) now respond to the language toggle. Previously, 3 major sections were English-only.
- **Anchor navigation** — every report section has a stable ID for direct linking.

## Previous Update — 2026-07-10 (Corrected 120K Context Retrieval Ladder)

- **Corrected long-context ladder**: 86 token-accounted retrieval rows across 21 registered aliases.
- **Visible exact retrieval**: 82 PASS, 1 PARTIAL, 2 deterministic misses, 1 server error — reported explicitly.
- **Default verified through 120K**: `architect-35b-q6` reached **117,814 observed prompt tokens**.
- **Routing decision unchanged**: TurboQuant + MTP with `architect-35b-q6` remains production default.

## Previous Update — 2026-07-08 (Best-real + DFlash + Visual 3D)

### Best-real Validation

- **8/8 PASS** across short/medium agent tasks + deep-context retrieval
- **Architect short/medium**: 76.3 decode tok/s avg, 91.0% MTP acceptance
- **Architect deep-context**: 360.2 prefill tok/s, 49.4 decode tok/s, 91.9% MTP

### DFlash Pilot

- Decision: **not promoted**. Baseline was faster than DFlash on all tested models.
- TurboQuant+DFlash follow-up: 0.0% draft acceptance, also slower than baseline.

### Visual 3D Benchmark

- **11 models** generated **49 HTML deliverables** across 5 visual prompts
- **Runtime gate green**: 49/49 complete, 0 markdown fences, 0 strict runtime issues
- Prompts: Three.js Particle Galaxy, FPS Raycasting Engine, 3D Flight Simulation, Wave Ocean Shader, Breakout Canvas Game
- **Pi-dev harness**: 15 additional pi-agent-generated deliverables verified
- SHA256 integrity manifest: [`visual-3d-bench/manifest.json`](visual-3d-bench/manifest.json)

## Bench v2.2 Baseline — 2026-07-07

### Key Results

- **21 models benchmarked** with separated prefill/decode/thinking/MTP metrics
- **84 total runs** across 4 waves
- **11 models with perfect score (1.00)**
- **Deep context retrieval solved**: 310s → 92s (3.4x faster) via ubatch optimization

### Top 5 Models (by decode speed)

| # | Model | Decode tok/s | Prefill tok/s | MTP% | Score |
|---|---|---|---|---|---|
| 1 | architect-35b-q6 | 71.2 | 320.3 | 90% | 1.00 |
| 2 | qwen36-35b-q6 | 63.8 | 332.7 | 91% | 1.00 |
| 3 | q8-architect-35b | 62.5 | 361.8 | 92% | 1.00 |
| 4 | qwen36-35b-q8 | 54.4 | 338.6 | 89% | 1.00 |
| 5 | ornith-35b-q6 | 52.8 | 328.2 | — | 1.00 |

### Key Optimizations Applied

| Optimization | Impact |
|---|---|
| ubatch-size 512→1024 | Prefill 2.7x faster on deep_context |
| CPU governor→performance | +20-30% TG (CPU 1.4GHz → 4.95GHz) |
| Swappiness 60→10 | Less swap death on UMA |
| THP→always | Better memory throughput |
| Adaptive timeouts | No more false negatives on deep_context |

---

## Files

- `index.html` — public single-page gallery (SPA with ES/EN toggle, dark/light mode, reference context, report navigation)
- `best-real-bench/` — best-real TurboQuant+MTP validation report + datasets
- `context-ladder-20260710/` — corrected 120K context retrieval ladder
- `dflash-bench/` — DFlash pilot report + TurboQuant follow-up appendix
- `visual-3d-bench/` — visual 3D benchmark gallery (49 deliverables + pi-dev harness + manifests)
- `data/miniv-bench-v2.2-results.json` — latest benchmark results (21 models)
- `data/best-real-tq-mtp-20260708.json` — best-real validation dataset
- `data/all-local-evaluation-summary.json` — original May 2026 evaluation summary
- `data/miniv-results.json` — original MiniV Vulkan UMA subset
- `benchmark-metrics.json` — combined public data

## Official Links

- GitHub: <https://github.com/n30j0su3>
- FreakingJSON Linktree: <https://linktr.ee/freakingjson>
- X/Twitter: <https://x.com/freakingjson>
- YouTube: <https://www.youtube.com/@freakingjson>

© 2026 FreakingJSON Agencia.
