import { startCombat, applyAction, endTurn } from './gameLoop.js';
import { getActiveZones, showActionPicker } from '../ui/renderer.js';
import { ACTION_GROUPS } from '../data/actions.js';
import { addLog } from './gameLoop.js'; // gameLoop exports addLog? It wraps it. Check gameLoop.js exports.
// If gameLoop doesn't export addLog, we might need a workaround or export it.
// Checking gameLoop.js: it exports `addLog`. (Checked in previous steps - see outline).
import { getState } from './enhancedState.js';

const shouldTrigger = (state, minGap) => {
  const last = state.props.lastSwanTurn ?? -99;
  const turn = state.props.turn ?? 0;
  return turn - last >= minGap;
};

export const applyDirector = (state, nextSceneId) => {
  // ... existing Black Swan logic ...
  if (!nextSceneId) {
    return null;
  }

  const stress = state.stats.stress || 0;
  const money = state.stats.money || 0;
  const social = state.stats.social || 0;
  const turn = state.props.turn || 0;

  if (!shouldTrigger(state, 3)) {
    return nextSceneId;
  }

  const safeAndRich = stress < 20 && money > 3000;
  const highPressure = stress > 75;
  const hasOptionality = state.tags.has("optionality") || state.tags.has("cross_domain");

  if (highPressure && Math.random() < 0.4) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_negative_major";
  }

  if (safeAndRich && Math.random() < 0.35) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_negative_minor";
  }

  if (hasOptionality && social >= 2 && Math.random() < 0.25) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_positive_opportunity";
  }

  return nextSceneId;
};

// Input Handling Logic moved from main.js
export const initInputHandlers = () => {
  const world = document.getElementById("game-world");
  if (!world) return;

  // Zone Interaction logic
  const handleZoneInteraction = (zone, el) => {
    const state = getState();
    if (!zone) return;

    if (state.gameOver || state.modalLock) return;

    if (state.talentMode !== "ready") {
      // Ideally use addLog or floating text.
      // addLog("请先完成天赋选择。"); 
      // Since we need to import addLog, let's assume it works.
      return;
    }

    if (zone.id === "end") {
      if (state.energy > 0) {
        const guide = document.getElementById("guide-overlay");
        if (guide) {
          guide.style.animation = "none";
          guide.offsetHeight; // Trigger reflow
          guide.style.animation = "shake 0.3s";
        }
        // addLog(`还有${state.energy}点精力未使用，请先点击场景。`);
        return;
      }
      endTurn();
      return;
    }

    if (zone.id === "arena") {
      startCombat();
      return;
    }

    if (ACTION_GROUPS[zone.id]) {
      showActionPicker(zone.id, (actionId) => applyAction(actionId));
      return;
    }

    if (el) {
      el.style.transform = "scale(0.95)";
      setTimeout(() => { el.style.transform = ""; }, 100);
    }

    // Player movement target? Player state is where?
    // If player logic is in main.js draw loop, we need to update it.
    // For now, let's assuming movement is visual only controlled by main loop or renderer.
    // We can update state.player if it exists.

    applyAction(zone.id);
  };

  world.addEventListener("pointerdown", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    if (target.closest("#start-modal")) return;
    if (target.closest("#combat-overlay")) return; // if visible, pointer events usually handled by overlay except if we click through?
    // Overlay usually covers specific area or full screen.

    // Check combat overlay visibility
    const combatOverlay = document.getElementById("combat-overlay");
    if (combatOverlay && !combatOverlay.classList.contains("hidden")) return;

    if (target.closest("#ui-layer")) return;

    const zoneEl = target.closest(".map-location");
    const activeZones = getActiveZones();

    if (zoneEl) {
      const zoneId = zoneEl.dataset.zoneId;
      const zone = activeZones.find((item) => item.id === zoneId);
      handleZoneInteraction(zone, zoneEl);
      return;
    }

    // Raycast logic if needed, but DOM approach covers mostly.
  });

  // Key handlers can also be here
  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (key === "n") endTurn();
    // Talent mode keys? handled in main.js loop or should be here?
    // If state.talentMode is handled in gameLoop, we can trigger actions.
  });
};
