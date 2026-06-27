// ============================================================
//  PHOENIXX RISING VENTURES — 3D Waving American Flag
//  Canvas-rendered, cloth-physics wave, 50-star canton
//  © 2026 Phoenixx Rising Ventures LLC
// ============================================================
(function () {
  'use strict';

  const FLAG_W = 560;  // offscreen canvas width (pixels)
  const FLAG_H = 295;  // ~1.9:1 US flag ratio

  // ── US Flag Color Palette ──────────────────────────────
  const FLAG_RED   = '#B22234';  // Old Glory Red
  const FLAG_WHITE = '#FFFFFF';
  const FLAG_BLUE  = '#3C3B6E';  // Old Glory Blue

  // ── Build the static flag on an offscreen canvas ───────
  function buildStaticFlag() {
    const oc  = document.createElement('canvas');
    oc.width  = FLAG_W;
    oc.height = FLAG_H;
    const ctx = oc.getContext('2d');

    const stripeH  = FLAG_H / 13;

    // 13 stripes — red on top (even indices = red)
    for (let i = 0; i < 13; i++) {
      ctx.fillStyle = i % 2 === 0 ? FLAG_RED : FLAG_WHITE;
      ctx.fillRect(0, i * stripeH, FLAG_W, stripeH + 0.5);
    }

    // Canton (union) — 40% width, 7 stripes tall
    const cantonW = FLAG_W * 0.40;
    const cantonH = stripeH * 7;
    ctx.fillStyle = FLAG_BLUE;
    ctx.fillRect(0, 0, cantonW, cantonH);

    // 50 stars — 9 rows: alternating 6 and 5 stars
    ctx.fillStyle = FLAG_WHITE;
    const rowCounts  = [6, 5, 6, 5, 6, 5, 6, 5, 6];
    const starRadius = (cantonH / 10) * 0.38;
    const rowSpacing = cantonH / 10;

    rowCounts.forEach((count, row) => {
      const colSpacing = count === 6
        ? cantonW / 7
        : cantonW / 6;
      const startX = count === 6
        ? colSpacing
        : colSpacing * 1.5;

      for (let col = 0; col < count; col++) {
        const sx = startX + col * colSpacing;
        const sy = rowSpacing * (row + 1);
        drawStar(ctx, sx, sy, starRadius);
      }
    });

    return oc;
  }

  // Standard 5-pointed star using alternating outer/inner radii
  function drawStar(ctx, cx, cy, outerR) {
    const innerR = outerR * 0.382;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const angle = (i * Math.PI / 5) - Math.PI / 2;
      const r = i % 2 === 0 ? outerR : innerR;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  // ── Main animation loop ────────────────────────────────
  function initFlag() {
    const display = document.getElementById('flag-canvas');
    if (!display) return;

    // Match canvas pixel size to CSS display size
    const cssW = display.offsetWidth  || FLAG_W;
    const cssH = display.offsetHeight || FLAG_H;
    display.width  = Math.min(FLAG_W, cssW * window.devicePixelRatio);
    display.height = Math.round(display.width / (FLAG_W / FLAG_H));

    const dctx     = display.getContext('2d');
    const staticFlag = buildStaticFlag();

    // Scale from static canvas to display canvas
    const scaleX = display.width  / FLAG_W;
    const scaleY = display.height / FLAG_H;

    let time = 0;

    // Cloth parameters
    const WAVE_FREQ   = 0.045;   // spatial frequency of ripple
    const WAVE_SPEED  = 0.038;   // how fast the wave moves
    const WAVE_AMP    = 22;      // max vertical displacement (pixels at free edge)
    const SHADE_AMP   = 0.28;    // brightness variation for 3D fabric depth

    function render() {
      dctx.clearRect(0, 0, display.width, display.height);

      const dW = display.width;
      const dH = display.height;

      // Draw flag column-by-column with sine-wave vertical displacement
      for (let x = 0; x < dW; x++) {
        const t      = x / dW;                           // 0=pole, 1=free edge
        const amp    = WAVE_AMP * t * t;                 // amplitude grows toward free edge
        const wave   = Math.sin(x * WAVE_FREQ + time) * amp;

        // Shading: brightness oscillates with the wave (lighter on crest, darker in trough)
        const shade  = 1 - SHADE_AMP * t * Math.sin(x * WAVE_FREQ + time);

        // Slight horizontal compression/stretch for perspective feel
        const stretch = 1 - 0.06 * t * Math.cos(x * WAVE_FREQ * 0.5 + time);
        const destH  = dH * stretch;
        const destY  = (dH - destH) / 2 + wave;

        // Source column maps 1:1 across the static flag
        const srcX   = Math.floor((x / dW) * FLAG_W);

        dctx.save();
        if (shade < 1) {
          // Darken or brighten the column slice
          dctx.filter = `brightness(${(shade * 100).toFixed(1)}%)`;
        }
        dctx.drawImage(
          staticFlag,
          srcX, 0, 1, FLAG_H,        // source: 1px wide column
          x,    destY, 1, destH      // dest: warped position
        );
        dctx.restore();
      }

      // Subtle vignette on the free (right) edge for depth
      const vigGrad = dctx.createLinearGradient(dW * 0.75, 0, dW, 0);
      vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
      vigGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
      dctx.fillStyle = vigGrad;
      dctx.fillRect(0, 0, dW, dH);

      time += WAVE_SPEED;
      requestAnimationFrame(render);
    }

    render();
  }

  // Initialise after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFlag);
  } else {
    initFlag();
  }

  // Re-size canvas if window resizes (mobile orientation flip)
  window.addEventListener('resize', () => {
    const display = document.getElementById('flag-canvas');
    if (!display) return;
    const cssW = display.offsetWidth || FLAG_W;
    display.width  = Math.min(FLAG_W, cssW * window.devicePixelRatio);
    display.height = Math.round(display.width / (FLAG_W / FLAG_H));
  }, { passive: true });

})();
