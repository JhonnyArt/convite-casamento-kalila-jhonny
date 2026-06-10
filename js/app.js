/**
 * Lógica principal do convite de casamento
 */

(function () {
  'use strict';

  const state = {
    guests: [],
    confirmed: new Set(),
    selectedFamily: null,
    opened: false,
    musicFirstPlay: true,
  };

  // ── Inicialização ──
  document.addEventListener('DOMContentLoaded', () => {
    applyConfig();
    initCountdown();
    loadGuestList();
  });

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
    const pixLink = document.querySelector('[data-link="pix"]');
    if (mapLink) mapLink.href = CONFIG.links.mapa;
    if (giftLink) giftLink.href = CONFIG.links.listaPresentes;
    if (pixLink) pixLink.href = CONFIG.links.pix;

    setupPhoto('photo-inicio', CONFIG.fotos.inicio, 'Sua foto aqui');
    setupPhoto('photo-final', CONFIG.fotos.final, 'Sua foto aqui');
    setupMusic();
  }

  function setupMusic() {
    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !CONFIG.musica || !CONFIG.musica.arquivo) return;

    audio.src = CONFIG.musica.arquivo;
    audio.volume = CONFIG.musica.volume ?? 0.45;
    audio.loop = false;

    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    if (toggle) {
      toggle.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().catch(() => {});
          updateMusicIcon(true);
        } else {
          audio.pause();
          updateMusicIcon(false);
        }
      });
    }
  }

  function updateMusicIcon(playing) {
    const icon = document.getElementById('music-toggle-icon');
    if (icon) {
      icon.className = playing ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  }

  function startMusic() {
    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !CONFIG.musica || !CONFIG.musica.arquivo) return;

    if (state.musicFirstPlay) {
      audio.currentTime = CONFIG.musica.inicioEmSegundos || 0;
      state.musicFirstPlay = false;
    }

    audio.play()
      .then(() => {
        updateMusicIcon(true);
        if (toggle) toggle.classList.remove('hidden-nav');
      })
      .catch(() => {
        if (toggle) toggle.classList.remove('hidden-nav');
      });
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
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

  const LOADING_DURATION = 2800;

  function showLoadingThenContent(onComplete) {
    const loading = document.getElementById('loading-screen');
    const letters = loading.querySelectorAll('.loading-letter, .loading-amp, .loading-line');

    letters.forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });

    loading.classList.remove('hidden');
    loading.classList.remove('active');
    loading.setAttribute('aria-hidden', 'false');
    void loading.offsetWidth;
    loading.classList.add('active');

    setTimeout(() => {
      loading.classList.add('hidden');
      loading.classList.remove('active');
      loading.setAttribute('aria-hidden', 'true');
      onComplete();
    }, LOADING_DURATION);
  }

  // ── Abrir gatefold ──
  window.openInvitation = function () {
    if (state.opened) return;
    state.opened = true;

    const container = document.getElementById('gatefold-container');
    const gatefoldScreen = document.getElementById('gatefold-screen');
    const mainContent = document.getElementById('main-content');
    const bottomNav = document.getElementById('bottom-nav');

    container.classList.add('opening');
    startMusic();

    const sealContent = document.getElementById('gatefold-seal-content');
    if (sealContent) {
      sealContent.style.pointerEvents = 'none';
    }

    setTimeout(() => {
      gatefoldScreen.classList.add('hidden');

      showLoadingThenContent(() => {
        mainContent.classList.add('visible');
        bottomNav.classList.remove('hidden-nav');
        document.body.classList.remove('locked');

        setTimeout(() => {
          gatefoldScreen.style.display = 'none';
        }, 800);
      });
    }, 1600);
  };

  // ── Contador regressivo ──
  function initCountdown() {
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
    setInterval(tick, 1000);
  }

  function isAppsScriptConfigured() {
    const url = CONFIG.APPS_SCRIPT_URL || '';
    return url.includes('script.google.com/macros/s/');
  }

  // ── Google Sheets — carregar convidados ──
  async function loadGuestList() {
    const listEl = document.getElementById('family-list');
    const loadingEl = document.getElementById('rsvp-loading');
    const errorEl = document.getElementById('rsvp-error');

    if (!isAppsScriptConfigured()) {
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.innerHTML = 'Configure a URL do Google Apps Script em <code>js/config.js</code> para ativar a lista de confirmação.';
      }
      if (listEl) listEl.innerHTML = '';
      return;
    }

    try {
      const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=guests&_=${Date.now()}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Erro ao carregar convidados');

      state.guests = data.guests || [];
      state.confirmed = new Set(data.confirmed || []);

      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) errorEl.style.display = 'none';
      renderFamilyList(listEl);

      if (state.guests.length === 0) {
        document.getElementById('rsvp-empty').style.display = 'block';
      }
    } catch (err) {
      console.error(err);
      if (loadingEl) loadingEl.style.display = 'none';
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.textContent = 'Não foi possível conectar à planilha. Atualize a página com Ctrl+F5 ou publique o site no GitHub Pages.';
      }
      if (listEl) listEl.innerHTML = '';
    }
  }

  function renderFamilyList(container) {
    if (!container) return;
    container.innerHTML = '';

    state.guests.forEach(family => {
      const card = document.createElement('div');
      card.className = 'family-card';
      card.dataset.id = family.id;

      const allConfirmed = family.nomes.every(n => state.confirmed.has(`${family.id}::${n}`));

      card.innerHTML = `
        <div class="family-header" onclick="toggleFamily(this)">
          <h4>Família ${escapeHtml(family.sobrenome)}</h4>
          <i class="fas fa-chevron-down chevron"></i>
        </div>
        <div class="family-members">
          ${family.nomes.map(nome => {
            const key = `${family.id}::${nome}`;
            const isConfirmed = state.confirmed.has(key);
            return `
              <div class="member-row ${isConfirmed ? 'confirmed' : ''}" data-key="${escapeAttr(key)}">
                <input type="checkbox" id="chk-${escapeAttr(key)}" value="${escapeAttr(nome)}"
                  data-family-id="${escapeAttr(family.id)}"
                  data-sobrenome="${escapeAttr(family.sobrenome)}"
                  ${isConfirmed ? 'checked disabled' : ''}
                  onchange="onMemberCheck(this)">
                <label for="chk-${escapeAttr(key)}">${escapeHtml(nome)}</label>
              </div>`;
          }).join('')}
        </div>`;

      container.appendChild(card);
    });
  }

  window.toggleFamily = function (header) {
    const card = header.closest('.family-card');
    const wasOpen = card.classList.contains('open');
    document.querySelectorAll('.family-card').forEach(c => c.classList.remove('open', 'active'));
    if (!wasOpen) {
      card.classList.add('open', 'active');
      state.selectedFamily = card.dataset.id;
    }
  };

  window.onMemberCheck = function (checkbox) {
    const card = checkbox.closest('.family-card');
    const checked = card.querySelectorAll('input[type="checkbox"]:checked:not(:disabled)');
    card.classList.toggle('active', checked.length > 0);
  };

  window.filterFamilies = function (query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.family-card').forEach(card => {
      const name = card.querySelector('h4').textContent.toLowerCase();
      const members = Array.from(card.querySelectorAll('label')).map(l => l.textContent.toLowerCase()).join(' ');
      card.style.display = (name.includes(q) || members.includes(q)) ? '' : 'none';
    });
  };

  // ── Enviar confirmação ──
  window.submitConfirmation = async function () {
    const btn = document.getElementById('confirm-btn');
    const checkboxes = document.querySelectorAll('.family-members input[type="checkbox"]:checked:not(:disabled)');

    if (checkboxes.length === 0) {
      alert('Selecione pelo menos uma pessoa para confirmar presença.');
      return;
    }

    const confirmations = Array.from(checkboxes).map(cb => ({
      familyId: cb.dataset.familyId,
      sobrenome: cb.dataset.sobrenome,
      nome: cb.value,
    }));

    if (!isAppsScriptConfigured()) {
      alert('Configure a URL do Google Apps Script em js/config.js');
      return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'confirm', confirmations }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Erro ao confirmar');

      confirmations.forEach(c => state.confirmed.add(`${c.familyId}::${c.nome}`));
      lockConfirmedCheckboxes();
      showSuccess(confirmations.length);
    } catch (err) {
      console.error(err);
      alert('Erro ao enviar confirmação. Tente novamente.');
      btn.disabled = false;
      btn.innerHTML = '<span>Confirmar Presença</span><i class="fas fa-check"></i>';
    }
  };

  function lockConfirmedCheckboxes() {
    document.querySelectorAll('.family-members input[type="checkbox"]:checked').forEach(cb => {
      cb.disabled = true;
      cb.closest('.member-row').classList.add('confirmed');
    });
  }

  function showSuccess(count) {
    document.getElementById('rsvp-form-area').style.display = 'none';
    const success = document.getElementById('rsvp-success');
    success.classList.add('show');
    success.querySelector('p').textContent =
      count === 1
        ? 'Sua presença foi confirmada com sucesso!'
        : `${count} presenças confirmadas com sucesso!`;
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str) {
    return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
