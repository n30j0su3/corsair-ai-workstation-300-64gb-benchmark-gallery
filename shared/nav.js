(function(){
  'use strict';
  // ═══════════════════════════════════════════════════════════
  // FJSON GALLERY — UNIFIED NAVIGATION BAR
  // Contains: brand, page links, EN/ES toggle, Theme toggle
  // Auto-injected into ALL report SPAs (main + sub-reports)
  // ═══════════════════════════════════════════════════════════

  if(document.getElementById('fjson-transversal-nav')) return;

  // Detect relative depth
  var path = window.location.pathname;
  var isGHPages = window.location.hostname.indexOf('github.io') !== -1;
  var cleanPath = path.replace(/\/+$/,'').replace(/index\.html?$/,'');
  var segments = cleanPath.split('/').filter(Boolean);
  if(isGHPages && segments.length > 0) segments.shift();
  var depth = segments.length;
  var prefix = depth === 0 ? './' : '../'.repeat(depth);

  // Nav items
  var navItems = [
    { href: prefix + 'index.html',                          icon: '🏠', label: 'Gallery',     id: 'home' },
    { href: prefix + 'best-real-bench/index.html',          icon: '🚀', label: 'Best-Real',   id: 'best-real' },
    { href: prefix + 'context-ladder-20260710/index.html',  icon: '🧭', label: '120K Ladder', id: 'context-ladder' },
    { href: prefix + 'dflash-bench/index.html',             icon: '⚡', label: 'DFlash',      id: 'dflash' },
    { href: prefix + 'visual-3d-bench/index.html',          icon: '🎮', label: 'Visual 3D',   id: 'visual-3d' },
  ];

  // Detect active page
  var activeId = 'home';
  navItems.forEach(function(item){
    if(item.id === 'home') return;
    var itemDir = item.href.replace(prefix,'').replace('index.html','');
    if(path.indexOf(itemDir) !== -1) activeId = item.id;
  });
  if(depth === 0) activeId = 'home';

  // Detect if main page (has its own control-bar with EN/ES + theme)
  var isMainPage = depth === 0;
  // Check if page already has language/theme controls we need to merge
  var existingLangBar = document.querySelector('.control-bar');

  // ── Build unified nav ──
  var navHTML = '<nav id="fjson-transversal-nav" class="fjson-tnav">' +
    '<div class="fjson-tnav-inner">' +
      '<div class="fjson-tnav-brand">' +
        '<a href="' + prefix + 'index.html">' +
          '<span class="fjson-tnav-logo">⬡</span> <span class="fjson-tnav-title">CORSAIR · MINIV</span>' +
        '</a>' +
      '</div>' +
      '<div class="fjson-tnav-links">';

  navItems.forEach(function(item){
    var isActive = item.id === activeId ? ' fjson-tnav-active' : '';
    navHTML += '<a href="' + item.href + '" class="fjson-tnav-link' + isActive + '">' +
      '<span class="fjson-tnav-icon">' + item.icon + '</span>' +
      '<span class="fjson-tnav-label">' + item.label + '</span>' +
      '</a>';
  });

  // ── Controls (EN/ES + Theme) — always present ──
  navHTML += '</div>' +
    '<div class="fjson-tnav-controls">' +
      '<div class="fjson-tnav-lang">' +
        '<button type="button" class="fjson-tnav-btn" id="fjson-nav-en" aria-pressed="true">EN</button>' +
        '<button type="button" class="fjson-tnav-btn" id="fjson-nav-es" aria-pressed="false">ES</button>' +
      '</div>' +
      '<button type="button" class="fjson-tnav-btn fjson-tnav-theme" id="fjson-nav-theme" aria-pressed="false"><span class="fjson-tnav-theme-icon">🌙</span></button>' +
    '</div>';

  navHTML += '</div></nav>';

  // ── Styles ──
  var styleHTML = '<style id="fjson-tnav-style">' +
    '#fjson-transversal-nav.fjson-tnav{' +
      'position:sticky;top:0;z-index:9999;' +
      'background:rgba(1,4,3,.94);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);' +
      'border-bottom:1px solid rgba(6,182,212,.22);' +
      'box-shadow:0 4px 30px rgba(0,0,0,.4);' +
      'font-family:"JetBrains Mono","SF Mono",ui-monospace,monospace;' +
    '}' +
    '.fjson-tnav-inner{' +
      'display:flex;align-items:center;justify-content:space-between;gap:10px;' +
      'max-width:1180px;margin:0 auto;padding:7px 16px;min-height:46px;' +
    '}' +
    '.fjson-tnav-brand a{' +
      'display:flex;align-items:center;gap:7px;text-decoration:none;' +
      'font-size:.65rem;font-weight:700;letter-spacing:1.5px;color:#06b6d4;white-space:nowrap;' +
    '}' +
    '.fjson-tnav-logo{font-size:1.15em;color:#40E0D0;}' +
    '.fjson-tnav-title{color:#c8d0e0;}' +
    '.fjson-tnav-brand a:hover .fjson-tnav-title{color:#06b6d4;}' +
    '.fjson-tnav-links{' +
      'display:flex;align-items:center;gap:3px;flex-wrap:wrap;' +
    '}' +
    '.fjson-tnav-link{' +
      'display:flex;align-items:center;gap:4px;' +
      'padding:5px 9px;border-radius:999px;text-decoration:none;' +
      'font-size:.58rem;font-weight:600;letter-spacing:.5px;' +
      'color:#b0b8c8;background:transparent;' +
      'border:1px solid transparent;transition:all .2s ease;white-space:nowrap;' +
    '}' +
    '.fjson-tnav-link:hover{' +
      'color:#06b6d4;background:rgba(6,182,212,.08);border-color:rgba(6,182,212,.2);' +
    '}' +
    '.fjson-tnav-link.fjson-tnav-active{' +
      'color:#06b6d4;background:rgba(6,182,212,.14);border-color:rgba(6,182,212,.3);' +
    '}' +
    '.fjson-tnav-icon{font-size:.95em;}' +
    // Controls
    '.fjson-tnav-controls{display:flex;align-items:center;gap:6px;}' +
    '.fjson-tnav-lang{display:flex;gap:2px;}' +
    '.fjson-tnav-btn{' +
      'background:rgba(6,182,212,.06);border:1px solid rgba(6,182,212,.2);color:#b0b8c8;' +
      'border-radius:999px;padding:5px 9px;font-family:inherit;font-size:.58rem;font-weight:600;' +
      'letter-spacing:.5px;cursor:pointer;transition:all .2s ease;min-width:34px;' +
    '}' +
    '.fjson-tnav-btn:hover{color:#06b6d4;border-color:rgba(6,182,212,.4);}' +
    '.fjson-tnav-btn.active{color:#06b6d4;background:rgba(6,182,212,.18);border-color:rgba(6,182,212,.4);}' +
    '.fjson-tnav-theme{font-size:.75rem;padding:5px 7px;}' +
    // Body theme control
    'body.fjson-light{background:#f6fbff !important;color:#102033;}' +
    'body.fjson-light *{border-color:rgba(6,116,144,.15) !important;}' +
    'body.fjson-light .fjson-tnav{background:rgba(255,255,255,.92) !important;border-color:rgba(6,116,144,.15) !important;}' +
    'body.fjson-light .fjson-tnav-btn{color:#475569;background:rgba(6,116,144,.08);border-color:rgba(6,116,144,.15);}' +
    'body.fjson-light .fjson-tnav-btn.active{color:#06b6d4;background:rgba(6,116,144,.12);}' +
    'body.fjson-light .fjson-tnav-link{color:#475569;}' +
    'body.fjson-light .fjson-tnav-title{color:#102033;}' +
    // Mobile
    '@media(max-width:680px){' +
      '.fjson-tnav-inner{padding:5px 10px;gap:6px;min-height:42px;}' +
      '.fjson-tnav-title{display:none;}' +
      '.fjson-tnav-label{display:none;}' +
      '.fjson-tnav-icon{font-size:1.05em;}' +
      '.fjson-tnav-link{padding:6px 7px;}' +
      '.fjson-tnav-links{gap:2px;}' +
      '.fjson-tnav-btn{font-size:.55rem;padding:5px 7px;}' +
    '}' +
    '</style>';

  // Inject
  var head = document.head || document.getElementsByTagName('head')[0];
  var body = document.body || document.getElementsByTagName('body')[0];
  head.insertAdjacentHTML('beforeend', styleHTML);
  body.insertAdjacentHTML('afterbegin', navHTML);

  // ═══════════════════════════════════════════════════════════
  // LANGUAGE + THEME STATE (works across all pages)
  // ═══════════════════════════════════════════════════════════
  var LANG_KEY = 'fjson-gallery-lang';
  var THEME_KEY = 'fjson-gallery-theme';
  var currentLang = localStorage.getItem(LANG_KEY) || 'en';
  var currentTheme = localStorage.getItem(THEME_KEY) || 'dark';

  // ── Language ──
  function applyNavLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    var enBtn = document.getElementById('fjson-nav-en');
    var esBtn = document.getElementById('fjson-nav-es');
    if(enBtn) enBtn.classList.toggle('active', lang === 'en');
    if(esBtn) esBtn.classList.toggle('active', lang === 'es');
    if(enBtn) enBtn.setAttribute('aria-pressed', String(lang === 'en'));
    if(esBtn) esBtn.setAttribute('aria-pressed', String(lang === 'es'));

    // If main page has its own i18n system, call it
    if(typeof window.setLanguage === 'function') {
      window.setLanguage(lang);
    } else {
      // Report pages: translate data-l10n elements if any
      document.querySelectorAll('[data-l10n]').forEach(function(el) {
        var val = lang === 'es' ? el.dataset.es : el.dataset.en;
        if(val !== undefined) el.innerHTML = val;
      });
    }
    document.documentElement.lang = lang;
  }

  // ── Theme ──
  function applyNavTheme(theme) {
    localStorage.setItem(THEME_KEY, theme);
    var isLight = theme === 'light';
    body.classList.toggle('fjson-light', isLight);
    body.dataset.theme = isLight ? 'light' : 'dark';
    var themeBtn = document.getElementById('fjson-nav-theme');
    if(themeBtn) {
      var icon = themeBtn.querySelector('.fjson-tnav-theme-icon');
      if(icon) icon.textContent = isLight ? '☀️' : '🌙';
      themeBtn.setAttribute('aria-pressed', String(isLight));
    }
    // If main page has its own theme system, call it
    if(typeof window.applyTheme === 'function') {
      window.applyTheme(theme);
    }
  }

  // Wire up buttons
  var enBtn = document.getElementById('fjson-nav-en');
  var esBtn = document.getElementById('fjson-nav-es');
  var themeBtn = document.getElementById('fjson-nav-theme');
  if(enBtn) enBtn.addEventListener('click', function(){ applyNavLang('en'); });
  if(esBtn) esBtn.addEventListener('click', function(){ applyNavLang('es'); });
  if(themeBtn) themeBtn.addEventListener('click', function(){
    var isLight = body.classList.contains('fjson-light');
    applyNavTheme(isLight ? 'dark' : 'light');
  });

  // ── If main page has existing control-bar, REMOVE it (we replaced it) ──
  if(existingLangBar && isMainPage) {
    existingLangBar.remove();
  }

  // ── Apply saved state on load ──
  applyNavLang(currentLang);
  applyNavTheme(currentTheme);

})();
