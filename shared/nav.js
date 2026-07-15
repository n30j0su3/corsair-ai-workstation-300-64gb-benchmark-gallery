(function(){
  'use strict';
  // ═══════════════════════════════════════════════════════════
  // FJSON GALLERY — TRANSVERSAL NAVIGATION BAR
  // Auto-injected into every report SPA. Detects depth automatically.
  // ═══════════════════════════════════════════════════════════

  // Prevent double-injection
  if(document.getElementById('fjson-transversal-nav')) return;

  // Detect relative depth to gallery root
  var path = window.location.pathname;
  var depth = 0;
  // Count directory depth: /index.html = 0, /subdir/index.html = 1, /a/b/index.html = 2
  var cleanPath = path.replace(/\/+$/,'').replace(/index\.html?$/,'');
  var segments = cleanPath.split('/').filter(Boolean);
  // If we're on GitHub Pages, the repo name is the first segment — skip it
  var isGHPages = window.location.hostname.indexOf('github.io') !== -1;
  if(isGHPages && segments.length > 0) {
    segments.shift(); // Remove repo name segment
  }
  depth = segments.length;
  var prefix = depth === 0 ? './' : '../'.repeat(depth);

  // Navigation items (href, icon, label, pageId for active state)
  var navItems = [
    { href: prefix + 'index.html',                          icon: '🏠', label: 'Gallery',    id: 'home' },
    { href: prefix + 'best-real-bench/index.html',          icon: '🚀', label: 'Best-Real',  id: 'best-real' },
    { href: prefix + 'context-ladder-20260710/index.html',  icon: '🧭', label: '120K Ladder',id: 'context-ladder' },
    { href: prefix + 'dflash-bench/index.html',             icon: '⚡', label: 'DFlash',     id: 'dflash' },
    { href: prefix + 'visual-3d-bench/index.html',          icon: '🎮', label: 'Visual 3D',  id: 'visual-3d' },
  ];

  // Detect current page to mark active
  var currentFile = path.split('/').pop() || 'index.html';
  var currentDir = path.split('/').slice(-2,-1)[0] || '';
  var activeId = 'home'; // default
  navItems.forEach(function(item){
    var itemPath = item.href.replace(prefix,'');
    if(path.indexOf(itemPath.replace('index.html','')) !== -1 && item.id !== 'home') {
      activeId = item.id;
    }
  });
  // Override: if we're at root index
  if(depth === 0 && (currentFile === 'index.html' || currentFile === '')) {
    activeId = 'home';
  }

  // Build nav HTML
  var navHTML = '<nav id="fjson-transversal-nav" class="fjson-tnav">' +
    '<div class="fjson-tnav-brand">' +
      '<a href="' + prefix + 'index.html" title="Corsair AI Workstation 300 — Benchmark Gallery">' +
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

  navHTML += '</div></nav>';

  // Build style
  var styleHTML = '<style id="fjson-tnav-style">' +
    '#fjson-transversal-nav.fjson-tnav{' +
      'position:sticky;top:0;z-index:9999;' +
      'display:flex;align-items:center;justify-content:space-between;gap:10px;' +
      'background:rgba(1,4,3,.92);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);' +
      'border-bottom:1px solid rgba(6,182,212,.22);' +
      'padding:8px 16px;' +
      'box-shadow:0 4px 30px rgba(0,0,0,.4);' +
      'font-family:"JetBrains Mono","SF Mono",ui-monospace,monospace;' +
      'min-height:48px;' +
    '}' +
    '.fjson-tnav-brand a{' +
      'display:flex;align-items:center;gap:8px;text-decoration:none;' +
      'font-size:.68rem;font-weight:700;letter-spacing:1.5px;color:#06b6d4;white-space:nowrap;' +
    '}' +
    '.fjson-tnav-logo{font-size:1.1em;color:#40E0D0;}' +
    '.fjson-tnav-title{color:#c8d0e0;}' +
    '.fjson-tnav-brand a:hover .fjson-tnav-title{color:#06b6d4;}' +
    '.fjson-tnav-links{' +
      'display:flex;align-items:center;gap:4px;flex-wrap:wrap;' +
    '}' +
    '.fjson-tnav-link{' +
      'display:flex;align-items:center;gap:5px;' +
      'padding:6px 10px;border-radius:999px;text-decoration:none;' +
      'font-size:.6rem;font-weight:600;letter-spacing:.5px;' +
      'color:#b0b8c8;background:transparent;' +
      'border:1px solid transparent;' +
      'transition:all .2s ease;white-space:nowrap;' +
    '}' +
    '.fjson-tnav-link:hover{' +
      'color:#06b6d4;background:rgba(6,182,212,.08);border-color:rgba(6,182,212,.2);' +
    '}' +
    '.fjson-tnav-link.fjson-tnav-active{' +
      'color:#06b6d4;background:rgba(6,182,212,.14);border-color:rgba(6,182,212,.3);' +
    '}' +
    '.fjson-tnav-icon{font-size:.9em;}' +
    // Mobile responsive
    '@media(max-width:680px){' +
      '#fjson-transversal-nav.fjson-tnav{padding:6px 10px;gap:6px;}' +
      '.fjson-tnav-title{display:none;}' +
      '.fjson-tnav-link{padding:6px 8px;}' +
      '.fjson-tnav-label{display:none;}' +
      '.fjson-tnav-icon{font-size:1.05em;}' +
      '.fjson-tnav-links{gap:2px;}' +
    '}' +
    // Pad body to prevent content jump on non-sticky-aware pages
    '@media(max-width:680px){#fjson-transversal-nav.fjson-tnav{min-height:42px;}}' +
    '</style>';

  // Inject
  var head = document.head || document.getElementsByTagName('head')[0];
  var body = document.body || document.getElementsByTagName('body')[0];
  head.insertAdjacentHTML('beforeend', styleHTML);
  body.insertAdjacentHTML('afterbegin', navHTML);

  // Add top padding to body to account for nav height on report pages
  // (main gallery already has sticky control-bar so it stacks fine)
  if(!document.querySelector('.control-bar')) {
    body.style.paddingTop = (body.style.paddingTop ? parseFloat(body.style.paddingTop) + 0 : 0) + 'px';
  }

})();
