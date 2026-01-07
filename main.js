const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const celebrationEl = document.getElementById("celebration");

import { createCombatState, executeAttack, executeDefend, executeEscape, executeSkill, executeEnemyTurn, applyRewards } from "./src/core/combat.js";
import { getRandomEnemy } from "./src/data/enemies.js";
import { getAvailableSkills, getSkillById } from "./src/data/combat_skills.js";
import { updateCombatUI, showSkillSelect } from "./src/ui/combatUI.js";
import { initAtmosphere } from "./src/ui/atmosphere.js";
import { playActionAnim } from "./src/ui/action_anim.js";
import { initUiFx, enableGlobalRipples, spawnFloatingText, updateRollingNumber } from "./src/ui/ui_manager.js";
import { getState, patchState, getStateRef } from "./src/core/enhancedState.js";
import { updateEconomy, getWorkMultiplier, getEconomyLabel } from "./src/core/economy.js";
import { resolveStress } from "./src/core/events.js";
import { DILEMMAS } from "./src/data/dilemmas.js";
import { NPCS } from "./src/data/npcs.js";
import { VENTURES } from "./src/data/ventures.js";
import { TALENTS } from "./src/data/talents.js";
import { SKILL_TREE } from "./src/data/skill_tree.js";
import { ACTIONS, ACTION_GROUPS } from "./src/data/actions.js";
import { MAIN_QUESTS, SIDE_QUESTS, STORY_CHAINS } from "./src/data/quests.js";
import { CHAPTERS, STAGE_PROMPTS } from "./src/data/stages.js";
import { ACHIEVEMENTS, BLACK_SWAN_EVENTS } from "./src/data/events.js";
import { calculateActualEffects } from "./src/systems/cognitive.js";
import { initRenderer, renderGame, updateUI, showActionPicker, initZones } from "./src/ui/renderer.js";
import { applyAction, endTurn, handleCombatAction } from "./src/core/gameLoop.js";
import { initInputHandlers } from "./src/core/director.js";
import { syncStartModal } from "./src/ui/syncStartModal.js";

const state = getStateRef();
















const TOTAL_TURNS = CHAPTERS.reduce((sum, chapter) => sum + chapter.turns, 0);







const player = {
  x: 160,
  y: 160,
  size: 18,
  speed: 160
};

// Map Locations: Centered Layout
const startX = (window.innerWidth - 800) / 2;
const startY = 140; // Shift down to avoid HUD overlap

const zones = [
  { id: "study", name: "学习区", x: startX + 50, y: startY, w: 120, h: 140, img: "assets/loc_study.png" },
  { id: "exercise", name: "运动区", x: startX + 250, y: startY - 20, w: 120, h: 140, img: "assets/loc_exercise.png" },
  { id: "social", name: "社交区", x: startX + 450, y: startY + 10, w: 120, h: 140, img: "assets/loc_social.png" },

  { id: "work", name: "工作区", x: startX + 80, y: startY + 200, w: 120, h: 140, img: "assets/loc_work.png" },
  { id: "create", name: "创作区", x: startX + 280, y: startY + 220, w: 120, h: 140, img: "assets/loc_create.png" },
  { id: "rest", name: "休息区", x: startX + 480, y: startY + 190, w: 120, h: 140, img: "assets/loc_rest.png" },

  { id: "arena", name: "挑战场", x: startX + 650, y: startY + 100, w: 140, h: 160, img: "assets/loc_arena.png" },

  // End Turn Button - Moved to bottom right
  { id: "end", name: "结束回合", x: startX + 700, y: startY + 320, w: 120, h: 60, color: "#fbbf24" }
];

let activeZones = zones;

const input = new Set();
const uiButtons = []; // Legacy array, kept empty now

const addButton = (x, y, w, h, handler) => {
  uiButtons.push({ x, y, w, h, handler });
};

const resize = () => {
  const ratio = window.devicePixelRatio || 1;
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
};

const pushStory = (text) => {
  if (!text) {
    return;
  }
  state.storyQueue.push(text);
};

const addLog = (text) => {
  state.log.unshift(text);
  if (state.log.length > 8) {
    state.log.pop();
  }
};

const REWARD_LABELS = {
  skillPoints: "技能点",
  talentPoints: "天赋点",
  money: "金钱",
  health: "健康",
  mood: "情绪",
  knowledge: "知识",
  skill: "技能",
  creativity: "创意",
  social: "社交"
};

const getRewardEntries = (rewards) => {
  if (!rewards) {
    return [];
  }
  return Object.entries(rewards)
    .filter(([, value]) => value !== 0 && value !== null && value !== undefined)
    .map(([key, value]) => ({
      key,
      value,
      label: REWARD_LABELS[key] || key
    }));
};

const showRewardFly = (rewards) => {
  const entries = getRewardEntries(rewards);
  if (!entries.length) {
    return;
  }
  let container = document.getElementById("reward-fly");
  if (!container) {
    container = document.createElement("div");
    container.id = "reward-fly";
    container.className = "reward-fly-container";
    document.body.appendChild(container);
  }
  entries.forEach((entry, index) => {
    const item = document.createElement("div");
    item.className = "reward-fly";
    const sign = entry.value > 0 ? "+" : "";
    item.textContent = `${sign}${entry.value} ${entry.label}`;
    item.style.top = `${42 + index * 6}%`;
    container.appendChild(item);
    window.setTimeout(() => item.remove(), 1300);
  });
};

const flashHUD = () => {
  const targets = [
    document.getElementById("hud-top"),
    document.getElementById("hud-quests"),
    document.getElementById("hud-skills")
  ];
  targets.forEach((el) => {
    if (!el) {
      return;
    }
    el.classList.remove("hud-flash");
    el.offsetHeight;
    el.classList.add("hud-flash");
  });
};

const showCelebration = (title, subtitle, rewards) => {
  if (!celebrationEl) {
    return;
  }
  const rewardEntries = getRewardEntries(rewards);
  const rewardHTML = rewardEntries.length
    ? `<div class="celebration__rewards">${rewardEntries.map((entry) => {
      const sign = entry.value > 0 ? "+" : "";
      return `<div class="celebration__reward">${sign}${entry.value} ${entry.label}</div>`;
    }).join("")}</div>`
    : "";
  celebrationEl.innerHTML = `
    <div class="celebration__card">
      <div>${title}</div>
      <div class="celebration__spark">${subtitle || ""}</div>
      ${rewardHTML}
    </div>
  `;
  celebrationEl.classList.add("celebration--show");
  window.clearTimeout(showCelebration._timer);
  showCelebration._timer = window.setTimeout(() => {
    celebrationEl.classList.remove("celebration--show");
    window.clearTimeout(showCelebration._clearTimer);
    showCelebration._clearTimer = window.setTimeout(() => {
      celebrationEl.innerHTML = "";
    }, 350);
  }, 1200);

  if (rewardEntries.length) {
    showRewardFly(rewards);
    flashHUD();
  }
};

const unlockAchievement_premium = (achievement) => {
  let overlay = document.getElementById("achievement-overlay");
  if (!overlay) {
    overlay = document.createElement("div");
    overlay.id = "achievement-overlay";
    document.body.appendChild(overlay);
  }

  const perkHTML = achievement.perk
    ? `<div style="margin-top:20px; padding:12px; background:rgba(255,255,255,0.1); border-radius:8px; border:1px dashed var(--accent-cyan); display:inline-block;">
         <div style="font-size:12px; color:var(--accent-cyan); text-transform:uppercase; letter-spacing:1px; margin-bottom:4px;">✨ 天赋觉醒 ✨</div>
         <div style="font-weight:700; font-size:18px; color:#fff;">⚡ ${achievement.perk.name}</div>
         <div style="font-size:13px; color:#ccc; margin-top:4px;">${achievement.perk.effect}</div>
       </div>`
    : "";

  overlay.innerHTML = `
        <div class="achievement-popup">
             <div class="achievement-icon">🏆</div>
             <div class="achievement-label">成就達成 / MILESTONE</div>
             <div class="achievement-name">${achievement.name}</div>
             <div class="achievement-desc-lg">${achievement.desc}</div>
             ${perkHTML}
        </div>
    `;

  // Force reflow
  overlay.offsetHeight;
  overlay.classList.add("show");

  // Auto hide
  setTimeout(() => {
    overlay.classList.remove("show");
  }, 4500);
};

const unlockAchievement = (achievementId) => {
  if (state.achievements[achievementId]) {
    return;
  }
  const achievement = ACHIEVEMENTS.find((item) => item.id === achievementId);
  if (!achievement) {
    return;
  }
  state.achievements[achievementId] = true;
  state.title = achievement.title;

  // Apply Perk
  if (achievement.perk) {
    if (!state.perks) state.perks = [];
    if (!state.perks.includes(achievement.perk.id)) {
      state.perks.push(achievement.perk.id);
      // Immediate effects?
      if (achievement.perk.id === "vitality_plus") {
        const oldMax = state.energyMax || 6;
        state.energyMax = oldMax + 1;
        state.energy += 1; // fill the new slot
        addLog(`[Perk] 精力上限提升至 ${state.energyMax}`);
      }
    }
  }

  addLog(`成就达成：${achievement.name}`);

  // Use Premium Unlock
  unlockAchievement_premium(achievement);

  updateAchievementsUI();
};

const updateAchievementsUI = () => {
  const listEl = document.getElementById("achievements-list");
  if (!listEl) {
    return;
  }
  listEl.innerHTML = ACHIEVEMENTS.map((achievement) => {
    const unlocked = Boolean(state.achievements[achievement.id]);
    return `
      <div class="achievement-card ${unlocked ? "" : "locked"}">
        <div class="achievement-title">${achievement.name}${unlocked ? " · 已获得" : ""}</div>
        <div class="achievement-desc">${achievement.desc}</div>
        <div class="achievement-desc">称号：${achievement.title}</div>
      </div>
    `;
  }).join("");
};

const getRewardListHTML = (rewards) => {
  const entries = getRewardEntries(rewards);
  if (!entries.length) {
    return "";
  }
  return `
    <div class="celebration__rewards">
      ${entries.map((entry) => {
    const sign = entry.value > 0 ? "+" : "";
    return `<div class="celebration__reward">${sign}${entry.value} ${entry.label}</div>`;
  }).join("")}
    </div>
  `;
};

const showInteractiveModal = ({ title, bodyLines, rewards, primaryLabel = "继续", choices = null, onChoice = null }) => {
  const existing = document.getElementById("interactive-modal");
  if (existing) {
    existing.remove();
  }
  state.modalLock = true;
  const overlay = document.createElement("div");
  overlay.id = "interactive-modal";
  overlay.className = "overlay";
  const bodyHTML = (Array.isArray(bodyLines) ? bodyLines : [bodyLines])
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");

  let actionsHTML = "";
  if (choices && Array.isArray(choices) && choices.length > 0) {
    actionsHTML = `<div class="modal-choices" style="display:flex; flex-direction:column; gap:10px; width:100%;">
        ${choices.map(c => `<button class="diff-btn" data-id="${c.id}" style="${c.style || ''}">${c.label}</button>`).join('')}
     </div>`;
  } else {
    actionsHTML = `<button id="interactive-close" class="btn-danger">${primaryLabel}</button>`;
  }

  overlay.innerHTML = `
    <div class="glass-panel action-picker-panel">
      <div class="action-picker-title">${title}</div>
      <div class="modal-body">${bodyHTML}${getRewardListHTML(rewards)}</div>
      <div class="modal-actions" style="width:100%;">
        ${actionsHTML}
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  if (choices && onChoice) {
    const btns = overlay.querySelectorAll('.diff-btn');
    btns.forEach(btn => {
      attachTapAction(btn, () => {
        overlay.remove();
        state.modalLock = false;
        onChoice(btn.dataset.id);
      });
    });
  } else {
    const closeBtn = document.getElementById("interactive-close");
    if (closeBtn) {
      attachTapAction(closeBtn, () => {
        overlay.remove();
        state.modalLock = false;
      });
    }
  }
};

const triggerGameOver = () => {
  if (state.gameOver) {
    return;
  }
  state.gameOver = true;
  const existing = document.getElementById("game-over-modal");
  if (existing) {
    return;
  }
  const overlay = document.createElement("div");
  overlay.id = "game-over-modal";
  overlay.className = "overlay";
  overlay.innerHTML = `
    <div class="glass-panel action-picker-panel">
      <div class="action-picker-title">压力崩溃</div>
      <p class="action-picker-subtitle">你在高压下失去了节奏，需要停下来重新调整。</p>
      <div style="margin-top:16px">
        <button id="btn-restart" class="btn-danger">重新开始</button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  const restartBtn = document.getElementById("btn-restart");
  if (restartBtn) {
    attachTapAction(restartBtn, () => {
      window.location.reload();
    });
  }
};

const initChapter = () => {
  const chapter = CHAPTERS[state.chapterIndex];
  state.chapterTurn = 1;
  state.energy = state.energyMax;
  state.actionCounts = {};
  const main = MAIN_QUESTS[chapter.id];
  const sidePool = SIDE_QUESTS[chapter.id] || [];
  state.quests.main = main ? { ...main, done: false } : null;
  state.quests.side = sidePool.sort(() => Math.random() - 0.5).slice(0, 2);
  state.quests.completed = [];
  const chain = STORY_CHAINS[chapter.id];
  state.chain = chain
    ? { title: chain.title, index: 0, steps: chain.steps.map((step) => ({ ...step })) }
    : { title: null, index: 0, steps: [] };
  addLog(`进入${chapter.name}。`);
  pushStory(`${chapter.name}开启：${MAIN_QUESTS[chapter.id]?.desc || ""}`.trim());
  initZones();
};

const randomTalents = () => {
  TALENTS.forEach((talent) => {
    state.talents[talent.id] = Math.floor(Math.random() * 3);
  });
  state.talentMode = "ready";
  addLog("天赋随机生成。");
  initChapter();
};

const applyTalentDraft = () => {
  state.talents = { ...state.talentDraft };
  state.talentMode = "ready";
  addLog("天赋已分配。");
  initChapter();
};

const getActionGroupId = (actionId) => actionId.split("_")[0];

const getTalentBonus = (actionId) => {
  const groupId = getActionGroupId(actionId);
  const { rational, empathic, grit } = state.talents;
  if (groupId === "study") {
    return 1 + rational * 0.08;
  }
  if (groupId === "social" || groupId === "create") {
    return 1 + empathic * 0.08;
  }
  if (groupId === "exercise" || groupId === "rest") {
    return 1 + grit * 0.08;
  }
  return 1;
};

const getSkillLevel = (id) => state.skills[id] || 0;

const getSkillBonus = (actionId) => {
  const groupId = getActionGroupId(actionId);
  const bonuses = {
    study: getSkillLevel("logic") * 0.05 + getSkillLevel("foundation") * 0.04,
    work: getSkillLevel("execution") * 0.06 + getSkillLevel("insight") * 0.04,
    social: getSkillLevel("communication") * 0.05 + getSkillLevel("trust") * 0.04,
    create: getSkillLevel("story") * 0.05 + getSkillLevel("aesthetic") * 0.04,
    exercise: getSkillLevel("fitness") * 0.05 + getSkillLevel("habit") * 0.04,
    rest: getSkillLevel("stress") * 0.05
  };
  return 1 + (bonuses[groupId] || 0);
};

const getStatusMeta = () => {
  const mood = state.stats.mood || 0;
  const health = state.stats.health || 0;
  const moodMeta = mood <= 4
    ? { label: "紧绷", color: "#f97316" }
    : mood <= 8
      ? { label: "平稳", color: "#22d3ee" }
      : { label: "高涨", color: "#fbbf24" };

  const healthMeta = health <= 5
    ? { label: "虚弱", color: "#ef4444" }
    : health <= 10
      ? { label: "稳健", color: "#22c55e" }
      : { label: "强盛", color: "#60a5fa" };

  let overall = "稳定";
  let glow = "#22d3ee";
  if (mood <= 4 || health <= 5) {
    overall = "失衡";
    glow = "#f97316";
  } else if (mood >= 9 && health >= 11) {
    overall = "爆发";
    glow = "#fbbf24";
  } else if (mood >= 9 || health >= 11) {
    overall = "上扬";
    glow = "#38bdf8";
  }

  return {
    overall,
    moodLabel: moodMeta.label,
    healthLabel: healthMeta.label,
    glow,
    ring: healthMeta.color
  };
};

const STUDY_MILESTONES = [
  { count: 0, label: "起步" },
  { count: 3, label: "基础打牢" },
  { count: 6, label: "方法成形" },
  { count: 10, label: "体系化" },
  { count: 15, label: "游刃有余" }
];

const getStudyProgress = () => {
  const count = state.actionCounts.study || 0;
  let current = STUDY_MILESTONES[0];
  let next = STUDY_MILESTONES[STUDY_MILESTONES.length - 1];
  STUDY_MILESTONES.forEach((item) => {
    if (count >= item.count) {
      current = item;
    }
  });
  const currentIndex = STUDY_MILESTONES.indexOf(current);
  if (currentIndex < STUDY_MILESTONES.length - 1) {
    next = STUDY_MILESTONES[currentIndex + 1];
  }
  const span = Math.max(1, next.count - current.count);
  const progress = Math.min(1, (count - current.count) / span);
  return {
    count,
    label: current.label,
    nextLabel: next.label,
    progress
  };
};

const evaluateQuest = (quest) => {
  if (!quest) {
    return true;
  }
  return quest.objectives.every((objective) => {
    if (objective.type === "stat") {
      return (state.stats[objective.key] || 0) >= objective.target;
    }
    if (objective.type === "action") {
      return (state.actionCounts[objective.key] || 0) >= objective.target;
    }
    return false;
  });
};

const applyQuestRewards = (quest) => {
  if (!quest || !quest.rewards) {
    return;
  }
  const rewards = quest.rewards;
  Object.entries(rewards).forEach(([key, value]) => {
    if (key === "skillPoints") {
      state.skillPoints += value;
      return;
    }
    if (key === "talentPoints") {
      state.talentPoints += value;
      return;
    }
    state.stats[key] = (state.stats[key] || 0) + value;
  });
};

const evaluateChainStep = () => {
  if (!state.chain.steps.length) {
    return;
  }
  const step = state.chain.steps[state.chain.index];
  if (!step) {
    return;
  }
  const done = step.objectives.every((objective) => {
    if (objective.type === "stat") {
      return (state.stats[objective.key] || 0) >= objective.target;
    }
    if (objective.type === "action") {
      return (state.actionCounts[objective.key] || 0) >= objective.target;
    }
    return false;
  });
  if (!done) {
    return;
  }
  applyQuestRewards({ rewards: step.reward });
  addLog(`剧情推进：${step.text}`);
  pushStory(step.text);
  showCelebration("剧情推进", step.text, step.reward);
  state.questCounts.chain += 1;
  if (state.questCounts.chain >= 1) {
    unlockAchievement("chain_first");
  }
  state.chain.index += 1;
};

const evaluateQuests = () => {
  if (state.quests.main && !state.quests.main.done && evaluateQuest(state.quests.main)) {
    state.quests.main.done = true;
    applyQuestRewards(state.quests.main);
    addLog(`主线完成：${state.quests.main.title}`);
    pushStory(`主线完成：${state.quests.main.title}`);
    showCelebration("主线完成", state.quests.main.title, state.quests.main.rewards);
    state.questCounts.main += 1;
    if (state.questCounts.main >= 1) {
      unlockAchievement("main_first");
    }
    if (state.questCounts.main >= 3) {
      unlockAchievement("main_three");
    }
  }
  state.quests.side.forEach((quest) => {
    if (!quest.done && evaluateQuest(quest)) {
      quest.done = true;
      applyQuestRewards(quest);
      addLog(`支线完成：${quest.title}`);
      pushStory(`支线完成：${quest.title}`);
      showCelebration("支线完成", quest.title, quest.rewards);
      state.questCounts.side += 1;
      if (state.questCounts.side >= 1) {
        unlockAchievement("side_first");
      }
    }
  });
  evaluateChainStep();
};

const applyRewardDelta = (rewards) => {
  if (!rewards) {
    return;
  }
  Object.entries(rewards).forEach(([key, value]) => {
    if (key === "skillPoints") {
      state.skillPoints += value;
      return;
    }
    if (key === "talentPoints") {
      state.talentPoints += value;
      return;
    }
    state.stats[key] = Math.max(0, (state.stats[key] || 0) + value);
  });
};

const maybeTriggerDilemma = () => {
  // 基础概率 20%
  if (Math.random() > 0.2) return false;

  // Pick random
  const dilemma = DILEMMAS[Math.floor(Math.random() * DILEMMAS.length)];
  if (!dilemma) return false;

  const choices = dilemma.options.map((opt) => ({
    id: opt.id,
    label: `${opt.text} <br><span style="font-size:11px;opacity:0.7">${opt.desc}</span>`,
    style: "width:100%; text-align:left; padding:12px; line-height:1.4;"
  }));

  showInteractiveModal({
    title: dilemma.title,
    bodyLines: [dilemma.text, "做出你的选择："],
    choices: choices,
    onChoice: (choiceId) => {
      const option = dilemma.options.find((o) => o.id === choiceId);
      if (!option) return;

      // Immediate
      if (option.immediate) {
        applyRewardDelta(option.immediate);
        showRewardFly(option.immediate);
      }

      // Risk
      let riskResult = "";
      if (option.risk && Math.random() < option.risk.chance) {
        applyRewardDelta(option.risk.effect);
        riskResult = `意外后果：${option.risk.effectText}`;
        showRewardFly(option.risk.effect);
      }

      // Delayed / Karma
      if (option.delayed && state.karma) {
        state.karma.log.push({ turn: state.turn, text: option.delayed.text });
        if (option.delayed.type === "karma") {
          const mag = option.delayed.magnitude || 1;
          if (option.delayed.value === "good_will") state.karma.good += mag;
          else state.karma.evil += mag;
        }
      }

      // Show result feedback
      const resultText = riskResult || "你做出了选择，但这只是开始。";
      addLog(`[道德抉择] ${dilemma.title} - ${resultText}`);

      // Small feedback toast
      if (riskResult) {
        showCelebration("意外发生", riskResult);
      }
    }
  });
  return true;
};

const maybeTriggerBlackSwan = () => {
  const minGap = 3;
  if (state.turn - state.lastSwanTurn < minGap) {
    return false;
  }

  const chapterId = CHAPTERS[state.chapterIndex]?.id || "career";
  const stageEvents = BLACK_SWAN_EVENTS[chapterId] || BLACK_SWAN_EVENTS.career;
  const mood = state.stats.mood || 0;
  const health = state.stats.health || 0;
  const money = state.stats.money || 0;
  const social = state.stats.social || 0;
  const knowledge = state.stats.knowledge || 0;
  const skill = state.stats.skill || 0;
  const creativity = state.stats.creativity || 0;
  const stress = state.stats.stress || 0;

  const highPressure = mood <= 4 || health <= 5 || stress >= 10;
  const resourceful = money >= 10;
  const optionality = social >= 10 || knowledge >= 10 || skill >= 10 || creativity >= 10 || state.entropyPool >= 4;

  let chance = 0.18;
  if (highPressure) chance += 0.1;
  if (stress >= 15) chance += 0.08;
  if (resourceful) chance += 0.05;
  if (state.turn >= 6) chance += 0.05;
  if (state.entropyPool >= 6) chance += 0.05;
  chance = Math.min(0.45, chance);

  if (Math.random() > chance) {
    return false;
  }

  const economyPhase = state.economy?.phase || "steady";
  const economySensitive = ["college", "career", "midlife", "late"].includes(chapterId);
  let positiveBias = 0;
  let negativeBias = 0;
  if (economySensitive && economyPhase === "boom") {
    positiveBias = 0.15;
    negativeBias = -0.05;
  } else if (economySensitive && economyPhase === "bust") {
    positiveBias = -0.1;
    negativeBias = 0.2;
  } else if (economySensitive && economyPhase === "recovery") {
    positiveBias = 0.08;
    negativeBias = 0.02;
  }

  let event = stageEvents[1];
  if (optionality && Math.random() < 0.35 + positiveBias) {
    event = stageEvents[2];
  } else if (highPressure && Math.random() < 0.55 + negativeBias) {
    event = stageEvents[0];
  }

  const eventRewards = { ...(event.rewards || {}) };
  if (economySensitive && eventRewards.money) {
    if (economyPhase === "boom") {
      eventRewards.money += eventRewards.money > 0 ? 2 : -1;
    } else if (economyPhase === "bust") {
      eventRewards.money += eventRewards.money > 0 ? -1 : -2;
    } else if (economyPhase === "recovery") {
      eventRewards.money += eventRewards.money > 0 ? 1 : 0;
    }
  }

  state.lastSwanTurn = state.turn;
  applyRewardDelta(eventRewards);
  addLog(`黑天鹅事件：${event.text}`);
  pushStory(event.text);
  showInteractiveModal({
    title: event.title,
    bodyLines: [
      event.text,
      economySensitive ? `当前经济周期：${getEconomyLabel(state)}。` : "当前阶段黑天鹅以生活事件为主。",
    ],
    rewards: eventRewards,
    primaryLabel: "接受影响"
  });
  return true;
};

const allocateSkill = (skillId, max) => {
  if (state.skillPoints <= 0) {
    return;
  }
  const current = getSkillLevel(skillId);
  if (current >= max) {
    return;
  }
  state.skills[skillId] = current + 1;
  state.skillPoints -= 1;
  addLog(`技能提升：${skillId} +1`);
};

// Input helpers removed

// UI helpers removed

// Legacy game logic (showActionPicker, handleInteract, updateStory) removed - migrated to other modules

/**
 * UI 更新逻辑 (DOM)
 */
// functions moved to renderer.js
// --- 游戏循环 ---

const update = (dt) => {
  if (state.gameOver) return;

  // 1. Story Timer
  if (state.storyText) {
    state.storyTimer -= dt;
    if (state.storyTimer <= 0) {
      if (state.storyQueue.length > 0) {
        state.storyText = state.storyQueue.shift();
        state.storyTimer = 3.0; // Show next
      } else {
        state.storyText = "";
      }
    }
  }

  // 2. Continuous effects or transitions could go here
};

let lastTime = 0;
const loop = (timestamp) => {
  const dt = Math.min(0.033, (timestamp - lastTime) / 1000 || 0);
  lastTime = timestamp;

  update(dt);

  // Render Game with callbacks
  renderGame(state, dt, {
    onCombatAction: handleCombatAction
  });

  requestAnimationFrame(loop);
};

// --- 初始化 ---
const init = () => {
  resize();
  initAtmosphere(() => state);
  initUiFx();
  enableGlobalRipples();

  // New Architecture Init
  initRenderer(canvas);
  initZones();
  initInputHandlers(); // Director handles input

  // Start modal with callback
  syncStartModal({
    onStart: () => randomTalents()
  });

  requestAnimationFrame(loop);
};

window.addEventListener("resize", resize);

// Start
init();
