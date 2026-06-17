/**
 * Música
 */
(function () {
  'use strict';

  let musicFirstPlay = true;

  window.setupMusic = function setupMusic() {
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
  };

  function updateMusicIcon(playing) {
    const icon = document.getElementById('music-toggle-icon');
    if (icon) {
      icon.className = playing ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    }
  }

  window.startMusic = function startMusic() {
    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !CONFIG.musica || !CONFIG.musica.arquivo) return;

    if (musicFirstPlay) {
      audio.currentTime = CONFIG.musica.inicioEmSegundos || 0;
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
})();
