// Reuse the site's orb artwork, keeping a static icon as the fallback.
(() => {
  const icon = document.getElementById('orb-favicon');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!icon) return;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 32;
  const context = canvas.getContext('2d');
  if (!context) return;

  const orb = new Image();
  let timer;
  let frame = 0;
  const frames = [];

  const sync = () => {
    window.clearInterval(timer);
    if (reducedMotion.matches || document.hidden || frames.length === 0) {
      icon.href = '/art/orb-light.png';
      return;
    }
    icon.href = frames[frame];
    timer = window.setInterval(() => {
      frame = (frame + 1) % frames.length;
      icon.href = frames[frame];
    }, 250);
  };

  orb.onload = () => {
    // Pre-render one 24-second revolution; no repeated canvas work.
    for (let i = 0; i < 96; i++) {
      context.clearRect(0, 0, 32, 32);
      context.save();
      context.translate(16, 16);
      context.rotate((i / 96) * Math.PI * 2);
      context.drawImage(orb, -16, -16, 32, 32);
      context.restore();
      frames.push(canvas.toDataURL('image/png'));
    }
    sync();
  };
  document.addEventListener('visibilitychange', sync);
  reducedMotion.addEventListener('change', sync);
  window.addEventListener('pagehide', () => window.clearInterval(timer));
  window.addEventListener('pageshow', sync);
  orb.src = '/art/orb-light.png';
})();
