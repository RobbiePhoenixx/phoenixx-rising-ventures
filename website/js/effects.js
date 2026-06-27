// ============================================================
//  PHOENIXX RISING VENTURES — Visual Effects
//  Particles · Magnetic Buttons · Custom Cursor · Tilt Cards
//  © 2026 Phoenixx Rising Ventures LLC
// ============================================================

(function () {
  'use strict';

  const isMobile  = () => window.matchMedia('(max-width: 768px)').matches;
  const isTouch   = () => window.matchMedia('(pointer: coarse)').matches;
  const prefersRM = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ════════════════════════════════════════════
  //  PARTICLE SYSTEM (canvas fire sparks)
  // ════════════════════════════════════════════
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas && canvas.getContext('2d');

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  const COLORS = ['#FF2200', '#CC1100', '#8B0000', '#FF4400', '#AA0000'];
  const particles = [];
  const MAX_P = isMobile() ? 35 : 70;

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * (canvas ? canvas.width : window.innerWidth);
      this.y    = init ? Math.random() * (canvas ? canvas.height : window.innerHeight) : (canvas ? canvas.height : window.innerHeight) + 10;
      this.vx   = (Math.random() - 0.5) * 0.6;
      this.vy   = -(Math.random() * 1.2 + 0.4);
      this.size = Math.random() * 2.5 + 0.5;
      this.life = 1;
      this.decay = Math.random() * 0.006 + 0.003;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.vy   -= 0.008;
      this.vx   += (Math.random() - 0.5) * 0.05;
      this.life -= this.decay;
      if (this.life <= 0) this.reset();
    }
    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = this.life * 0.6;
      ctx.fillStyle   = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    if (!canvas || prefersRM()) return;
    resizeCanvas();
    for (let i = 0; i < MAX_P; i++) particles.push(new Particle());
    window.addEventListener('resize', resizeCanvas, { passive: true });
    tickParticles();
  }

  function tickParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(tickParticles);
  }

  initParticles();

  // ════════════════════════════════════════════
  //  CUSTOM CURSOR (desktop / pointer: fine)
  // ════════════════════════════════════════════
  if (!isTouch()) {
    const cursor = document.getElementById('cursor');
    const trail  = document.getElementById('cursor-trail');
    let cx = -100, cy = -100, tx = -100, ty = -100;

    document.addEventListener('mousemove', e => {
      cx = e.clientX; cy = e.clientY;
      if (cursor) {
        cursor.style.left = cx + 'px';
        cursor.style.top  = cy + 'px';
      }
    }, { passive: true });

    // Trail follows with lerp
    function moveCursorTrail() {
      tx += (cx - tx) * 0.14;
      ty += (cy - ty) * 0.14;
      if (trail) {
        trail.style.left = tx + 'px';
        trail.style.top  = ty + 'px';
      }
      requestAnimationFrame(moveCursorTrail);
    }
    moveCursorTrail();

    // Hover states
    const hoverEls = 'a, button, [data-magnetic], input, select, textarea, label, .sponsor-card, .media-card';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor?.classList.add('hover');
        trail?.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor?.classList.remove('hover');
        trail?.classList.remove('hover');
      });
    });
  }

  // ════════════════════════════════════════════
  //  MAGNETIC BUTTONS
  // ════════════════════════════════════════════
  function initMagnetic() {
    if (isTouch() || prefersRM()) return;

    document.querySelectorAll('[data-magnetic]').forEach(el => {
      const strength = 0.35;

      el.addEventListener('mousemove', e => {
        const rect  = el.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) * strength;
        const dy    = (e.clientY - cy) * strength;
        el.style.transform = `translate(${dx}px, ${dy}px) scale(1.04)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }

  // ════════════════════════════════════════════
  //  3D CARD TILT
  // ════════════════════════════════════════════
  function initTilt() {
    if (isTouch() || prefersRM()) return;

    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left) / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(700px) rotateY(0deg) rotateX(0deg) translateY(0)';
      });
    });
  }

  // ════════════════════════════════════════════
  //  NAV BURGER
  // ════════════════════════════════════════════
  const burger = document.getElementById('nav-burger');
  const menu   = document.getElementById('mobile-menu');
  const close  = document.getElementById('mobile-menu-close');

  function openMenu() {
    menu?.classList.add('open');
    burger?.setAttribute('aria-expanded', 'true');
    menu?.removeAttribute('aria-hidden');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    menu?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
    menu?.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger?.addEventListener('click', openMenu);
  close?.addEventListener('click', closeMenu);
  menu?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // ════════════════════════════════════════════
  //  NAV SCROLL SHRINK
  // ════════════════════════════════════════════
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // ════════════════════════════════════════════
  //  SCROLL PROGRESS BAR
  // ════════════════════════════════════════════
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (!progressBar) return;
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = total > 0 ? (window.scrollY / total * 100) : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });

  // ════════════════════════════════════════════
  //  CONTACT FORM
  // ════════════════════════════════════════════
  const form = document.getElementById('sponsor-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn  = form.querySelector('[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = 'Message Sent ✦';
    btn.disabled  = true;
    btn.style.opacity = '0.7';
    setTimeout(() => {
      btn.innerHTML = orig;
      btn.disabled  = false;
      btn.style.opacity = '';
      form.reset();
    }, 3500);
  });

  // ════════════════════════════════════════════
  //  INIT ON DOM READY
  // ════════════════════════════════════════════
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { initMagnetic(); initTilt(); });
  } else {
    initMagnetic(); initTilt();
  }

})();
