let fxLayer = null;

export const initUiFx = () => {
  fxLayer = document.getElementById("fx-layer");
};

export const spawnRipple = (x, y) => {
  if (!fxLayer) {
    return;
  }
  const ripple = document.createElement("div");
  ripple.className = "click-ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  fxLayer.appendChild(ripple);
  window.setTimeout(() => ripple.remove(), 900);
};

export const enableGlobalRipples = () => {
  document.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (target.closest(".overlay") || target.closest("#ui-layer")) {
      return;
    }
    spawnRipple(event.clientX, event.clientY);
  });
};

export const spawnFloatingText = (text, x, y, tone = "positive") => {
  if (!fxLayer) {
    return;
  }
  const item = document.createElement("div");
  item.className = `float-text ${tone}`;
  item.textContent = text;
  item.style.left = `${x}px`;
  item.style.top = `${y}px`;
  fxLayer.appendChild(item);
  window.setTimeout(() => item.remove(), 1100);
};

export const updateRollingNumber = (el, value) => {
  if (!el) {
    return;
  }
  const target = Number(value);
  const current = Number(el.dataset.rollValue ?? el.textContent ?? 0);
  if (Number.isNaN(target) || Number.isNaN(current) || target === current) {
    return;
  }
  const start = performance.now();
  const duration = 320;
  const from = current;
  const tick = (time) => {
    const t = Math.min(1, (time - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    const next = Math.round(from + (target - from) * eased);
    el.textContent = next;
    el.dataset.rollValue = String(next);
    if (t < 1) {
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
};
