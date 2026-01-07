export const initAtmosphere = (getState) => {
  const canvas = document.getElementById("atmosphere");
  if (!canvas) {
    return;
  }
  const ctx = canvas.getContext("2d");
  const particles = Array.from({ length: 60 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.6 + Math.random() * 1.4,
    speed: 0.04 + Math.random() * 0.08
  }));
  const drops = Array.from({ length: 80 }, () => ({
    x: Math.random(),
    y: Math.random(),
    l: 6 + Math.random() * 10,
    speed: 0.7 + Math.random() * 1.2
  }));

  const resize = () => {
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.floor(window.innerWidth * ratio);
    canvas.height = Math.floor(window.innerHeight * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  };

  resize();
  window.addEventListener("resize", resize);

  const drawGlow = (color) => {
    const w = canvas.width;
    const h = canvas.height;
    const grad = ctx.createRadialGradient(w * 0.5, h * 0.5, 80, w * 0.5, h * 0.5, Math.max(w, h));
    grad.addColorStop(0, color);
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  };

  const step = () => {
    const state = getState();
    const mood = state.stats?.mood || 0;
    const health = state.stats?.health || 0;
    const stress = state.stats?.stress || 0;
    const energy = state.energy || 0;

    const warm = mood >= 8 && stress <= 6;
    const cold = stress >= 12 || mood <= 4 || health <= 5;
    const flow = mood >= 10 && health >= 10 && energy >= 3;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (warm) {
      ctx.globalAlpha = 0.35;
      ctx.fillStyle = "rgba(255, 190, 120, 0.25)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      particles.forEach((p) => {
        p.y -= p.speed * 0.002;
        if (p.y < 0) p.y = 1;
        const x = p.x * window.innerWidth;
        const y = p.y * window.innerHeight;
        ctx.fillStyle = "rgba(255, 240, 200, 0.6)";
        ctx.beginPath();
        ctx.arc(x, y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    if (cold) {
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "rgba(40, 60, 90, 0.35)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(180, 210, 255, 0.35)";
      ctx.lineWidth = 1;
      drops.forEach((d) => {
        d.y += d.speed * 0.01;
        if (d.y > 1) d.y = 0;
        const x = d.x * window.innerWidth;
        const y = d.y * window.innerHeight;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 6, y + d.l);
        ctx.stroke();
      });
    }

    if (flow) {
      ctx.globalAlpha = 0.8;
      drawGlow("rgba(34, 211, 238, 0.2)");
      ctx.globalAlpha = 1;
    }

    requestAnimationFrame(step);
  };

  requestAnimationFrame(step);
};
