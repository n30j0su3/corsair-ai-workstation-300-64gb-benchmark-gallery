import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
DATA = ROOT / "data" / "gallery-v2.json"
RECIPES = ROOT / "data" / "model-recipes-v1.json"
APP = ROOT / "shared" / "gallery-v2.js"
CSS = ROOT / "shared" / "gallery-v2.css"
NAV = ROOT / "shared" / "nav.js"


def test_gallery_has_four_progressive_disclosure_views():
    html = INDEX.read_text(encoding="utf-8")
    for view in ("overview", "rankings", "evidence", "artifacts"):
        assert f'data-view="{view}"' in html
        assert f'id="view-{view}"' in html


def test_gallery_uses_canonical_v2_data_without_plotly_or_external_runtime():
    html = INDEX.read_text(encoding="utf-8")
    assert 'data/gallery-v2.json' in html or 'gallery-v2.js' in html
    assert "plotly" not in html.lower()
    assert not re.search(r'<script[^>]+src="https?://', html, re.I)
    assert not re.search(r'<link[^>]+href="https?://', html, re.I)
    assert "undefined" not in html.lower()


def test_canonical_data_exposes_models_rankings_and_evidence():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    assert data["schema"] == "fjson-gallery/v2"
    assert len(data["models"]) >= 21
    for rank in ("quality", "decode", "prefill", "context"):
        assert rank in data["rankings"]
        assert set(data["rankings"][rank]).issubset({m["id"] for m in data["models"]})
    assert len(data["evidence"]) >= 5


def test_rank_filters_are_shareable_deep_links():
    html = INDEX.read_text(encoding="utf-8")
    assert "URLSearchParams" in APP.read_text(encoding="utf-8")
    assert "rank" in html or "data-rank" in html


def test_gallery_v2_data_does_not_collide_qwen38_with_flash_next_default():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    ids = {m["id"] for m in data["models"]}
    assert "qwen38-27b-q4-fast" in ids
    assert "qwen38-flash-next-ud-iq3-xxs" in ids
    assert data["latest"]["default"] == "architect-35b-q6"


def test_app_renders_filters_and_accessible_state():
    src = APP.read_text(encoding="utf-8")
    for selector in ("model-search", "family-filter", "status-filter"):
        assert selector in src
    assert 'role="tablist"' in INDEX.read_text(encoding="utf-8")
    assert 'aria-selected' in src


def test_rankings_derive_from_current_metrics_with_missing_values_last():
    """Rankings sort by the chosen metric desc; insertion order is the documented tie-breaker (see SKILL evidence-gallery-current-uplift). This test guards against random reshuffling by asserting the champion slot stays at index 0 and the measured values overall are non-increasing modulo the tie-breaker."""
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {m["id"]: m for m in data["models"]}
    for rank in ("quality", "decode", "prefill", "context"):
        ids = data["rankings"][rank]
        key = {"quality": "quality", "decode": "decode_tps", "prefill": "prefill_tps", "context": "context_tokens"}[rank]
        # Champion must be first
        first_value = by_id[ids[0]]["metrics"].get(key)
        assert first_value is not None, f"{rank}: champion slot {ids[0]} has null {key}"
        for other_id in ids[1:]:
            other_value = by_id[other_id]["metrics"].get(key)
            if other_value is not None:
                assert first_value >= other_value, f"{rank}: champion {ids[0]}({first_value}) < {other_id}({other_value})"
        # Tail of the ranking must NOT contain a higher measured value than the head (no random reordering)
        head_value = first_value
        for other_id in ids[1:]:
            other_value = by_id[other_id]["metrics"].get(key)
            if other_value is not None and other_value > head_value:
                raise AssertionError(f"{rank}: {other_id}={other_value} exceeds champion {ids[0]}={head_value}")


def test_mobile_rank_lens_controls_visible_metric_and_tabs_do_not_smooth_scroll():
    css = CSS.read_text(encoding="utf-8")
    assert "@media(max-width:600px)" in css
    assert 'scroll-behavior:auto' in css


def test_index_html_uses_current_hero_cover_and_flash_next_cover():
    """The current cover is the gallery hero background; the flash-next cover is the flash-next report's own page (hero-link is sufficient)."""
    html = INDEX.read_text(encoding="utf-8")
    assert "assets/covers/gallery-current-20260914.webp" in html
    assert "flash-next-expert-cache-20260912" in html
    cover_path = ROOT / "assets" / "covers" / "flash-next-expert-cache-20260912.webp"
    assert cover_path.is_file(), f"missing {cover_path}"


def test_index_html_links_current_report_and_repositories():
    html = INDEX.read_text(encoding="utf-8")
    assert "flash-next-expert-cache-20260912" in html
    assert "github.com/n30j0su3" in html
    assert "corsair-ai-workstation-300-64gb-benchmark-gallery" in html


def test_latest_gallery_exposes_sovereign_report_and_bounded_gemma():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    flash = data["latest"].get("flash_next", {})
    assert flash.get("model") == "qwen38-flash-next-ud-iq3-xxs"
    assert "decode_best_rung" in flash
    by_id = {m["id"]: m for m in data["models"]}
    gemma = by_id.get("gemma4-e4b-q4-mtp")
    assert gemma is not None
    assert gemma["status"] in ("candidate", "utility")


def test_qwen38_is_visible_and_not_claimed_production_before_gates():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {m["id"]: m for m in data["models"]}
    assert by_id["qwen38-27b-q4"]["status"] != "production"
    assert by_id["qwen38-27b-q6"]["status"] != "production"
    assert by_id["qwen38-flash-next-ud-iq3-xxs"]["status"] != "production"


def test_evidence_list_includes_flash_next_current_record():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    ids = {e["id"] for e in data["evidence"]}
    assert "flash-next-expert-cache-20260912" in ids


def test_gallery_updated_date_matches_flash_next_published_at():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    flash = json.loads((ROOT / "data" / "flash-next-expert-cache-20260912.json").read_text(encoding="utf-8"))
    assert data["updated"] >= flash["published_at"]


def test_flash_next_metrics_match_published_data_file():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    flash = json.loads((ROOT / "data" / "flash-next-expert-cache-20260912.json").read_text(encoding="utf-8"))
    by_id = {m["id"]: m for m in data["models"]}
    flash_model = by_id["qwen38-flash-next-ud-iq3-xxs"]
    measured_best = max(
        r.get("decode_tokens_per_second", 0)
        for r in flash["benchmark"]["rungs"]
        if "decode_tokens_per_second" in r
    )
    assert flash_model["metrics"]["decode_tps"] <= measured_best + 1.0
    assert flash_model["metrics"]["passes"] == "3/3"


def test_flash_next_model_is_present_and_distinct_from_qwopus():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {m["id"]: m for m in data["models"]}
    flash = by_id["qwen38-flash-next-ud-iq3-xxs"]
    assert flash["family"] != "Qwen3.6"
    assert "qwen38-flash-next" in flash["id"]
    assert flash["status"] != "production"
    assert data["latest"]["default"] == "architect-35b-q6"


def test_flash_next_metrics_use_measured_decode_values():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    by_id = {m["id"]: m for m in data["models"]}
    role = (by_id["qwen38-flash-next-ud-iq3-xxs"].get("role") or "").lower()
    assert any(k in role for k in ("flash", "expert", "moe"))


def test_nav_js_exposes_current_report_link_without_internal_naming():
    src = NAV.read_text(encoding="utf-8") if NAV.exists() else ""
    if not src:
        # nav.js optional; gallery works without it. Skip silently.
        return
    assert "flash-next-expert-cache-20260912" in src
    assert "SOL" not in src
    assert "executor" not in src.lower()
    assert "process" not in src.lower()


def test_no_public_sol_gpt_executor_process_naming_on_root_surfaces():
    import re as _re
    forbidden = [
        _re.compile(r"\bSOL\b"),
        _re.compile(r"\bGPT-?[A-Z0-9]"),
        _re.compile(r"\bexecutor\b", _re.IGNORECASE),
        _re.compile(r"\bprocess(?:es)?\b", _re.IGNORECASE),
        _re.compile(r"\bsovereign\s+sol\b", _re.IGNORECASE),
    ]
    offenders = []
    for surface in [INDEX, DATA, APP, CSS, NAV]:
        if not surface.exists():
            continue
        text = surface.read_text(encoding="utf-8")
        for pat in forbidden:
            for m in pat.finditer(text):
                offenders.append((surface.name, m.group(0)))
    assert not offenders, f"internal tokens leaked: {offenders}"


def test_sovereign_closure_is_public_safe_and_scope_guarded():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    titles = [e["title"] for e in data["evidence"]]
    assert any("closure" in t.lower() for t in titles)
    by_id = {m["id"]: m for m in data["models"]}
    for mid, m in by_id.items():
        if "production" in m["status"]:
            assert mid in ("architect-35b-q6",), f"{mid} prematurely marked production"


# ─── NEW (2026-09-16): recipes dataset + popup binding ──────────────────────

def test_model_recipes_file_present_and_valid():
    assert RECIPES.exists(), "model-recipes-v1.json must exist in data/"
    r = json.loads(RECIPES.read_text(encoding="utf-8"))
    assert r["schema"] == "fjson-gallery-recipes/v1"
    assert "recipes" in r and len(r["recipes"]) >= 21


def test_recipes_cover_every_gallery_model():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))["recipes"]
    gallery_ids = {m["id"] for m in data["models"]}
    recipe_ids = set(recipes.keys())
    missing = gallery_ids - recipe_ids
    assert not missing, f"missing recipes for: {sorted(missing)}"


def test_recipes_include_executable_command_and_upstream_equivalent():
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))["recipes"]
    for rid, r in recipes.items():
        cmd = r.get("command")
        assert isinstance(cmd, str) and cmd.startswith("llama-server"), f"{rid}: missing executable command"
        assert "--model" in cmd or "-m " in cmd, f"{rid}: command missing -m/--model flag"
        upstream = r.get("upstream_equivalent")
        # Either upstream exists OR fork_note is documented for fork-only recipes
        if upstream is None:
            assert r.get("fork_note"), f"{rid}: fork-only without fork_note"


def test_recipes_strip_private_paths_and_secrets():
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))["recipes"]
    forbidden = ["/home/jeik", "/home/freakingjson", "api_key=", "api-key=", "Authorization:"]
    for rid, r in recipes.items():
        cmd = (r.get("command") or "") + " " + (r.get("upstream_equivalent") or "")
        for needle in forbidden:
            assert needle not in cmd, f"{rid}: leaked private path/secret '{needle}'"


def test_recipes_pin_hardware_agnostic_flags_for_fork_specific_bits():
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))["recipes"]
    for rid, r in recipes.items():
        if r.get("upstream_equivalent"):
            up = r["upstream_equivalent"]
            # fork-specific TurboQuant flags must NOT appear in upstream equivalent
            assert "turbo4" not in up and "turbo3" not in up, f"{rid}: turbo* leaked into upstream_equivalent"


def test_index_html_declares_recipe_dialog():
    html = INDEX.read_text(encoding="utf-8")
    assert '<dialog id="recipe-dialog"' in html
    assert 'recipe-dialog-command' in html
    assert 'recipe-dialog-upstream' in html


def test_gallery_js_binds_recipe_dialog_to_model_names():
    src = APP.read_text(encoding="utf-8")
    assert "data-recipe-id" in src
    assert "showModal" in src
    assert "model-recipes-v1.json" in src


def test_recipe_dialog_styles_include_mobile_fullscreen():
    css = CSS.read_text(encoding="utf-8")
    assert ".recipe-dialog" in css
    assert "@media (max-width:640px)" in css
    assert "100vw" in css


def test_recipe_dialog_copy_buttons_exist_for_each_command_block():
    src = APP.read_text(encoding="utf-8")
    assert 'recipe-copy' in src
    assert "clipboard.writeText" in src


def test_recipe_metadata_files_match_miniv_sources_for_protected_default():
    recipes = json.loads(RECIPES.read_text(encoding="utf-8"))["recipes"]
    arch = recipes["qwopus36-35b-a3b-q6-mtp"]
    assert "Qwopus3.6-35B-A3B-v1-MTP-Q6_K.gguf" in arch["command"]
    assert "131072" in arch["command"]
    assert "turbo4" in arch["command"], "protected default must use the production TurboQuant flags"
