/**
 * Página RSVP — Confirme sua Presença
 * Integração com Google Sheets + regras de guests-reference.js
 */

(function () {
  'use strict';

  const RULES = GUESTS_REFERENCE.rules;
  const YOUNG_NOTE = '* A confirmação de presença é necessária apenas para adultos e crianças maiores de 10 anos.';

  const state = {
    guests: [],
    confirmed: new Set(),
    step: 'search',
    searchQuery: '',
    selectedFamily: null,
    rsvpState: {},
    hasYoungChildren: false,
  };

  document.addEventListener('DOMContentLoaded', () => {
    setupMusic();
    initRsvpPage();
  });

  window.initRsvpPage = function initRsvpPage() {
    applyConfig();
    setupHeroPhoto();
    bindEvents();
    loadGuestList();
  };

  function applyConfig() {
    setText('[data-cfg="prazo-rsvp"]', CONFIG.noivos.prazoRSVP);
  }

  function setupHeroPhoto() {
    const src = CONFIG.pix?.fotoTopo || CONFIG.fotos?.inicio || '';
    setupPhoto('photo-rsvp-top', src);
  }

  function setupPhoto(id, src) {
    const container = document.getElementById(id);
    if (!container || !src) return;

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
      if (placeholder) placeholder.style.display = 'flex';
    };
    testImg.src = src;
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function bindEvents() {
    const searchInput = document.getElementById('rsvp-search-input');
    searchInput.addEventListener('input', () => {
      state.searchQuery = searchInput.value;
      renderSearchStep();
    });

    document.getElementById('rsvp-back-search').addEventListener('click', goToSearch);
    document.getElementById('rsvp-submit-btn').addEventListener('click', submitConfirmation);
    document.getElementById('rsvp-success-restart').addEventListener('click', () => {
      state.step = 'search';
      state.searchQuery = '';
      state.selectedFamily = null;
      state.rsvpState = {};
      document.getElementById('rsvp-search-input').value = '';
      showStep('search');
      renderSearchStep();
    });
  }

  function isAppsScriptConfigured() {
    const url = CONFIG.APPS_SCRIPT_URL || '';
    return url.includes('script.google.com/macros/s/');
  }

  async function loadGuestList() {
    const loadingEl = document.getElementById('rsvp-loading-state');
    const errorEl = document.getElementById('rsvp-global-error');
    const appEl = document.getElementById('rsvp-app');

    if (!isAppsScriptConfigured()) {
      loadingEl.classList.add('rsvp-hidden');
      errorEl.classList.remove('rsvp-hidden');
      errorEl.innerHTML =
        'Configure a URL do Google Apps Script em <code>js/config.js</code> para ativar a confirmação.';
      return;
    }

    try {
      const res = await fetch(`${CONFIG.APPS_SCRIPT_URL}?action=guests&_=${Date.now()}`);
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Erro ao carregar convidados');

      state.guests = enrichGuestsFromReference(data.guests || []);
      state.confirmed = new Set(data.confirmed || []);

      loadingEl.classList.add('rsvp-hidden');
      appEl.classList.remove('rsvp-hidden');
      showStep('search');
      renderSearchStep();
    } catch (err) {
      console.error(err);
      loadingEl.classList.add('rsvp-hidden');
      errorEl.classList.remove('rsvp-hidden');
      errorEl.textContent =
        'Não foi possível conectar à planilha. Atualize a página com Ctrl+F5 ou publique o site no GitHub Pages.';
    }
  }

  /** Interpreta Sim/Não da planilha (texto, booleano ou número) */
  function parseSimValue(value) {
    if (value === true || value === 1) return true;
    const s = String(value ?? '')
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    return s === 'sim' || s === 's' || s === 'yes' || s === 'true';
  }

  /** Verifica crianças < 10 anos: planilha primeiro, referência como fallback */
  function resolvePossuiCriancasMenores(family, members) {
    if (parseSimValue(family.possuiCriancasMenores)) return true;
    if (parseSimValue(family.criancasMenores)) return true;

    for (const m of members) {
      const ref = GUESTS_REFERENCE.findMemberByName(m.nome);
      if (!ref) continue;
      const fullFamily = GUESTS_REFERENCE.getFullFamily(ref.refFamilyId);
      if (fullFamily?.members.some(mem => mem.type === 'young')) return true;
    }
    return false;
  }

  function updateYoungNote(show) {
    const youngNote = document.getElementById('rsvp-young-note');
    if (!youngNote) return;
    youngNote.textContent = YOUNG_NOTE;
    youngNote.hidden = !show;
    youngNote.classList.toggle('rsvp-hidden', !show);
  }

  /** Cruza dados da planilha com metadados da referência (tipo, needsName) */
  function enrichGuestsFromReference(guests) {
    return guests.map(family => {
      const members = family.nomes
        .map(nome => {
          const ref = GUESTS_REFERENCE.findMemberByName(nome);
          const type = ref ? ref.type : 'adult';
          return {
            nome,
            type,
            needsName: ref ? !!ref.needsName : false,
            refId: ref ? ref.id : null,
          };
        })
        .filter(m => !RULES.hiddenTypes.includes(m.type));

      return {
        id: family.id,
        sobrenome: family.sobrenome,
        members,
        displayName: members[0]?.nome || family.sobrenome,
        criancasMenores: family.criancasMenores || '',
        possuiCriancasMenores: resolvePossuiCriancasMenores(family, members),
      };
    }).filter(f => f.members.length > 0);
  }

  function getConfirmKey(familyId, nome) {
    return `${familyId}::${nome}`;
  }

  function isMemberConfirmed(familyId, nome) {
    return state.confirmed.has(getConfirmKey(familyId, nome));
  }

  function getFilteredFamilies() {
    const q = GUESTS_REFERENCE.normalize(state.searchQuery);
    if (q.length < RULES.minSearchLength) return [];

    return state.guests
      .filter(family =>
        family.members.some(m =>
          GUESTS_REFERENCE.normalize(m.nome).includes(q) ||
          GUESTS_REFERENCE.normalize(family.sobrenome).includes(q)
        )
      )
      .map(family => {
        const confirmedCount = family.members.filter(m => isMemberConfirmed(family.id, m.nome)).length;
        const pendingCount = family.members.length - confirmedCount;
        return {
          ...family,
          confirmedCount,
          pendingCount,
          allConfirmed: pendingCount === 0,
        };
      });
  }

  function getFamilyStatusLabel(family) {
    if (family.allConfirmed) return 'Presença confirmada';
    if (family.confirmedCount > 0) {
      return `${family.confirmedCount} confirmada(s) · ${family.pendingCount} pendente(s)`;
    }
    return `${family.members.length} pessoa(s)`;
  }

  function showStep(step) {
    state.step = step;
    document.getElementById('rsvp-step-search').classList.toggle('rsvp-hidden', step !== 'search');
    document.getElementById('rsvp-step-family').classList.toggle('rsvp-hidden', step !== 'family');
    document.getElementById('rsvp-step-success').classList.toggle('rsvp-hidden', step !== 'success');
  }

  function goToSearch() {
    state.selectedFamily = null;
    state.rsvpState = {};
    document.getElementById('rsvp-family-error').classList.add('rsvp-hidden');
    showStep('search');
  }

  function renderSearchStep() {
    const hintEl = document.getElementById('rsvp-search-hint');
    const notFoundEl = document.getElementById('rsvp-not-found');
    const resultsEl = document.getElementById('rsvp-results');
    const q = state.searchQuery.trim();

    hintEl.classList.add('rsvp-hidden');
    notFoundEl.classList.add('rsvp-hidden');
    resultsEl.innerHTML = '';

    if (q.length === 0) return;

    if (q.length < RULES.minSearchLength) {
      hintEl.textContent = RULES.validation.searchHint;
      hintEl.classList.remove('rsvp-hidden');
      return;
    }

    const families = getFilteredFamilies();

    if (families.length === 0) {
      notFoundEl.textContent = RULES.validation.notFound;
      notFoundEl.classList.remove('rsvp-hidden');
      return;
    }

    families.forEach(family => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `rsvp-family-btn${family.allConfirmed ? ' is-confirmed' : ''}`;
      btn.innerHTML = `
        <div>
          <p class="rsvp-family-btn-title">Família de ${escapeHtml(family.displayName)}</p>
          <p class="rsvp-family-btn-count">${escapeHtml(getFamilyStatusLabel(family))}</p>
        </div>
        <i class="fas fa-chevron-right"></i>`;
      btn.addEventListener('click', () => selectFamily(family));
      resultsEl.appendChild(btn);
    });
  }

  function selectFamily(familyFromSearch) {
    const family = state.guests.find(g => String(g.id) === String(familyFromSearch.id)) || familyFromSearch;
    state.selectedFamily = family;
    state.hasYoungChildren = family.possuiCriancasMenores === true;

    state.rsvpState = {};
    family.members.forEach(m => {
      const key = getConfirmKey(family.id, m.nome);
      const confirmed = isMemberConfirmed(family.id, m.nome);
      state.rsvpState[key] = {
        isGoing: false,
        actualName: m.needsName ? '' : m.nome,
        member: m,
        confirmed,
      };
    });

    document.getElementById('rsvp-family-error').classList.add('rsvp-hidden');
    renderFamilyStep();
    showStep('family');
  }

  function renderFamilyStep() {
    const family = state.selectedFamily;
    if (!family) return;

    const cardEl = document.getElementById('rsvp-family-card');
    const surname = family.displayName.split(' ').pop();

    const rows = family.members.map((m) => {
      const key = getConfirmKey(family.id, m.nome);
      const rsvp = state.rsvpState[key];
      const confirmed = isMemberConfirmed(family.id, m.nome);

      if (confirmed) {
        return `
        <div class="rsvp-member-row confirmed" data-key="${escapeAttr(key)}">
          <div class="rsvp-member-left">
            <span class="rsvp-confirmed-icon" aria-hidden="true"><i class="fas fa-check"></i></span>
            <span class="rsvp-member-name">${escapeHtml(m.nome)}</span>
          </div>
          <span class="rsvp-confirmed-badge">Presença confirmada</span>
        </div>`;
      }

      return `
        <div class="rsvp-member-row" data-key="${escapeAttr(key)}">
          <div class="rsvp-member-left">
            <button type="button"
              class="rsvp-check-btn ${rsvp.isGoing ? 'checked' : ''}"
              data-key="${escapeAttr(key)}"
              aria-label="Confirmar ${escapeAttr(m.nome)}">
              ${rsvp.isGoing ? '<i class="fas fa-check"></i>' : ''}
            </button>
            <span class="rsvp-member-name">${escapeHtml(m.nome)}</span>
          </div>
          ${m.needsName && rsvp.isGoing ? `
            <input type="text"
              class="rsvp-name-input"
              data-key="${escapeAttr(key)}"
              value="${escapeAttr(rsvp.actualName)}"
              placeholder="Nome da criança">` : ''}
        </div>`;
    }).join('');

    cardEl.innerHTML = `
      <div class="rsvp-family-card-header">
        <h3>Família ${escapeHtml(surname)}</h3>
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="rsvp-members-list">${rows}</div>`;

    cardEl.querySelectorAll('.rsvp-check-btn').forEach(btn => {
      btn.addEventListener('click', () => toggleMember(btn.dataset.key));
    });

    cardEl.querySelectorAll('.rsvp-name-input').forEach(input => {
      input.addEventListener('input', () => {
        state.rsvpState[input.dataset.key].actualName = input.value;
      });
    });

    const hasPending = family.members.some(m => !isMemberConfirmed(family.id, m.nome));
    const submitBtn = document.getElementById('rsvp-submit-btn');
    const allConfirmedMsg = document.getElementById('rsvp-all-confirmed-msg');

    submitBtn.classList.toggle('rsvp-hidden', !hasPending);
    if (allConfirmedMsg) {
      allConfirmedMsg.hidden = hasPending;
      allConfirmedMsg.classList.toggle('rsvp-hidden', hasPending);
    }

    updateYoungNote(state.hasYoungChildren && hasPending);
  }

  function toggleMember(key) {
    if (!state.rsvpState[key]) return;
    state.rsvpState[key].isGoing = !state.rsvpState[key].isGoing;
    renderFamilyStep();
  }

  async function submitConfirmation() {
    const errorEl = document.getElementById('rsvp-family-error');
    errorEl.classList.add('rsvp-hidden');

    const entries = Object.entries(state.rsvpState);
    const selected = entries.filter(([, s]) => s.isGoing && !s.confirmed && !isMemberConfirmed(state.selectedFamily.id, s.member.nome));

    if (selected.length === 0) {
      errorEl.textContent = RULES.validation.atLeastOne;
      errorEl.classList.remove('rsvp-hidden');
      return;
    }

    for (const [, s] of selected) {
      if (s.member.needsName && !s.actualName.trim()) {
        errorEl.textContent = RULES.validation.needsName;
        errorEl.classList.remove('rsvp-hidden');
        return;
      }
    }

    const family = state.selectedFamily;
    const confirmations = selected.map(([, s]) => ({
      familyId: family.id,
      sobrenome: family.sobrenome,
      nome: s.member.nome,
      nomeConfirmado: s.member.needsName ? s.actualName.trim() : undefined,
    }));

    const btn = document.getElementById('rsvp-submit-btn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
      const res = await fetch(CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'confirm', confirmations }),
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error || 'Erro ao confirmar');

      confirmations.forEach(c => state.confirmed.add(getConfirmKey(c.familyId, c.nome)));

      const successText = document.getElementById('rsvp-success-text');
      successText.textContent = confirmations.length === 1
        ? 'Sua presença foi confirmada. Mal podemos esperar para celebrar juntos!'
        : `${confirmations.length} presenças confirmadas. Mal podemos esperar para celebrar juntos!`;

      showStep('success');
    } catch (err) {
      console.error(err);
      errorEl.textContent = 'Erro ao enviar confirmação. Tente novamente.';
      errorEl.classList.remove('rsvp-hidden');
    } finally {
      btn.disabled = false;
      btn.innerHTML = 'Confirmar Presença <i class="fas fa-check"></i>';
    }
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function escapeAttr(str) {
    return String(str).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
