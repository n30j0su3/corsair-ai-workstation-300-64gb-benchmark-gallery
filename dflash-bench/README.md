# MiniV DFlash Pilot Benchmark — 2026-07-08

Public benchmark artifact for the Corsair AI Workstation 300 / MiniV benchmark gallery.

## Decision

**Do not promote DFlash on MiniV yet.** In this isolated Vulkan DFlash build, all tested DFlash lanes were slower than the same build running with speculative decoding disabled.

## Scope

- Run ID: `dflash-matrix-20260708_153700`
- Hardware: Corsair AI Workstation 300 / MiniV, AMD Ryzen AI MAX 385, Radeon 8050S RADV Vulkan, 64GB UMA.
- Context: 8,192 tokens.
- Output cap: 256 completion tokens.
- Drafters: Q8_0 DFlash drafters only.
- Baseline: same isolated DFlash-capable llama.cpp Vulkan build with `--spec-type none`.
- DFlash: same build with `--spec-type draft-dflash`.
- Production caveat: this is **not** the production TurboQuant router build; it is an isolated PR build used for pilot measurement.

## Results

| Model | Baseline decode tok/s | DFlash decode tok/s | DFlash delta | Draft acceptance | Mean accept len |
|---|---:|---:|---:|---:|---:|
| Qwen3.6 / Qwopus3.6 27B Q6_K | 9.48 | 8.34 | -12.1% | 30.8% | 3.45 |
| Qwen3.6 35B-A3B Q6_K_XL | 51.07 | 33.72 | -34.0% | 37.4% | 3.92 |
| Gemma4 26B-A4B-it Q6_K_XL | 44.83 | 31.10 | -30.6% | 34.3% | 3.64 |

## Notes

- Decode speed above uses llama-server `predicted_per_second` timing.
- Wall decode tok/s is also available in `comparisons.csv` and `results.json`.
- Prompt/prefill and decode are kept separate; no combined prefill+decode TPS is used.
- Each case produced 256 completion tokens, but response `content` was empty because this DFlash PR build exposed thinking-template behavior differently. Therefore this artifact is a **speed/runtime pilot**, not an output-quality evaluation.
- DFlash did activate: logs recorded 30.8–37.4% draft acceptance depending on model.

## Files

- `index.html` — human-readable public report.
- `results.json` — sanitized structured dataset.
- `summary.csv` — per-case metrics.
- `comparisons.csv` — baseline vs DFlash comparison table.
