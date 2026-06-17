/**
 * Lógica principal do convite de casamento
 */
(function () {
  'use strict';

  const STORAGE_OPENED = 'wedding_invitation_opened';
  const state = {
    opened: false,
  };

  window.initIndexPage = function initIndexPage() {
    applyConfig();

    if (sessionStorage.getItem(STORAGE_OPENED) === '1' && isGatefoldVisible()) {
      restoreOpenedInvitation(false);
    }

    if (document.getElementById('dias')) {
      initCountdown();
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    initIndexPage();
  });

  function isGatefoldVisible() {
    const gatefold = document.getElementById('gatefold-screen');
    if (!gatefold) return false;
    return !gatefold.classList.contains('hidden') && gatefold.style.display !== 'none';
  }

  function applyConfig() {
    const c = CONFIG.noivos;
    setText('[data-cfg="nome1"]', c.nome1);
    setText('[data-cfg="nome2"]', c.nome2);
    setText('[data-cfg="data"]', c.data);
    setText('[data-cfg="horario"]', c.horario);
    setText('[data-cfg="local"]', c.local);
    setText('[data-cfg="endereco"]', c.endereco);
    setText('[data-cfg="prazo-rsvp"]', c.prazoRSVP);

    if (CONFIG.pais) {
      setText('[data-cfg="pai-noivo-1"]', CONFIG.pais.noivo[0]);
      setText('[data-cfg="pai-noivo-2"]', CONFIG.pais.noivo[1]);
      setText('[data-cfg="pai-noiva-1"]', CONFIG.pais.noiva[0]);
      setText('[data-cfg="pai-noiva-2"]', CONFIG.pais.noiva[1]);
    }

    const mapLink = document.querySelector('[data-link="mapa"]');
    const giftLink = document.querySelector('[data-link="presentes"]');
    if (mapLink) mapLink.href = CONFIG.links.mapa;
    if (giftLink) giftLink.href = CONFIG.links.listaPresentes;

    setupPhoto('photo-inicio', CONFIG.fotos.inicio, 'Sua foto aqui');
    setupPhoto('photo-final', CONFIG.fotos.final, 'Sua foto aqui');
    setupGatefoldPhoto();
    setupMusic();
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function setupGatefoldPhoto() {
    const el = document.getElementById('gatefold-cover-photo');
    if (!el || !CONFIG.fotos?.inicio) return;

    const testImg = new Image();
    testImg.onload = () => {
      el.style.backgroundImage = `url('${CONFIG.fotos.inicio}')`;
    };
    testImg.src = CONFIG.fotos.inicio;
  }

  function setupPhoto(id, src, placeholderText) {
    const container = document.getElementById(id);
    if (!container) return;

    const img = container.querySelector('img');
    const placeholder = container.querySelector('.photo-placeholder');

    const testImg = new Image();
    testImg.onload = () => {
      img.src = src;
      img.style.display = 'block';
      if (placeholder) placeholder.style.display = 'none';
    };
    testImg.onerror = () => {
      img.style.display = 'none';
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.textContent = placeholderText;
      }
    };
    testImg.src = src;
  }

  function showLoadingThenContent(onComplete) {
    if (window.WeddingLoading) {
      WeddingLoading.show(onComplete);
      return;
    }
    onComplete?.();
  }

  function restoreOpenedInvitation(animateLoading) {
    if (!isGatefoldVisible()) return;

    const gatefoldScreen = document.getElementById('gatefold-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');

    const finish = () => {
      gatefoldScreen?.classList.add('hidden');
      if (gatefoldScreen) gatefoldScreen.style.display = 'none';
      mainContent?.classList.add('visible');
      bottomNav?.classList.remove('hidden-nav');
      document.body.classList.remove('locked');
    };

    if (animateLoading) {
      showLoadingThenContent(finish);
    } else {
      finish();
    }
  }

  window.openInvitation = function () {
    if (!isGatefoldVisible()) return;
    if (state.opened) return;
    state.opened = true;

    sessionStorage.setItem(STORAGE_OPENED, '1');

    const container = document.getElementById('gatefold-container');
    const gatefoldScreen = document.getElementById('gatefold-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');

    container?.classList.add('opening');
    startMusic();

    const sealContent = document.getElementById('gatefold-seal-content');
    if (sealContent) sealContent.style.pointerEvents = 'none';

    setTimeout(() => {
      gatefoldScreen?.classList.add('hidden');

      showLoadingThenContent(() => {
        mainContent?.classList.add('visible');
        bottomNav?.classList.remove('hidden-nav');
        document.body.classList.remove('locked');

        setTimeout(() => {
          if (gatefoldScreen) gatefoldScreen.style.display = 'none';
        }, 800);
      });
    }, 1600);
  };

  let countdownInterval = null;

  function initCountdown() {
    if (countdownInterval) clearInterval(countdownInterval);

    const target = new Date(CONFIG.noivos.dataISO).getTime();
    const ids = ['dias', 'horas', 'minutos', 'segundos'];

    const tick = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        ids.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.textContent = '00';
        });
        return;
      }

      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      const values = [d, h, m, s];
      ids.forEach((id, i) => {
        const el = document.getElementById(id);
        if (el) el.textContent = String(values[i]).padStart(2, '0');
      });
    };

    tick();
    countdownInterval = setInterval(tick, 1000);
  }
})();
