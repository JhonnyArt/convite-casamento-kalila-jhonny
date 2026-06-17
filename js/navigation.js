/**
 * Navegação suave entre páginas internas (SPA leve)
 * Mantém áudio e transição Kalila & Jhonny sem recarregar a página
 */
(function () {
  'use strict';

  const INTERNAL = new Set(['index.html', 'rsvp.html', 'pix.html', './', './index.html', '/']);

  const PAGE_STYLES = {
    'index.html': [],
    'rsvp.html': ['css/rsvp.css?v=4'],
    'pix.html': ['css/pix.css?v=2'],
  };

  const PAGE_SCRIPTS = {
    'index.html': ['js/app.js?v=14'],
    'rsvp.html': ['js/guests-reference.js?v=1', 'js/rsvp.js?v=5'],
    'pix.html': ['js/pix.js?v=3'],
  };

  const PAGE_INIT = {
    'index.html': () => window.initIndexPage?.(),
    'rsvp.html': () => window.initRsvpPage?.(),
    'pix.html': () => window.initPixPage?.(),
  };

  let navigating = false;
  const IS_FILE = location.protocol === 'file:';

  document.addEventListener('DOMContentLoaded', () => {
    const viewport = document.getElementById('spa-viewport');
    if (!viewport || IS_FILE) return;

    document.addEventListener('click', onLinkClick);
    window.addEventListener('popstate', onPopState);

    const page = normalizePage(location.pathname);
    history.replaceState({ page, url: page }, '', page);
    syncPersistentUI(page);
  });

  function onLinkClick(e) {
    if (IS_FILE) return;
    const link = e.target.closest('a[href]');
    if (!link || link.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) return;

    const page = normalizePage(href);
    if (!INTERNAL.has(page) && !INTERNAL.has(href)) return;

    e.preventDefault();
    navigateTo(page);
  }

  function onPopState(e) {
    const page = e.state?.page || normalizePage(location.pathname);
    navigateTo(page, false);
  }

  function normalizePage(href) {
    const raw = href.split('?')[0].split('#')[0];
    if (raw === '/' || raw === './' || raw.endsWith('/')) return 'index.html';
    const name = raw.includes('/') ? raw.split('/').pop() : raw;
    return name || 'index.html';
  }

  async function navigateTo(page, push = true) {
    const viewport = document.getElementById('spa-viewport');
    if (!viewport) {
      window.location.href = page;
      return;
    }

    const current = normalizePage(location.pathname);
    if (current === page && push) return;
    if (navigating) return;
    navigating = true;

    try {
      const fetchPromise = fetch(page + '?_=' + Date.now()).then(res => res.text());
      const loadingPromise = window.WeddingLoading?.show() ?? Promise.resolve();

      const [html] = await Promise.all([fetchPromise, loadingPromise]);

      const doc = new DOMParser().parseFromString(html, 'text/html');

      document.title = doc.title;
      await loadPageAssets(page, doc);

      const newViewport = doc.getElementById('spa-viewport');
      if (!newViewport) throw new Error('Viewport não encontrado');

      viewport.innerHTML = newViewport.innerHTML;
      document.body.className = doc.body.className;
      window.scrollTo(0, 0);

      await runPageInit(page);
      syncPersistentUI(page);

      if (push) {
        history.pushState({ page, url: page }, '', page);
      }
    } catch (err) {
      console.error(err);
      window.location.href = page;
    } finally {
      navigating = false;
    }
  }

  async function loadPageAssets(page, doc) {
    const styles = PAGE_STYLES[page] || [];
    for (const href of styles) {
      ensureStylesheet(href);
    }

    const links = doc.querySelectorAll('link[rel="stylesheet"]');
    links.forEach(link => {
      const href = link.getAttribute('href');
      if (href && (href.includes('rsvp.css') || href.includes('pix.css'))) {
        ensureStylesheet(href);
      }
    });

    const scripts = PAGE_SCRIPTS[page] || [];
    for (const src of scripts) {
      await loadScriptOnce(src);
    }
  }

  function ensureStylesheet(href) {
    const base = href.split('?')[0];
    const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      .some(l => l.href.includes(base));
    if (!exists) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  function loadScriptOnce(src) {
    const base = src.split('?')[0];
    if (document.querySelector(`script[src*="${base}"]`)) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = reject;
      document.body.appendChild(s);
    });
  }

  async function runPageInit(page) {
    await delay(50);
    const init = PAGE_INIT[page];
    if (init) init();
  }

  function delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  function syncPersistentUI(page) {
    const opened = sessionStorage.getItem('wedding_invitation_opened') === '1';
    const bottomNav = document.getElementById('bottom-nav');

    if (bottomNav) {
      if (opened && page !== 'index.html') {
        bottomNav.classList.remove('hidden-nav');
      } else if (page === 'index.html' && !opened) {
        bottomNav.classList.add('hidden-nav');
      } else if (page === 'index.html' && opened) {
        bottomNav.classList.remove('hidden-nav');
      }
    }

    if (window.CONFIG?.links) {
      document.querySelectorAll('[data-link="mapa"]').forEach(el => {
        el.href = CONFIG.links.mapa;
      });
      document.querySelectorAll('[data-link="presentes"]').forEach(el => {
        el.href = CONFIG.links.listaPresentes;
      });
    }
  }

  window.WeddingNav = { navigateTo };
})();
