/**
 * Tela de loading Kalila & Jhonny — abertura do convite e navegação entre páginas
 */
window.WeddingLoading = (function () {
  'use strict';

  const DURATION = 3200;

  function applyNames() {
    if (!window.CONFIG?.noivos) return;
    const { nome1, nome2 } = CONFIG.noivos;
    document.querySelectorAll('#loading-screen [data-cfg="nome1"]').forEach(el => {
      el.textContent = nome1;
    });
    document.querySelectorAll('#loading-screen [data-cfg="nome2"]').forEach(el => {
      el.textContent = nome2;
    });
  }

  function show(onComplete) {
    const loading = document.getElementById('loading-screen');
    if (!loading) {
      onComplete?.();
      return Promise.resolve();
    }

    applyNames();

    loading.querySelectorAll('.loading-name, .loading-amp').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    loading.classList.remove('hidden');
    loading.classList.remove('active');
    loading.setAttribute('aria-hidden', 'false');
    void loading.offsetWidth;
    loading.classList.add('active');

    return new Promise(resolve => {
      setTimeout(() => {
        loading.classList.add('hidden');
        loading.classList.remove('active');
        loading.setAttribute('aria-hidden', 'true');
        onComplete?.();
        resolve();
      }, DURATION);
    });
  }

  return { show, DURATION };
})();
