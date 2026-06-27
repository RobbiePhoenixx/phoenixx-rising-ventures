// ============================================================
//  PHOENIXX RISING VENTURES — Music Player
//  © 2026 Phoenixx Rising Ventures LLC
// ============================================================
(function () {
  const audio    = document.getElementById('site-audio');
  const eq       = document.getElementById('player-eq');
  const fill     = document.getElementById('player-fill');
  const volSlider= document.getElementById('vol-slider');
  const muteBtn  = document.getElementById('mute-toggle');
  const iconOn   = document.getElementById('icon-on');
  const iconOff  = document.getElementById('icon-off');

  if (!audio) return;

  const savedVol  = parseFloat(localStorage.getItem('prv-vol')  ?? '0.75');
  const savedMute = localStorage.getItem('prv-mute') === 'true';
  audio.volume = savedVol;
  audio.muted  = savedMute;
  if (volSlider) volSlider.value = savedVol;
  syncIcons(savedMute);
  if (eq) eq.classList.toggle('muted', savedMute);

  // Attempt silent autoplay → then restore mute preference
  audio.muted = true;
  const silentPlay = audio.play();
  if (silentPlay !== undefined) {
    silentPlay.then(() => { audio.muted = savedMute; })
              .catch(() => {
                // Browser blocked autoplay — start on first user interaction
                const unlock = () => {
                  audio.muted = savedMute;
                  audio.play().catch(() => {});
                  document.removeEventListener('click',      unlock);
                  document.removeEventListener('touchstart', unlock);
                  document.removeEventListener('keydown',    unlock);
                };
                document.addEventListener('click',      unlock, { once: true });
                document.addEventListener('touchstart', unlock, { once: true, passive: true });
                document.addEventListener('keydown',    unlock, { once: true });
              });
  }

  // Progress bar
  audio.addEventListener('timeupdate', () => {
    if (!fill || !audio.duration) return;
    fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
  });

  // Volume slider
  volSlider?.addEventListener('input', () => {
    const v = parseFloat(volSlider.value);
    audio.volume = v;
    localStorage.setItem('prv-vol', v);
    if (v > 0 && audio.muted) unmute();
    if (v === 0) mute();
  });

  // Mute toggle
  muteBtn?.addEventListener('click', () => audio.muted ? unmute() : mute());

  // Keyboard: M = mute toggle
  document.addEventListener('keydown', e => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'm' || e.key === 'M') { audio.muted ? unmute() : mute(); }
  });

  function mute() {
    audio.muted = true;
    localStorage.setItem('prv-mute', 'true');
    syncIcons(true);
    if (eq) eq.classList.add('muted');
  }
  function unmute() {
    audio.muted = false;
    localStorage.setItem('prv-mute', 'false');
    syncIcons(false);
    if (eq) eq.classList.remove('muted');
  }
  function syncIcons(muted) {
    if (!muteBtn) return;
    muteBtn.classList.toggle('muted', muted);
    if (iconOn)  iconOn.style.display  = muted ? 'none'  : 'block';
    if (iconOff) iconOff.style.display = muted ? 'block' : 'none';
  }

})();
