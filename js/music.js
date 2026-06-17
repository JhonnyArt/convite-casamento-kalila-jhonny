/**
 * Música — igual ao histórico do Git (setupMusic + startMusic no clique do selo)
 */
(function () {
  'use strict';

  let musicFirstPlay = true;
  let setupDone = false;

  window.setupMusic = function setupMusic() {
    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !window.CONFIG?.musica?.arquivo || setupDone) return;
    setupDone = true;

    audio.src = CONFIG.musica.arquivo;
    audio.volume = CONFIG.musica.volume ?? 0.45;
    audio.loop = false;
    audio.load();

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
  };

  function updateMusicIcon(playing) {
    const icon = document.getElementById('music-toggle-icon');
    if (icon) {
      icon.className = playing ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  }

  window.startMusic = function startMusic() {
    window.setupMusic();

    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !CONFIG.musica?.arquivo) return;

    if (musicFirstPlay) {
      applyInitialOffset(audio);
      musicFirstPlay = false;
    }

    audio.play()
      .then(() => {
        updateMusicIcon(true);
        if (toggle) toggle.classList.remove('hidden-nav');
      })
      .catch(() => {
        if (toggle) toggle.classList.remove('hidden-nav');
      });
  };

  function applyInitialOffset(audio) {
    const offset = Number(CONFIG.musica?.inicioEmSegundos || 0);
    if (!Number.isFinite(offset) || offset <= 0) return;

    const setOffset = () => {
      try {
        // Evita estourar além da duração real do arquivo.
        const hasDuration = Number.isFinite(audio.duration) && audio.duration > 0;
        const safeOffset = hasDuration ? Math.min(offset, Math.max(0, audio.duration - 0.25)) : offset;
        audio.currentTime = safeOffset;
      } catch (_) {
        // Alguns navegadores lançam erro se metadata ainda não carregou.
      }
    };

    if (audio.readyState >= 1) {
      setOffset();
      return;
    }

    audio.addEventListener('loadedmetadata', setOffset, { once: true });
  }
})();
