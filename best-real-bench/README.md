# MiniV Best-Real TurboQuant + MTP Validation — 2026-07-08

Public validation run using only proven MiniV optimizations: TurboQuant `turbo4/turbo3`, MTP speculative decoding, `ubatch=1024`, flash attention, performance governor, swappiness=10, THP=always, adaptive timeouts, and separated timing metrics.

## Decision

**Best production path remains TurboQuant + MTP, not DFlash.** `architect-35b-q6` is the stronger current best-real lane in this validation.

## Aggregate

| Scope | Model | Pass | Avg score | Avg prefill tok/s | Avg decode tok/s | Avg MTP% | Avg elapsed s |
|---|---|---:|---:|---:|---:|---:|---:|
| 3-task short/medium | architect-35b-q6 | 3/3 | 1.00 | 286.3 | 76.3 | 91.0% | 12.6 |
| 3-task short/medium | qwen36-35b-q6 | 3/3 | 1.00 | 304.2 | 68.1 | 90.6% | 29.0 |
| 4-task full | architect-35b-q6 | 4/4 | 1.00 | 304.8 | 69.5 | 91.2% | 32.6 |
| 4-task full | qwen36-35b-q6 | 4/4 | 1.00 | 321.0 | 62.5 | 90.2% | 45.8 |

## Per-task results

| Model | Task | Status | Score | Prefill tok/s | Decode tok/s | MTP% | Total s |
|---|---|---|---:|---:|---:|---:|---:|
| architect-35b-q6 | tool_call | PASS | 1.00 | 210.0 | 80.5 | 90.0% | 3.0 |
| architect-35b-q6 | coding_fix | PASS | 1.00 | 235.5 | 75.3 | 92.7% | 8.0 |
| architect-35b-q6 | context_heavy | PASS | 1.00 | 413.4 | 73.0 | 90.4% | 26.8 |
| qwen36-35b-q6 | tool_call | PASS | 1.00 | 214.4 | 72.8 | 92.8% | 3.8 |
| qwen36-35b-q6 | coding_fix | PASS | 1.00 | 250.8 | 66.9 | 90.4% | 20.6 |
| qwen36-35b-q6 | context_heavy | PASS | 1.00 | 447.5 | 64.5 | 88.5% | 62.5 |
| architect-35b-q6 | deep_context_retrieval | PASS | 1.00 | 360.2 | 49.4 | 91.9% | 92.8 |
| qwen36-35b-q6 | deep_context_retrieval | PASS | 1.00 | 371.1 | 45.7 | 89.3% | 96.1 |

## Notes

- Decode speed uses llama-server `predicted_per_second`; prefill uses `prompt_per_second`.
- Deep-context retrieval is reported separately because it is a different workload shape and intentionally lowers decode average.
- No DFlash data is mixed into this benchmark. DFlash remains a measured-negative pilot.
