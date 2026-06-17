/**
 * Música
 */
(function () {
  'use strict';

  const MUSIC_STATE_KEY = 'wedding_music_state_v1';
  let musicFirstPlay = true;

  window.setupMusic = function setupMusic() {
    const audio = document.getElementById('wedding-music');
    const toggle = document.getElementById('music-toggle');
    if (!audio || !CONFIG.musica || !CONFIG.musica.arquivo) return;

    const isInitialized = audio.dataset.musicInit === '1';
    if (!isInitialized) {
      audio.dataset.musicInit = '1';
      bindMusicPersistence(audio);
    }

    // Evita reinicializar o player quando trocar entre páginas SPA.
    if (!audio.src || !audio.src.includes(CONFIG.musica.arquivo)) {
      audio.src = CONFIG.musica.arquivo;
    }
    audio.volume = CONFIG.musica.volume ?? 0.45;
    audio.loop = false;

    restoreMusicState(audio);

    if (toggle) {
      if (toggle.dataset.musicBound === '1') return;
      toggle.dataset.musicBound = '1';
      toggle.addEventListener('click', () => {
        if (audio.paused) {
          audio.play().catch(() => {});
          updateMusicIcon(true);
          saveMusicState(audio, true);
        } else {
          audio.pause();
          updateMusicIcon(false);
          saveMusicState(audio, false);
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
        saveMusicState(audio, true);
      })
      .catch(() => {
        if (toggle) toggle.classList.remove('hidden-nav');
      });
  };

  function bindMusicPersistence(audio) {
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    audio.addEventListener('play', () => {
      saveMusicState(audio, true);
    });

    audio.addEventListener('pause', () => {
      saveMusicState(audio, false);
    });

    audio.addEventListener('timeupdate', () => {
      saveMusicState(audio, !audio.paused);
    });

    window.addEventListener('beforeunload', () => {
      saveMusicState(audio, !audio.paused);
    });
  }

  function saveMusicState(audio, shouldPlay) {
    try {
      const state = {
        shouldPlay: !!shouldPlay,
        currentTime: Number(audio.currentTime || 0),
      };
      sessionStorage.setItem(MUSIC_STATE_KEY, JSON.stringify(state));
    } catch (_) {}
  }

  function restoreMusicState(audio) {
    try {
      const raw = sessionStorage.getItem(MUSIC_STATE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw);
      if (saved && typeof saved.currentTime === 'number' && saved.currentTime > 0) {
        try {
          audio.currentTime = saved.currentTime;
        } catch (_) {}
      }

      updateMusicIcon(saved && saved.shouldPlay === true);
      if (saved && saved.shouldPlay === true) {
        audio.play().catch(() => {});
      }
    } catch (_) {}
  }
})();
