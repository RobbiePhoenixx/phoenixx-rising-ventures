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
  //  SPOTLIGHT — follows cursor
  // ════════════════════════════════════════════
  if (!isTouch()) {
    const spotlight = document.getElementById('spotlight');
    if (spotlight) {
      document.addEventListener('mousemove', e => {
        spotlight.style.setProperty('--sx', e.clientX + 'px');
        spotlight.style.setProperty('--sy', e.clientY + 'px');
      }, { passive: true });
    }
  }

  // ════════════════════════════════════════════
  //  METEOR SHOWER
  // ════════════════════════════════════════════
  function initMeteors() {
    if (prefersRM()) return;
    const mc  = document.getElementById('meteor-canvas');
    const mctx = mc && mc.getContext('2d');
    if (!mc || !mctx) return;

    function sizeMC() {
      mc.width  = window.innerWidth;
      mc.height = window.innerHeight;
    }
    sizeMC();
    window.addEventListener('resize', sizeMC, { passive: true });

    class Meteor {
      constructor() { this.spawn(); }
      spawn() {
        this.x     = Math.random() * mc.width * 1.5;
        this.y     = -20 - Math.random() * 200;
        this.len   = 80 + Math.random() * 120;
        this.speed = 4 + Math.random() * 6;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
        this.life  = 1;
        this.decay = 0.012 + Math.random() * 0.01;
        this.w     = 1 + Math.random() * 1.5;
        this.active = false;
        this.delay  = Math.random() * 600;
      }
      update() {
        if (this.delay > 0) { this.delay--; return; }
        if (!this.active) this.active = true;
        this.x    += Math.cos(this.angle) * this.speed;
        this.y    += Math.sin(this.angle) * this.speed;
        this.life -= this.decay;
        if (this.life <= 0 || this.y > mc.height + 50) this.spawn();
      }
      draw() {
        if (!this.active || this.life <= 0) return;
        const tx = this.x - Math.cos(this.angle) * this.len;
        const ty = this.y - Math.sin(this.angle) * this.len;
        const g  = mctx.createLinearGradient(tx, ty, this.x, this.y);
        g.addColorStop(0, 'rgba(204,17,0,0)');
        g.addColorStop(0.7, `rgba(255,68,0,${this.life * 0.6})`);
        g.addColorStop(1, `rgba(255,255,255,${this.life * 0.8})`);
        mctx.save();
        mctx.globalAlpha = this.life;
        mctx.strokeStyle = g;
        mctx.lineWidth   = this.w;
        mctx.lineCap     = 'round';
        mctx.beginPath();
        mctx.moveTo(tx, ty);
        mctx.lineTo(this.x, this.y);
        mctx.stroke();
        mctx.restore();
      }
    }

    const meteors = [];
    const METEOR_COUNT = isMobile() ? 4 : 8;
    for (let i = 0; i < METEOR_COUNT; i++) meteors.push(new Meteor());

    function tickMeteors() {
      mctx.clearRect(0, 0, mc.width, mc.height);
      meteors.forEach(m => { m.update(); m.draw(); });
      requestAnimationFrame(tickMeteors);
    }
    tickMeteors();
  }
  initMeteors();

  // ════════════════════════════════════════════
  //  TYPEWRITER — hero description
  // ════════════════════════════════════════════
  function initTypewriter() {
    const el = document.getElementById('hero-desc');
    if (!el || prefersRM()) return;
    const text = el.dataset.typewriter;
    if (!text) return;

    el.innerHTML = '';
    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    el.appendChild(cursor);

    let i = 0;
    const delay = 1400;
    const speed = 28;

    setTimeout(() => {
      const tick = () => {
        if (i < text.length) {
          cursor.insertAdjacentText('beforebegin', text[i++]);
          setTimeout(tick, speed + (Math.random() * 20));
        } else {
          setTimeout(() => cursor.remove(), 1200);
        }
      };
      tick();
    }, delay);
  }
  initTypewriter();

  // ════════════════════════════════════════════
  //  BUTTON RIPPLE
  // ════════════════════════════════════════════
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const rect  = btn.getBoundingClientRect();
      const size  = Math.max(rect.width, rect.height) * 2;
      const x     = e.clientX - rect.left - size / 2;
      const y     = e.clientY - rect.top  - size / 2;
      const rip   = document.createElement('span');
      rip.className = 'ripple';
      rip.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      btn.appendChild(rip);
      rip.addEventListener('animationend', () => rip.remove());
    });
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
