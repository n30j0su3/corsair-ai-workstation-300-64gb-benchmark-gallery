(() => {
  'use strict';
  const state = { data: null, view: 'overview', rank: 'quality', query: '', family: 'all', status: 'all', lang: localStorage.getItem('fjson-gallery-v2-lang') || 'es' };
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const fmt = value => value === null || value === undefined ? 'Pendiente' : Number(value).toLocaleString(undefined, { maximumFractionDigits: 1 });
  const modelMap = () => new Map(state.data.models.map(model => [model.id, model]));
  const copy = {
    es: { tabs: ['Resumen','Rankings','Evidencia','Entregables'], result: n => `${n} modelos visibles`, pending: 'Pendiente' },
    en: { tabs: ['Overview','Rankings','Evidence','Artifacts'], result: n => `${n} models visible`, pending: 'Pending' }
  };

  function statusLabel(status) {
    return `<span class="status status-${status}">${status}</span>`;
  }

  function metric(model, key, suffix = '') {
    const value = model.metrics[key];
    return value === null || value === undefined ? `<span class="model-role">${copy[state.lang].pending}</span>` : `<span class="metric-value">${fmt(value)}${suffix}</span>`;
  }

  function showView(view, push = true) {
    const safe = ['overview','rankings','evidence','artifacts'].includes(view) ? view : 'overview';
    state.view = safe;
    $$('.view-tab').forEach(button => button.setAttribute('aria-selected', String(button.dataset.view === safe)));
    $$('.view-panel').forEach(panel => { panel.hidden = panel.dataset.view !== safe; });
    if (push) {
      const url = new URL(location.href); url.searchParams.set('view', safe); history.replaceState({}, '', url);
    }
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function renderOverview() {
    const s = state.data.summary;
    $('#updated-date').textContent = state.data.updated;
    $('#metric-models').textContent = s.models;
    $('#metric-verified').textContent = s.verified_models;
    $('#metric-runs').textContent = s.bench_runs;
    $('#metric-artifacts').textContent = s.visual_artifacts;
    const intents = [
      ['01','Default agentic','architect-35b-q6','Arquitectura, UI y trabajo mixto con gates productivos.'],
      ['02','Contexto largo','architect-35b-q6','Único default respaldado por ladder profundo publicado.'],
      ['03','Español estricto','thinkingcap-27b-q4','Carril especializado; úsalo por adherencia, no por velocidad.'],
      ['04','Nueva generación','qwen38-27b-q6','Candidato Qwen3.8: visible, todavía fuera de producción.']
    ];
    $('#intent-grid').innerHTML = intents.map(([n,title,model,body]) => `<article class="intent-card"><span class="number">${n}</span><h3>${title}</h3><p>${body}</p><code>${model}</code></article>`).join('');
    const map = modelMap();
    $('#overview-ranking').innerHTML = state.data.rankings.quality.slice(0, 5).map((id, index) => {
      const m = map.get(id); return `<tr><td>${index + 1}</td><td><span class="model-name">${m.id}</span><span class="model-role">${m.role}</span></td><td>${metric(m,'quality')}</td><td>${metric(m,'decode_tps','')}</td><td>${statusLabel(m.status)}</td></tr>`;
    }).join('');
    $('#hardware-line').textContent = `${state.data.hardware.memory} · ${state.data.hardware.gpu} · ${state.data.hardware.backend}`;
  }

  function rankedModels() {
    const order = state.data.rankings[state.rank] || [];
    const position = new Map(order.map((id, index) => [id, index]));
    return state.data.models.filter(model => {
      const haystack = `${model.id} ${model.family} ${model.quant} ${model.role}`.toLowerCase();
      return (!state.query || haystack.includes(state.query)) && (state.family === 'all' || model.family === state.family) && (state.status === 'all' || model.status === state.status);
    }).sort((a,b) => (position.get(a.id) ?? 9999) - (position.get(b.id) ?? 9999));
  }

  function renderRankings() {
    document.body.dataset.rank = state.rank;
    const models = rankedModels();
    $('#result-count').textContent = copy[state.lang].result(models.length);
    $('#ranking-table-body').innerHTML = models.map((m,index) => `<tr><td>${index + 1}</td><td><span class="model-name">${m.id}</span><span class="model-role">${m.family} · ${m.quant} · ${m.role}</span></td><td>${metric(m,'quality')}</td><td>${metric(m,'decode_tps')}</td><td>${metric(m,'prefill_tps')}</td><td>${metric(m,'context_s','s')}</td><td>${statusLabel(m.status)}</td></tr>`).join('') || '<tr><td colspan="7">No hay modelos para estos filtros.</td></tr>';
  }

  function renderEvidence() {
    $('#evidence-list').innerHTML = [...state.data.evidence].sort((a,b) => b.date.localeCompare(a.date)).map(item => `<a class="evidence-item" href="${item.href}"><span class="evidence-date">${item.date}</span><span class="evidence-kind">${item.kind}</span><span class="evidence-copy"><strong>${item.title}</strong><span>${item.summary}</span></span><span class="evidence-arrow" aria-hidden="true">↗</span></a>`).join('');
  }

  function renderArtifacts() {
    $('#artifact-grid').innerHTML = state.data.artifacts.map(item => `<a class="artifact-card" href="${item.href}"><div><span class="artifact-type">${item.kind.toUpperCase()} · ${item.date}</span><h3>${item.title}</h3><p>${item.summary}</p></div><span class="open">Abrir evidencia ↗</span></a>`).join('');
  }

  function fillFilters() {
    const families = [...new Set(state.data.models.map(model => model.family))].sort();
    $('#family-filter').insertAdjacentHTML('beforeend', families.map(family => `<option value="${family}">${family}</option>`).join(''));
  }

  function applyLanguage() {
    const lang = state.lang; document.documentElement.lang = lang;
    $$('.view-tab').forEach((button,index) => { button.textContent = copy[lang].tabs[index]; });
    $('#lang-toggle').textContent = lang === 'es' ? 'EN' : 'ES';
    renderRankings();
  }

  function bind() {
    $$('.view-tab').forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
    $$('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
    $('#model-search').addEventListener('input', event => { state.query = event.target.value.trim().toLowerCase(); renderRankings(); });
    $('#family-filter').addEventListener('change', event => { state.family = event.target.value; renderRankings(); });
    $('#status-filter').addEventListener('change', event => { state.status = event.target.value; renderRankings(); });
    $$('[data-rank]').forEach(button => button.addEventListener('click', () => { state.rank = button.dataset.rank; $$('[data-rank]').forEach(item => item.setAttribute('aria-pressed', String(item === button))); renderRankings(); }));
    $('#lang-toggle').addEventListener('click', () => { state.lang = state.lang === 'es' ? 'en' : 'es'; localStorage.setItem('fjson-gallery-v2-lang', state.lang); applyLanguage(); });
    $('#theme-toggle').addEventListener('click', () => { const next = document.body.dataset.theme === 'light' ? 'dark' : 'light'; document.body.dataset.theme = next; localStorage.setItem('fjson-gallery-v2-theme', next); });
  }

  async function boot() {
    document.body.classList.add('is-loading');
    const response = await fetch('data/gallery-v2.json');
    if (!response.ok) throw new Error(`Gallery data failed: ${response.status}`);
    state.data = await response.json();
    renderOverview(); fillFilters(); renderRankings(); renderEvidence(); renderArtifacts(); bind(); applyLanguage();
    document.body.dataset.theme = localStorage.getItem('fjson-gallery-v2-theme') || 'dark';
    showView(new URLSearchParams(location.search).get('view') || 'overview', false);
    document.body.classList.remove('is-loading');
  }

  boot().catch(error => { document.body.classList.remove('is-loading'); console.error(error); $('#main').insertAdjacentHTML('afterbegin', '<p role="alert">No fue posible cargar los datos de la Gallery.</p>'); });
})();
