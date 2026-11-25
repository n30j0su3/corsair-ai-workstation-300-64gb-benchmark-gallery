"""2026-11-25 gallery update: Flash-Next EC64 sustained residency + model-authored execution summary (pass 4).

Guards the three things this update promises: every public number keeps its recipe and scope, the launch commands
carry no real path or service port, and the published model-authored page is the verified artifact byte for byte.
"""
import hashlib
import html as htmllib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA_ID = "flash-next-ec64-sustained-20261124"
PAGE_DIR = "flash-next-execution-20261124"
INTEG_START = b"<!-- fjson-gallery-integration:start -->"
INTEG_END = b"<!-- fjson-gallery-integration:end -->\n"
PORT = r"(?<![\d.,:/\-\w])9[0-9]{3}(?![\d.%,\w])"
UNIT_AFTER = r"\s*(MiB|GiB|s\b|tok/s|kB|KB|MB|GB)"


def _data():
    return json.loads((ROOT / "data" / (DATA_ID + ".json")).read_text(encoding="utf-8"))


def _visible(src):
    body = re.sub(r"<style.*?</style>", " ", src, flags=re.S)
    body = re.sub(r"<script.*?</script>", " ", body, flags=re.S)
    return htmllib.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", body)))


def test_sustained_residency_data_file_keeps_recipe_scope_and_published_floor():
    d = _data()
    assert d["recipe"]["context_tokens"] == 65536 and d["recipe"]["moe_cache_slots"] == 32 and d["recipe"]["cache_reuse"] == 256
    assert d["sustained_residency"]["verdict"].startswith("PASS")
    assert d["sustained_residency"]["requests_correct"] == d["sustained_residency"]["requests_sent"]
    assert d["sustained_residency"]["retries"] == 0
    joined = " ".join(d["scope"])
    assert "never averaged" in joined and "34.84" in joined, "the published short-prompt floor is not replaced"
    mm = d["hardware"]["memory_map_observed"]
    assert mm["dedicated_vram_gib"] == 48.0 and "under investigation" in mm["status"]


def test_launch_commands_use_variables_not_real_ports_or_paths():
    md = _data()["launch_commands"]["markdown"]
    for flag in ("--moe-cache-slots 32", "-c 65536", "-b 512 -ub 256", "--spec-draft-n-max 2 --spec-draft-n-min 1", "--cache-reuse 256", "--fit-target 4096"):
        assert flag in md, flag
    assert "/ruta/" in md and "PUERTO=8050" in md and "/home/" not in md
    assert set(re.findall(r"\b\d{1,3}(?:\.\d{1,3}){3}\b", md)) <= {"127.0.0.1"}, "only the loopback bind address"
    for m in re.finditer(PORT, md):
        assert re.match(UNIT_AFTER, md[m.end():m.end() + 10]), "service-port-shaped token in the launch commands: " + md[max(0, m.start() - 20):m.end() + 10]


def test_model_authored_page_is_the_verified_artifact_plus_navigation_block():
    page = (ROOT / PAGE_DIR / "index.html").read_bytes()
    a = _data()["agent_authored_summary"]
    assert hashlib.sha256(page).hexdigest() == a["published_sha256"], "published page changed"
    assert page.count(INTEG_START) == 1 and page.count(INTEG_END) == 1
    document = page[:page.index(INTEG_START)] + page[page.index(INTEG_END) + len(INTEG_END):]
    assert hashlib.sha256(document).hexdigest() == a["final_sha256"], "document portion differs from the verified artifact"
    assert b'<script src="../shared/nav.js" defer></script>' in page
    assert a["final_pass"] == a["passes"][-1] and a["final_pass"] in ("run3", "run4")
    src = page.decode("utf-8")
    assert not re.findall(r"(?:src|href)=\"(?:https?:)?//", src), "the page must be self-contained (no external resources)"
    for m in re.finditer(PORT, _visible(src)):
        assert re.match(UNIT_AFTER, _visible(src)[m.end():m.end() + 10]), "port-shaped token in visible text"


def test_gallery_links_the_new_evidence_from_index_readme_and_canonical_data():
    d = json.loads((ROOT / "data/gallery-v2.json").read_text(encoding="utf-8"))
    hrefs = {e["href"] for e in d["evidence"]}
    assert "data/%s.json" % DATA_ID in hrefs and PAGE_DIR + "/index.html" in hrefs
    assert d["updated"] >= "2026-11-25"
    fl = d["latest"]["flash_next"]
    assert fl["sustained"]["residency_seconds"] == _data()["sustained_residency"]["residency_seconds"]
    assert fl["agent_authored_summary"]["page"] == PAGE_DIR + "/index.html"
    assert fl["agent_authored_summary"]["passes"] == len(_data()["agent_authored_summary"]["passes"])
    assert fl["agent_authored_summary"]["published_sha256"] == _data()["agent_authored_summary"]["published_sha256"]
    html = (ROOT / "index.html").read_text(encoding="utf-8")
    assert 'href="%s/index.html"' % PAGE_DIR in html
    readme = (ROOT / "README.md").read_text(encoding="utf-8")
    assert "(%s/index.html)" % PAGE_DIR in readme and "(data/%s.json)" % DATA_ID in readme


def test_certified_ec64_recipe_is_in_the_dataset_and_matches_the_published_recipe():
    r = json.loads((ROOT / "data/model-recipes-v1.json").read_text(encoding="utf-8"))
    assert r["schema"] == "fjson-gallery-recipes/v1"
    ec = r["recipes"]["qwen38-flash-next-ec64"]
    assert ec["command"].startswith("llama-server -m ")
    for flag in ("--moe-cache-slots 32", "-c 65536", "-b 512 -ub 256", "-t 7 --parallel 1", "--spec-draft-n-max 2 --spec-draft-n-min 1",
                 "--cache-reuse 256", "--fit-target 4096", "--spec-type draft-mtp"):
        assert flag in ec["command"], flag
    assert r["aliases"]["qwen38-flash-next-fast"] == "qwen38-flash-next-ec64"
    d = _data()["recipe"]
    assert (d["context_tokens"], d["moe_cache_slots"], d["cache_reuse"], d["batch"], d["ubatch"], d["threads"], d["parallel"]) == (65536, 32, 256, 512, 256, 7, 1)
    assert "/home/" not in ec["command"] and not re.search(r"\b\d{1,3}(?:\.\d{1,3}){3}\b", ec["command"])
