/**
 * Página Pix de Presente — foto, QR Code e copiar código
 */

(function () {
  'use strict';

  const COPY_RESET_MS = 2500;

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
    return (CONFIG.pix && CONFIG.pix.codigoCopiaCola) || '';
  }

  function setupHeroPhoto() {
    const src = CONFIG.pix?.fotoTopo || CONFIG.fotos?.inicio || '';
    setupPhoto('photo-pix-top', src, 'Sua foto aqui');
  }

  function setupQrImage() {
    const img = document.getElementById('pix-qr-image');
    const src = CONFIG.pix?.qrImage || 'assets/pix-qr.png';
    if (img) img.src = src;
  }

  function setupPhoto(id, src, placeholderText) {
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
      if (placeholder) {
        placeholder.style.display = 'flex';
        placeholder.textContent = placeholderText;
      }
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
      await navigator.clipboard.writeText(code);
      showCopiedFeedback(btn);
    } catch {
      fallbackCopy(code, btn);
    }
  }

  function fallbackCopy(text, btn) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      showCopiedFeedback(btn);
    } catch {
      alert('Não foi possível copiar. Selecione e copie manualmente.');
    }
    document.body.removeChild(ta);
  }

  function showCopiedFeedback(btn) {
    if (!btn) return;

    const label = document.getElementById('pix-copy-label');
    const icon = document.getElementById('pix-copy-icon');
    const originalLabel = label ? label.textContent : '';
    const originalIcon = icon ? icon.className : '';

    btn.classList.add('copied');
    if (label) label.textContent = 'Código copiado!';
    if (icon) icon.className = 'fas fa-check';

    setTimeout(() => {
      btn.classList.remove('copied');
      if (label) label.textContent = originalLabel || 'Copiar código do QR Code';
      if (icon) icon.className = originalIcon || 'far fa-copy';
    }, COPY_RESET_MS);
  }
})();
