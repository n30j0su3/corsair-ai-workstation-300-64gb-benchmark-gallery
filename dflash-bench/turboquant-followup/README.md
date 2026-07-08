# MiniV TurboQuant + DFlash Follow-up — 2026-07-08

Public appendix for the MiniV DFlash pilot.

## Decision

**Do not promote TurboQuant + DFlash on MiniV for this Qwen/Qwopus 27B target/drafter pair.** The integrated build runs, but DFlash acceptance was exactly **0.0%** across all tested `n_max` values and every DFlash run was slower than TurboQuant baseline.

## Scope

- Run ID: `tq-dflash-qwen27b-20260708_162856`
- Hardware: Corsair AI Workstation 300 / MiniV, AMD Ryzen AI MAX 385, Radeon 8050S RADV Vulkan, 64GB UMA.
- Build: llama.cpp TurboQuant fork with experimental DFlash backport, `version 9681 (8c2b1b3f8)`.
- Target: Qwen/Qwopus3.6 27B Q6_K.
- Drafter: Qwen3.6-27B-DFlash Q8_0.
- KV cache: TurboQuant `K=turbo4`, `V=turbo3`.
- Context: 8,192 tokens.
- Output cap: 256 completion tokens.

## Results

| Case | n_max | Decode tok/s | Wall tok/s | Accepted/generated | Acceptance | Delta vs baseline |
|---|---:|---:|---:|---:|---:|---:|
| baseline_tq | 0 | 9.347 | 9.109 | — | — | baseline |
| dflash_tq_n2 | 2 | 7.004 | 6.849 | 0 / 507 | 0.0% | -25.1% |
| dflash_tq_n4 | 4 | 5.395 | 5.304 | 0 / 1010 | 0.0% | -42.3% |
| dflash_tq_n8 | 8 | 2.421 | 2.402 | 0 / 2004 | 0.0% | -74.1% |
| dflash_tq_n12 | 12 | 2.337 | 2.319 | 0 / 2982 | 0.0% | -75.0% |

## Interpretation

1. The integrated TurboQuant+DFlash binary was functional.
2. DFlash draft acceptance was **0 / 6,503 generated draft tokens** across the sweep.
3. Larger `n_max` values increased overhead without accepting tokens.
4. Baseline TurboQuant remains the correct path for this MiniV lane.

## Files

- `index.html` — human-readable appendix.
- `results.json` — sanitized structured dataset.
- `summary.csv` — per-case metrics.
- `comparisons.csv` — baseline vs DFlash comparison table.
