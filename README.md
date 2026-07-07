# Corsair AI Workstation 300 64GB Benchmark Gallery

> **FreakingJSON Agencia • MiniV Vulkan UMA benchmark gallery**

Public SPA target: <https://n30j0su3.github.io/corsair-ai-workstation-300-64gb-benchmark-gallery/>

## Latest Update — 2026-07-07 (Bench v2.2)

### What's New

- **21 models benchmarked** with separated prefill/decode/thinking/MTP metrics
- **84 total runs** across 4 waves (Waves 1-4)
- **OS-level optimizations**: CPU governor=performance, swappiness=10, THP=always, ubatch=1024
- **Deep context retrieval solved**: 310s → 92s (3.4x faster) via ubatch fix + adaptive timeouts
- **11 models with perfect score (1.00)** across all 4 tasks
- **MTP confirmed**: 8 models with Multi-Token Prediction show 89-94% acceptance rate

### Top 5 Models (by decode speed)

| # | Model | Decode tok/s | Prefill tok/s | MTP% | Score |
|---|---|---|---|---|---|
| 1 | architect-35b-q6 | 71.2 | 320.3 | 90% | 1.00 |
| 2 | qwen36-35b-q6 | 63.8 | 332.7 | 91% | 1.00 |
| 3 | q8-architect-35b | 62.5 | 361.8 | 92% | 1.00 |
| 4 | qwen36-35b-q8 | 54.4 | 338.6 | 89% | 1.00 |
| 5 | ornith-35b-q6 | 52.8 | 328.2 | — | 1.00 |

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

### Key Optimizations Applied

| Optimization | Impact |
|---|---|
| ubatch-size 512→1024 | Prefill 2.7x faster on deep_context |
| CPU governor→performance | +20-30% TG (CPU 1.4GHz → 4.95GHz) |
| Swappiness 60→10 | Less swap death on UMA |
| THP→always | Better memory throughput |
| Adaptive timeouts | No more false negatives on deep_context |

## Scope

This public gallery mirrors the RTX 5060 Ti benchmark gallery structure/design, but isolates the MiniV / Corsair AI Workstation 300 64GB Vulkan UMA results.

- Original eval run: `all-local-model-eval-20260528-231052` (May 2026, 26 models)
- Bench v2.2 update: `2026-07-07` (21 models, 84 runs, separated metrics)
- N30 credit: `All benchmark orchestration, methodology design, and AI model evaluations directed by N30.`

## Files

- `index.html` — public single-page gallery (SPA with ES/EN toggle, dark/light mode)
- `data/miniv-bench-v2.2-results.json` — **latest** benchmark results (21 models, separated metrics)
- `data/all-local-evaluation-summary.json` — original May 2026 evaluation summary
- `data/miniv-results.json` — original MiniV Vulkan UMA subset
- `benchmark-metrics.json` — combined public data

## Official Links

- GitHub: <https://github.com/n30j0su3>
- FreakingJSON Linktree: <https://linktr.ee/freakingjson>
- X/Twitter: <https://x.com/freakingjson>
- YouTube: <https://www.youtube.com/@freakingjson>

© 2026 FreakingJSON Agencia.
