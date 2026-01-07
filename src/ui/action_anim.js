export const playActionAnim = (type, title, onComplete) => {
    const ICONS = {
        study: "assets/action_study.png",
        exercise: "assets/action_exercise.png",
        rest: "assets/action_rest.png",
        work: "assets/action_study.png", // Fallback
        social: "assets/action_study.png", // Fallback
        create: "assets/action_study.png", // Fallback
        default: "assets/action_study.png"
    };

    const overlay = document.createElement("div");
    overlay.className = "action-anim-overlay";

    const iconSrc = ICONS[type] || ICONS.default;

    overlay.innerHTML = `
    <div class="action-anim-content">
      <img src="${iconSrc}" class="action-anim-img" />
      <div class="action-anim-title">${title}</div>
      <div class="action-anim-bar"><div class="action-anim-bar-fill"></div></div>
    </div>
  `;

    document.body.appendChild(overlay);

    // Animation timing
    requestAnimationFrame(() => {
        overlay.classList.add("show");
    });

    setTimeout(() => {
        overlay.classList.remove("show");
        setTimeout(() => {
            overlay.remove();
            if (onComplete) onComplete();
        }, 300); // fade out time
    }, 1200); // display time
};
