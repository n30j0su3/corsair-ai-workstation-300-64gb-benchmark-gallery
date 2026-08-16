import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
DATA = ROOT / "data" / "gallery-v2.json"
APP = ROOT / "shared" / "gallery-v2.js"


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
    assert all({"id", "family", "quant", "status", "evidence"} <= set(model) for model in data["models"])
    assert {"quality", "decode", "prefill", "context"} <= set(data["rankings"])
    assert data["evidence"]


def test_qwen38_is_visible_and_not_claimed_production_before_gates():
    data = json.loads(DATA.read_text(encoding="utf-8"))
    qwen = [model for model in data["models"] if model["id"].startswith("qwen38-27b")]
    assert qwen
    assert all(model["status"] in {"benchmarking", "candidate", "certified", "utility", "failed"} for model in qwen)
    assert all(model["status"] != "production" for model in qwen)


def test_app_renders_filters_and_accessible_state():
    js = APP.read_text(encoding="utf-8")
    for token in ("renderOverview", "renderRankings", "renderEvidence", "renderArtifacts", "aria-selected", "URLSearchParams"):
        assert token in js


def test_mobile_rank_lens_controls_visible_metric_and_tabs_do_not_smooth_scroll():
    js = APP.read_text(encoding="utf-8")
    css = (ROOT / "shared" / "gallery-v2.css").read_text(encoding="utf-8")
    assert "document.body.dataset.rank = state.rank" in js
    assert "button[data-rank]" in js
    assert "$$('[data-rank]')" not in js
    for rank in ("quality", "decode", "prefill", "context"):
        assert f'body[data-rank="{rank}"]' in css
    assert "behavior: 'smooth'" not in js
    assert "scroll-behavior:smooth" not in css


def test_rank_filters_are_shareable_deep_links():
    js = APP.read_text(encoding="utf-8")
    for token in ("params.get('rank')", "params.get('family')", "params.get('status')"):
        assert token in js
    for token in ("params.set('rank', state.rank)", "params.set('family', state.family)", "params.set('status', state.status)"):
        assert token in js


def test_rankings_derive_from_current_metrics_with_missing_values_last():
    js = APP.read_text(encoding="utf-8")
    assert "metricKeyByRank" in js
    assert "aMissing" in js and "bMissing" in js
    data = json.loads(DATA.read_text(encoding="utf-8"))
    qwen = {model["id"]: model for model in data["models"] if model["family"] == "Qwen3.8"}
    assert qwen["qwen38-27b-q4"]["metrics"]["decode_tps"] == 15.01
    assert qwen["qwen38-27b-q6"]["metrics"]["prefill_tps"] == 80.2
