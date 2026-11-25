# Corsair AI Workstation 300 Benchmark Gallery

<p align="center"><strong>FreakingJSON · Local AI, measured in public</strong></p>

<p align="center">
  <a href="https://n30j0su3.github.io/corsair-ai-workstation-300-64gb-benchmark-gallery/">Open the gallery</a> ·
  <a href="https://github.com/n30j0su3/fjson-local-model-benchmark">Use the public benchmark harness</a> ·
  <a href="https://freakingjson.com/">FreakingJSON</a>
</p>

This repository publishes interactive benchmark evidence from a **Corsair AI Workstation 300** with 64GB unified memory. It keeps quality, decode, prefill and context as separate lenses, dates every operational claim and distinguishes current state from historical snapshots.

## Current evidence · September 12, 2026

### Qwen3.8 Flash-Next + MoE Expert Cache

| Lens | Published observation |
|---|---:|
| Decode baseline | 1.57 tok/s |
| Decode · 32K / 32 slots | 32.27 tok/s |
| Decode · 64K / 32 slots | 34.84 tok/s |
| Decode · 128K / 32 slots | 35.76 tok/s |
| Decode · 128K / 48 slots | **36.33–37.92 tok/s** |
| Prefill · 5,660 prompt tokens | ≈164 tok/s |
| Prefill · 16,860 prompt tokens | ≈232 tok/s |
| Stability observation | 13 consecutive runs without DeviceLost |

**Scope:** Flash-Next is an on-demand, non-default lane. `architect-35b-q6` remains the protected default. These numbers are dated observations on this workstation—not universal quality scores or promises for other hardware.

- [Read the visual Flash-Next report](flash-next-expert-cache-20260912/index.html)
- [Read the model-authored execution summary (2026-11-24/25)](flash-next-execution-20261124/index.html)
- [Inspect the sustained 64K residency data (2026-11-24)](data/flash-next-ec64-sustained-20261124.json)
- [Inspect the structured public data](data/flash-next-expert-cache-20260912.json)
- [Open the public benchmark harness](https://github.com/n30j0su3/fjson-local-model-benchmark)

**Sustained 64K residency (2026-11-24):** `qwen38-flash-next-fast` with the EC64 recipe (64K context, 32 expert-cache slots, draft-mtp 2/1) held one continuous 10,185 s residency with `architect-35b-q6` resident: 39/39 correct requests at 56k–60k prompt tokens, cold decode medians of 25.7 / 28.6 tok/s (reasoning on/off), warm first token ≈4.3–4.5 s and a native 60.7 s restore. Host memory headroom was thin (MemAvailable minimum 275 MiB); this is a stability observation, not a speed certification, and the 34.84 tok/s short-prompt rung is unchanged.

**Model-authored execution summary (2026-11-24/25):** [`flash-next-execution-20261124/index.html`](flash-next-execution-20261124/index.html) is an executive summary of how `qwen38-flash-next-fast` and the 27B lane are run on this workstation, **written by Flash-Next itself** through a coding agent on its own EC64 lane (four supervised passes: first document, authorship-metrics section, publication adjustments, and the owner's follow-up: verdict card layout, six charts, three-pass comparison and real terminal launch commands; the fourth pass ended by its 90-minute time budget right after its last applied edit, and the operator checked every commissioned item on the artifact). The operator prepared the data packet, verified every visible number against it and ran the browser QA; the wording is the model's own. The published page is that verified artifact byte for byte, plus one publisher-added navigation block. Its authoring metrics are in [`data/flash-next-ec64-sustained-20261124.json`](data/flash-next-ec64-sustained-20261124.json).

## Public reports

| Report | Date | Scope |
|---|---|---|
| [Flash-Next Expert Cache](flash-next-expert-cache-20260912/index.html) | 2026-09-12 | Current decode, prefill, context ladder and public boundaries |
| [How Flash-Next and 27B are run here](flash-next-execution-20261124/index.html) | 2026-11-24/25 | Executive summary SPA written by Flash-Next itself (EC64 recipe, sustained residency, guards, own authoring metrics, launch commands) |
| [Flash-Next EC64 sustained residency](data/flash-next-ec64-sustained-20261124.json) | 2026-11-24 | Structured data: one 10,185 s continuous 64K residency with the default model resident; host headroom review |
| [Historical evidence closure](miniv-historical-closure-20260821/index.html) | 2026-08-21 | Sanitized dated snapshot; not current routing |
| [Qwen3.8 27B intake](qwen38-intake-20260815/index.html) | 2026-08-15 | Q4/Q6 candidate evidence |
| [Architect editorial export](benchmarks/architect-35b-q6-full-editorial-20260815/report/index.html) | 2026-08-15 | Public-safe D1 and D3 artifact export |
| [Portfolio optimization](portfolio-optimization-v1/index.html) | 2026-07-30 | Historical dense-lane comparison |
| [Production certification](production-certification-20260729/index.html) | 2026-07-29 | Historical six-model snapshot |
| [Context ladder](context-ladder-20260710/index.html) | 2026-07-10 | Token-accounted retrieval ladder |
| [Best-real agents](best-real-bench/index.html) | 2026-07-08 | Real-task artifact validation |
| [DFlash pilot](dflash-bench/index.html) | 2026-07-08 | Negative result retained publicly |
| [Visual 3D collection](visual-3d-bench/index.html) | 2026-07-08 | 64 interactive artifacts: 49 primary plus 15 secondary |

## How to read the gallery

- **Quality** requires deterministic evidence and visible artifacts.
- **Decode** measures output generation.
- **Prefill** measures prompt ingestion and is never blended with decode.
- **Context** requires correct retrieval, not only allocation.
- **Candidate** and **utility** states do not imply default promotion.
- Historical pages are preserved as dated evidence and can differ from current routing.

## Public boundaries

The published tree intentionally excludes private session details, host paths, execution identities, operational topology, raw logs and internal QA packages. Public data is limited to dated aggregate measurements, model identity, hardware class, visible artifacts and decision boundaries.

## Hardware

- **System:** Corsair AI Workstation 300
- **Processor:** AMD Ryzen AI MAX 385
- **Graphics:** Radeon 8050S · Vulkan RADV
- **Memory:** 64GB LPDDR5X UMA

## Credits

Benchmark direction, methodology and model evaluation: **N30 · FreakingJSON**.

Licensed under [MIT](LICENSE).
