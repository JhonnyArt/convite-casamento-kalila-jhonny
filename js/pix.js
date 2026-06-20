/**
 * Página Pix de Presente — foto, QR Code e copiar código
 */

(function () {
  'use strict';

  const COPY_RESET_MS = 3500;
  const COPY_DEFAULT_LABEL = 'Copiar código Pix';
  const COPY_SUCCESS_HTML =
    '<span class="pix-copy-success-line">Pix copiado.<i class="fas fa-check" aria-hidden="true"></i></span>';

  document.addEventListener('DOMContentLoaded', () => {
    setupMusic();
    initPixPage();
  });

  window.initPixPage = function initPixPage() {
    applyConfig();
    setupHeroPhoto();
    setupQrImage();
    bindCopyButtons();
  };

  function applyConfig() {
    const pix = CONFIG.pix || {};
    const noivos = CONFIG.noivos || {};

    setText('[data-cfg="nome1"]', noivos.nome1);
    setText('[data-cfg="nome2"]', noivos.nome2);
    setText('[data-pix="titular"]', pix.titular || '');
    setText('[data-pix="chave"]', pix.chaveLabel || 'Chave Aleatória');
    setText('[data-pix="banco"]', pix.banco || '');
    setText('[data-pix="identificador"]', pix.identificador || '');
  }

  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => { el.textContent = text; });
  }

  function getPixCode() {
    return ((CONFIG.pix && CONFIG.pix.codigoCopiaCola) || '').trim();
  }

  function setupHeroPhoto() {
    const src = CONFIG.pix?.fotoTopo || CONFIG.fotos?.inicio || '';
    setupPhoto('photo-pix-top', src);
  }

  function setupQrImage() {
    const img = document.getElementById('pix-qr-image');
    const src = CONFIG.pix?.qrImage || 'assets/pix-qr.png';
    if (img) img.src = src;
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

  function bindCopyButtons() {
    const mainBtn = document.getElementById('pix-copy-btn');
    const chaveBtn = document.getElementById('pix-copy-chave-btn');

    if (mainBtn) {
      mainBtn.addEventListener('click', () => copyPixCode(mainBtn));
    }

    if (chaveBtn) {
      chaveBtn.addEventListener('click', () => copyPixCode(mainBtn));
    }
  }

  async function copyPixCode(btn) {
    const code = getPixCode();
    if (!code) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
        showCopiedFeedback(btn);
        return;
      }
    } catch {
      /* fallback abaixo */
    }

    copyViaTextarea(code, btn);
  }

  function copyViaTextarea(code, btn) {
    const ta = document.createElement('textarea');
    ta.value = code;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '0';
    ta.style.left = '0';
    ta.style.opacity = '0';
    document.body.appendChild(ta);

    ta.focus();
    ta.select();
    ta.setSelectionRange(0, code.length);

    try {
      const ok = document.execCommand('copy');
      if (ok) {
        showCopiedFeedback(btn);
      } else {
        alert('Não foi possível copiar. Tente novamente.');
      }
    } catch {
      alert('Não foi possível copiar. Tente novamente.');
    }

    document.body.removeChild(ta);
  }

  function showCopiedFeedback(btn) {
    if (!btn) return;

    const label = document.getElementById('pix-copy-label');
    const icon = document.getElementById('pix-copy-icon');
    const originalLabel = label ? label.innerHTML : '';
    const originalIcon = icon ? icon.className : '';

    btn.classList.add('copied');
    if (label) label.innerHTML = COPY_SUCCESS_HTML;
    if (icon) {
      icon.className = 'fas fa-check';
      icon.style.display = 'none';
    }

    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.innerHTML = originalLabel || COPY_DEFAULT_LABEL;
      if (icon) {
        icon.className = originalIcon || 'far fa-copy';
        icon.style.display = '';
      }
    }, COPY_RESET_MS);
  }
})();
