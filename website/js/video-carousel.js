// ============================================================
//  PHOENIXX RISING VENTURES — Video Carousel
//  To add more videos: duplicate a .video-slide block in index.html,
//  update src="videos/sonic-octane-XX.mp4", caption, and add a dot.
// ============================================================
(function () {
  'use strict';

  const carousel  = document.getElementById('video-carousel');
  if (!carousel) return;

  const track     = document.getElementById('video-track');
  const prevBtn   = document.getElementById('video-prev');
  const nextBtn   = document.getElementById('video-next');
  const dotsWrap  = document.getElementById('video-dots');
  const slides    = Array.from(track.querySelectorAll('.video-slide'));
  const dots      = Array.from(dotsWrap.querySelectorAll('.video-dot'));

  if (slides.length === 0) return;

  let current    = 0;
  let autoTimer  = null;
  const AUTO_MS  = 8000;   // advance every 8 seconds

  // ── Go to a specific slide ────────────────────────
  function goTo(index) {
    const prev = current;

    // Pause previously active video
    const prevVideo = slides[prev].querySelector('video');
    if (prevVideo) { prevVideo.pause(); prevVideo.currentTime = 0; }

    current = (index + slides.length) % slides.length;

    // Slide the track
    track.style.transform = `translateX(-${current * 100}%)`;

    // Update active classes
    slides[prev].classList.remove('active');
    slides[current].classList.add('active');

    if (dots[prev])    { dots[prev].classList.remove('active');    dots[prev].setAttribute('aria-selected','false'); }
    if (dots[current]) { dots[current].classList.add('active');    dots[current].setAttribute('aria-selected','true'); }

    // Play new video (muted so autoplay works cross-browser)
    const nextVideo = slides[current].querySelector('video');
    if (nextVideo && nextVideo.src) {
      nextVideo.muted = true;
      nextVideo.play().catch(() => {});
    }

    // Hide/show arrows when only one slide
    if (slides.length <= 1) {
      prevBtn.style.display = 'none';
      nextBtn.style.display = 'none';
    }
  }

  // ── Auto-advance ──────────────────────────────────
  function startAuto() {
    stopAuto();
    if (slides.length > 1) autoTimer = setInterval(() => goTo(current + 1), AUTO_MS);
  }
  function stopAuto() {
    clearInterval(autoTimer);
  }

  // ── Event listeners ───────────────────────────────
  prevBtn.addEventListener('click', () => { stopAuto(); goTo(current - 1); startAuto(); });
  nextBtn.addEventListener('click', () => { stopAuto(); goTo(current + 1); startAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { stopAuto(); goTo(i); startAuto(); });
  });

  // Pause auto when user hovers over carousel
  carousel.addEventListener('mouseenter', stopAuto);
  carousel.addEventListener('mouseleave', startAuto);

  // Touch swipe support
  let touchStartX = 0;
  carousel.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 40) { stopAuto(); goTo(current + (dx < 0 ? 1 : -1)); startAuto(); }
  }, { passive: true });

  // ── Init ──────────────────────────────────────────
  goTo(0);
  startAuto();

})();
