// ============================================================
//  PHOENIXX RISING VENTURES — Motion Animations (vanilla)
//  Powered by Motion v12 via CDN (same engine as Framer Motion)
//  © 2026 Phoenixx Rising Ventures LLC
// ============================================================

import {
  animate,
  scroll,
  inView,
  stagger,
} from "https://cdn.jsdelivr.net/npm/motion@12/+esm";

const SPRING_SOFT   = { type: "spring", stiffness: 160, damping: 22 };
const SPRING_SNAPPY = { type: "spring", stiffness: 280, damping: 26 };
const SPRING_BOUNCE = { type: "spring", stiffness: 380, damping: 20, mass: 0.7 };
const EASE_OUT      = [0.22, 1, 0.36, 1];

// ════════════════════════════════════════════
//  HERO ENTRANCE  (runs on load)
// ════════════════════════════════════════════
(async () => {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const title   = document.querySelector('.hero-title');
  const desc    = document.querySelector('.hero-desc');
  const actions = document.querySelector('.hero-actions');
  const scroll_ = document.querySelector('.hero-scroll-hint');

  if (eyebrow) await animate(eyebrow, { opacity: [0,1], y: [24,0] }, { delay: 0.3, ...SPRING_SOFT }).finished;

  if (title) {
    animate(title, { opacity: [0,1] }, { duration: 0.01, delay: 0.55 });
    const lines = title.querySelectorAll('.hero-line');
    animate(
      lines,
      { opacity: [0,1], y: [40, 0] },
      { delay: stagger(0.12, { start: 0.55 }), ...SPRING_SOFT }
    );
  }

  await new Promise(r => setTimeout(r, 900));

  if (desc)    animate(desc,    { opacity: [0,1], y: [20,0] }, SPRING_SOFT);
  if (actions) animate(actions, { opacity: [0,1], y: [20,0] }, { ...SPRING_SOFT, delay: 0.1 });

  await new Promise(r => setTimeout(r, 400));
  if (scroll_) animate(scroll_, { opacity: [0,1] }, { duration: 0.8, easing: EASE_OUT });
})();

// ════════════════════════════════════════════
//  STATS — count up + bounce in
// ════════════════════════════════════════════
const statBlocks = document.querySelectorAll('.stat-block');
if (statBlocks.length) {
  statBlocks.forEach(b => { b.style.opacity = '0'; b.style.transform = 'translateY(20px) scale(0.9)'; });

  inView('.stats-ticker', () => {
    animate(
      statBlocks,
      { opacity: [0,1], y: [20,0], scale: [0.9,1] },
      { delay: stagger(0.1), ...SPRING_BOUNCE }
    );

    document.querySelectorAll('.stat-num').forEach(el => {
      const target = parseFloat(el.dataset.target || '0');
      const suffix = el.dataset.suffix || '';
      const t0     = performance.now();
      const dur    = 1800;
      const tick   = now => {
        const p = Math.min((now - t0) / dur, 1);
        const v = (1 - Math.pow(1 - p, 3)) * target;
        el.textContent = Math.floor(v) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }, { amount: 0.5 });
}

// ════════════════════════════════════════════
//  MISSION — split slide-in
// ════════════════════════════════════════════
const missionVisual  = document.querySelector('.mission-visual-col');
const missionContent = document.querySelector('.mission-content-col');

if (missionVisual) {
  missionVisual.style.opacity = '0';
  inView(missionVisual, () => {
    animate(missionVisual, { opacity: [0,1], x: [-60,0] }, SPRING_SOFT);
  }, { amount: 0.3 });
}
if (missionContent) {
  missionContent.style.opacity = '0';
  inView(missionContent, () => {
    animate(missionContent, { opacity: [0,1], x: [60,0] }, { ...SPRING_SOFT, delay: 0.1 });
  }, { amount: 0.2 });
}

const missionItems = document.querySelectorAll('.mission-item');
if (missionItems.length) {
  missionItems.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateX(30px)'; });
  inView('.mission-list', () => {
    animate(
      missionItems,
      { opacity: [0,1], x: [30,0] },
      { delay: stagger(0.13, { start: 0.15 }), ...SPRING_SOFT }
    );
  }, { amount: 0.2 });
}

// ════════════════════════════════════════════
//  TOUR — band name scale, facts bounce
// ════════════════════════════════════════════
const bandName = document.querySelector('.tour-band-name');
if (bandName) {
  bandName.style.opacity = '0';
  inView(bandName, () => {
    animate(bandName, { opacity: [0,1], scale: [0.82,1], y: [30,0] }, SPRING_BOUNCE);
  }, { amount: 0.5 });
}

const tourFacts = document.querySelectorAll('.tour-fact');
if (tourFacts.length) {
  tourFacts.forEach(el => { el.style.opacity = '0'; });
  inView('.tour-facts', () => {
    animate(
      tourFacts,
      { opacity: [0,1], y: [30,0] },
      { delay: stagger(0.15), ...SPRING_SOFT }
    );
  }, { amount: 0.3 });
}

const mediaCards = document.querySelectorAll('.media-card');
if (mediaCards.length) {
  mediaCards.forEach(el => { el.style.opacity = '0'; });
  inView('.media-cards', () => {
    animate(
      mediaCards,
      { opacity: [0,1], y: [40,0] },
      { delay: stagger(0.15), ...SPRING_SOFT }
    );
  }, { amount: 0.2 });
}

// ════════════════════════════════════════════
//  SPONSOR CARDS — stagger scale
// ════════════════════════════════════════════
const sponsorCards = document.querySelectorAll('.sponsor-card');
if (sponsorCards.length) {
  sponsorCards.forEach(el => { el.style.opacity = '0'; el.style.transform = 'translateY(40px) scale(0.94)'; });
  inView('.sponsor-grid', () => {
    animate(
      sponsorCards,
      { opacity: [0,1], y: [40,0], scale: [0.94,1] },
      { delay: stagger(0.1), ...SPRING_BOUNCE }
    );
  }, { amount: 0.1 });
}

// ════════════════════════════════════════════
//  CTA BAND — scale up from void
// ════════════════════════════════════════════
const ctaInner = document.querySelector('.cta-band-inner');
if (ctaInner) {
  ctaInner.style.opacity = '0';
  inView(ctaInner, () => {
    animate(ctaInner, { opacity: [0,1], scale: [0.95,1], y: [30,0] }, SPRING_SOFT);
  }, { amount: 0.4 });
}

// ════════════════════════════════════════════
//  CONTACT — split entrance
// ════════════════════════════════════════════
const contactInfo = document.querySelector('.contact-info-col');
const contactForm = document.querySelector('.contact-form-col');

if (contactInfo) {
  contactInfo.style.opacity = '0';
  inView(contactInfo, () => {
    animate(contactInfo, { opacity: [0,1], x: [-50,0] }, SPRING_SOFT);
  }, { amount: 0.3 });
}
if (contactForm) {
  contactForm.style.opacity = '0';
  inView(contactForm, () => {
    animate(contactForm, { opacity: [0,1], x: [50,0] }, { ...SPRING_SOFT, delay: 0.12 });
  }, { amount: 0.25 });
}

// ════════════════════════════════════════════
//  SECTION LABELS + TITLES + GOLD RULES
// ════════════════════════════════════════════
document.querySelectorAll('.section-label, .section-title, .gold-rule, .tour-tagline').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  inView(el, () => {
    animate(el, { opacity: [0,1], y: [18,0] }, { duration: 0.65, easing: EASE_OUT });
  }, { amount: 0.6 });
});

// ════════════════════════════════════════════
//  FOOTER COLUMNS — stagger up
// ════════════════════════════════════════════
const footerCols = document.querySelectorAll('.footer-top > *');
if (footerCols.length) {
  footerCols.forEach(el => { el.style.opacity = '0'; });
  inView('.footer-top', () => {
    animate(
      footerCols,
      { opacity: [0,1], y: [20,0] },
      { delay: stagger(0.08), ...SPRING_SOFT }
    );
  }, { amount: 0.3 });
}

// ════════════════════════════════════════════
//  PARALLAX — hero bg (Motion scroll driver)
// ════════════════════════════════════════════
const heroBg = document.querySelector('.hero-photo');
if (heroBg) {
  scroll(
    animate(heroBg, { y: [0, 80] }, { easing: 'linear' }),
    { target: document.querySelector('.hero'), offset: ['start start', 'end start'] }
  );
}

// Hero orbs parallax
const orb1 = document.querySelector('.hero-orb-1');
const orb2 = document.querySelector('.hero-orb-2');
if (orb1) {
  scroll(
    animate(orb1, { y: [0, 120], x: [0, -30] }, { easing: 'linear' }),
    { target: document.querySelector('.hero'), offset: ['start start', 'end start'] }
  );
}
if (orb2) {
  scroll(
    animate(orb2, { y: [0, 60], x: [0, 20] }, { easing: 'linear' }),
    { target: document.querySelector('.hero'), offset: ['start start', 'end start'] }
  );
}

// ════════════════════════════════════════════
//  BUTTON PRESS SPRING
// ════════════════════════════════════════════
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousedown', () =>
    animate(btn, { scale: 0.94 }, { duration: 0.1, ...SPRING_SNAPPY })
  );
  btn.addEventListener('mouseup', () =>
    animate(btn, { scale: 1 }, { duration: 0.3, ...SPRING_BOUNCE })
  );
  btn.addEventListener('mouseleave', () =>
    animate(btn, { scale: 1 }, { duration: 0.2, ...SPRING_SNAPPY })
  );
  // Touch support
  btn.addEventListener('touchstart', () =>
    animate(btn, { scale: 0.96 }, { duration: 0.08, ...SPRING_SNAPPY }), { passive: true }
  );
  btn.addEventListener('touchend', () =>
    animate(btn, { scale: 1 }, { duration: 0.25, ...SPRING_BOUNCE }), { passive: true }
  );
});

// ════════════════════════════════════════════
//  QUOTE CARD — flip in
// ════════════════════════════════════════════
const quoteCard = document.querySelector('.mission-quote-card');
if (quoteCard) {
  quoteCard.style.opacity = '0';
  inView(quoteCard, () => {
    animate(quoteCard, { opacity: [0,1], x: [-30,0] }, { ...SPRING_SOFT, delay: 0.3 });
  }, { amount: 0.6 });
}
