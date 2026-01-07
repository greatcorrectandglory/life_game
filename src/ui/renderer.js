import { getState } from '../core/enhancedState.js';
import { ACTIONS, ACTION_GROUPS } from '../data/actions.js';
import { STAGE_PROMPTS } from '../data/constants.js';
import { ACHIEVEMENTS } from '../data/events.js';
import { CHAPTERS } from '../data/stages.js';
import { SKILL_TREE } from '../data/skill_tree.js';
import { applyAction } from '../core/gameLoop.js';
import { getEconomyLabel } from '../core/economy.js';
import { updateCombatUI, showSkillSelect } from './combatUI.js';
import { getAvailableSkills } from '../data/combat_skills.js';

const getStatusMeta = () => {
    const state = getState();
    const mood = state.stats.mood || 0;
    const health = state.stats.health || 0;
    const stress = state.stats.stress || 0;

    let moodLabel = "平淡";
    if (mood >= 15) moodLabel = "激昂";
    else if (mood >= 10) moodLabel = "愉悦";
    else if (mood <= 3) moodLabel = "抑郁";
    else if (mood <= 6) moodLabel = "低落";

    let healthLabel = "亚健康";
    if (health >= 15) healthLabel = "充沛";
    else if (health >= 10) healthLabel = "良好";
    else if (health <= 3) healthLabel = "虚弱";
    else if (health <= 6) healthLabel = "疲惫";

    let overall = "平稳";
    if (stress >= 15) overall = "高压危险";
    else if (mood >= 12 && health >= 12) overall = "巅峰状态";
    if (state.flowState === "flow") overall = "心流中";

    return { moodLabel, healthLabel, overall };
};

let ctx = null;
let canvas = null;
let activeZones = [];
export const zones = [
    { id: "study", name: "学习区", x: 50, y: 140, w: 120, h: 140, img: "assets/loc_study.png" },
    { id: "exercise", name: "运动区", x: 250, y: 120, w: 120, h: 140, img: "assets/loc_exercise.png" },
    { id: "social", name: "社交区", x: 450, y: 150, w: 120, h: 140, img: "assets/loc_social.png" },
    { id: "work", name: "工作区", x: 80, y: 340, w: 120, h: 140, img: "assets/loc_work.png" },
    { id: "create", name: "创作区", x: 280, y: 360, w: 120, h: 140, img: "assets/loc_create.png" },
    { id: "active_leisure", name: "主动娱乐", x: 480, y: 300, w: 100, h: 80, color: "#a78bfa" },
    { id: "passive_ent", name: "被动娱乐", x: 480, y: 390, w: 100, h: 80, color: "#f472b6" },
    { id: "rest", name: "休息区", x: 600, y: 340, w: 80, h: 100, img: "assets/loc_rest.png" },
    { id: "arena", name: "挑战场", x: 650, y: 240, w: 140, h: 160, img: "assets/loc_arena.png" },
    { id: "end", name: "结束回合", x: 700, y: 460, w: 120, h: 60, color: "#fbbf24" }
];

// Floating Text System
let floatingTexts = [];

export const initRenderer = (canvasEl) => {
    canvas = canvasEl;
    ctx = canvas.getContext('2d');

    // Resize handler could go here
    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initZones();
    };
    window.addEventListener('resize', resize);
    resize();

    // Start Request Animation Frame locally? Or let main loop call draw.
    // Let main loop call renderGame(state).
};

const getStartX = () => (window.innerWidth - 800) / 2;
const startY = 140;

export const initZones = () => {
    const startX = getStartX();
    // Update x/y based on dynamic centering if needed, matching main.js logic ideally.
    // For now using hardcoded relative offsets from zones array but we need to apply startX/startY logic.

    // Re-map zones with offset
    const baseZones = [
        { id: "study", name: "学习区", x: 50, y: 0, w: 120, h: 140, img: "assets/loc_study.png" },
        { id: "exercise", name: "运动区", x: 250, y: -20, w: 120, h: 140, img: "assets/loc_exercise.png" },
        { id: "social", name: "社交区", x: 450, y: 10, w: 120, h: 140, img: "assets/loc_social.png" },
        { id: "work", name: "工作区", x: 80, y: 200, w: 120, h: 140, img: "assets/loc_work.png" },
        { id: "create", name: "创作区", x: 280, y: 220, w: 120, h: 140, img: "assets/loc_create.png" },
        { id: "active_leisure", name: "主动娱乐", x: 480, y: 160, w: 100, h: 80, color: "#a78bfa" },
        { id: "passive_ent", name: "被动娱乐", x: 480, y: 250, w: 100, h: 80, color: "#f472b6" },
        { id: "rest", name: "休息区", x: 600, y: 200, w: 80, h: 100, img: "assets/loc_rest.png" },
        { id: "arena", name: "挑战场", x: 650, y: 100, w: 140, h: 160, img: "assets/loc_arena.png" },
        { id: "end", name: "结束回合", x: 700, y: 320, w: 120, h: 60, color: "#fbbf24" }
    ];

    const state = getState();
    const chapterId = CHAPTERS[state.chapterIndex]?.id || "career";

    activeZones = baseZones.map(z => ({
        ...z,
        x: startX + z.x,
        y: startY + z.y
    })).filter((zone) => {
        // Basic filtering logic
        return true;
    });

    // DOM Elements for zones
    const world = document.getElementById("game-world");
    if (world) {
        world.innerHTML = "";
        activeZones.forEach(zone => {
            const el = document.createElement("div");
            el.className = "map-location";
            el.style.left = zone.x + "px";
            el.style.top = zone.y + "px";
            el.style.width = zone.w + "px";
            el.style.height = zone.h + "px";
            el.dataset.zoneId = zone.id;

            if (zone.img) {
                el.innerHTML = `
                <img src="${zone.img}" class="loc-icon" alt="${zone.name}">
                <div class="loc-label">${zone.name}</div>
            `;
            } else {
                el.className = "map-location zone-btn";
                el.id = `zone-${zone.id}`;
                el.style.borderRadius = "12px";
                el.style.textAlign = "center";
                el.style.lineHeight = zone.h + "px";
                el.style.backgroundColor = zone.color || "var(--accent-primary)";
                el.innerHTML = `<span style="font-weight:bold;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.5)">${zone.name}</span>`;
            }
            world.appendChild(el);
        });
    }

    return activeZones; // Export for hit testing
};

export const getActiveZones = () => activeZones;

export const spawnFloatingText = (text, x, y, type = "normal") => {
    floatingTexts.push({
        text,
        x,
        y,
        type,
        life: 1.5,
        vy: -20
    });
};

export const renderGame = (state, dt, callbacks = {}) => {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Floating Texts
    floatingTexts.forEach((ft, index) => {
        ft.life -= dt;
        ft.y += ft.vy * dt;

        ctx.globalAlpha = Math.min(1, ft.life);
        ctx.font = "bold 16px 'Inter', sans-serif";
        ctx.fillStyle = ft.type === "positive" ? "#4ade80" : ft.type === "negative" ? "#f87171" : "#ffffff";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1.0;

        if (ft.life <= 0) {
            floatingTexts.splice(index, 1);
        }
    });

    updateUI(state);

    // Combat UI
    // Ensure overlay visibility
    const combatOverlay = document.getElementById("combat-overlay");
    if (combatOverlay) {
        const shouldShow = Boolean(state.combat);
        combatOverlay.classList.toggle("hidden", !shouldShow);
        combatOverlay.style.pointerEvents = shouldShow ? "auto" : "none";
        combatOverlay.style.visibility = shouldShow ? "visible" : "hidden";
    }

    if (state.combat) {
        const onCombatAction = callbacks.onCombatAction || (() => { });
        updateCombatUI(state.combat, (actionId) => onCombatAction(actionId));

        if (state.skillSelectMode) {
            const skills = getAvailableSkills(state.skills);
            showSkillSelect(
                skills,
                (skill) => onCombatAction('use_skill', skill),
                () => onCombatAction('cancel')
            );
        }
    } else {
        updateCombatUI(null);
    }
};

export const updateUI = (state) => {
    // Sync HUD
    const setText = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setWidth = (id, percent) => { const el = document.getElementById(id); if (el) el.style.width = `${percent}%`; };

    setText("text-energy", `${Math.floor(state.energy)}/${state.energyMax}`);
    setText("val-health", Math.floor(state.stats.health));
    setText("val-mood", Math.floor(state.stats.mood));
    setText("val-money", Math.floor(state.stats.money));
    setText("val-turn-num", state.turn);

    setWidth("bar-energy", (state.energy / state.energyMax) * 100);

    // Stress
    const stressVal = state.stats.stress || 0;
    const stressMax = 20;
    const stressPercent = Math.min(100, Math.max(0, (stressVal / stressMax) * 100));
    setWidth("bar-stress", stressPercent);
    setText("text-stress", `${Math.floor(stressPercent)}%`);

    const flowLabel = document.getElementById("flow-label");
    if (flowLabel) {
        if (stressPercent >= 40 && stressPercent <= 70) {
            flowLabel.style.display = "inline-block";
            flowLabel.textContent = "FLOW";
            flowLabel.style.backgroundColor = "var(--accent-cyan)";
        } else if (stressPercent > 85) {
            flowLabel.style.display = "inline-block";
            flowLabel.textContent = "OVERLOAD";
            flowLabel.style.backgroundColor = "var(--danger)";
        } else {
            flowLabel.style.display = "none";
        }
    }

    // Guide
    const guide = document.getElementById("guide-overlay");
    if (guide && state.talentMode === "ready") {
        if (state.energy > 0) {
            guide.textContent = `消耗精力: 点击场景互动 (剩余${state.energy}/${state.energyMax})`;
            guide.style.color = "var(--accent-cyan)";
        } else {
            guide.textContent = "精力已耗尽！点击右下角【结束回合】继续";
            guide.style.color = "var(--accent-gold)";
        }
    }

    // Story & Logs
    setText("story-display", state.storyText || "");
    const logEl = document.getElementById("log-list");
    if (logEl) { // Simple diffing or full replace
        logEl.innerHTML = state.log.map(item => `<div class="log-entry">> ${item}</div>`).join("");
    }

    // 4. Core Panel
    const corePanel = document.getElementById("hud-core");
    const coreStatus = document.getElementById("core-status");
    const coreAction = document.getElementById("core-action");
    const coreGains = document.getElementById("core-gains");
    if (corePanel && coreStatus && coreAction && coreGains) {
        const status = getStatusMeta();
        coreStatus.textContent = `状态：${status.overall} · 情绪 ${status.moodLabel} · 体能 ${status.healthLabel}`;

        const renderMetric = (targetId, label, value, color) => {
            const el = document.getElementById(targetId);
            if (!el) return;
            const percentValue = Math.min(100, Math.max(0, Math.round((value / 20) * 100)));
            el.innerHTML = `
        <div class="core-row"><span>${label}</span><span>${Math.floor(value)}</span></div>
        <div class="core-bar"><div class="core-bar-fill" style="width:${percentValue}%;background:${color}"></div></div>
      `;
        };

        renderMetric("core-health", "健康", state.stats.health || 0, "linear-gradient(90deg,#22c55e,#86efac)");
        renderMetric("core-stress", "压力", state.stats.stress || 0, "linear-gradient(90deg,#f97316,#fdba74)");
        renderMetric("core-knowledge", "知识", state.stats.knowledge || 0, "linear-gradient(90deg,#38bdf8,#a5f3fc)");
        renderMetric("core-skill", "技能", state.stats.skill || 0, "linear-gradient(90deg,#6366f1,#c7d2fe)");
        renderMetric("core-social", "社交", state.stats.social || 0, "linear-gradient(90deg,#f472b6,#fbcfe8)");
        renderMetric("core-creativity", "创意", state.stats.creativity || 0, "linear-gradient(90deg,#f59e0b,#fde68a)");
        renderMetric("core-mood", "情绪", state.stats.mood || 0, "linear-gradient(90deg,#fbbf24,#fde68a)");
        renderMetric("core-money", "金钱", state.stats.money || 0, "linear-gradient(90deg,#14b8a6,#6ee7b7)");

        const summary = state.lastActionSummary;
        if (summary) {
            coreAction.textContent = summary.title || "行动完成";
            coreGains.innerHTML = summary.gains
                .map((item) => `<span class="core-gain-chip">${item}</span>`)
                .join("");
        } else {
            coreAction.textContent = "等待行动";
            coreGains.textContent = "完成行动后显示收益。";
        }

        if (state.lastActionTick && state.lastActionTick !== corePanel.dataset.tick) {
            corePanel.classList.remove("core-flash");
            corePanel.offsetHeight;
            corePanel.classList.add("core-flash");
            corePanel.dataset.tick = String(state.lastActionTick);
        }
    }

    // Low Freq Updates (Quests/Skills) - could be throttled but for now we put here or separate
    updateStaticUI(state);
};

const updateStaticUI = (state) => {
    // Quests
    const questEl = document.getElementById("hud-quests");
    if (questEl) {
        let questHTML = `<h3>当前目标</h3>`;
        if (state.quests.main) {
            const q = state.quests.main;
            questHTML += `
          <div class="quest-item ${q.done ? 'done' : ''}">
            <div style="font-weight:bold;margin-bottom:4px">[主] ${q.title}</div>
            <div style="font-size:12px;opacity:0.8">${q.desc}</div>
          </div>
        `;
        }
        state.quests.side.forEach(q => {
            questHTML += `
          <div class="quest-item ${q.done ? 'done' : ''}">
            <div>[支] ${q.title}</div>
          </div>
        `;
        });
        questEl.innerHTML = questHTML;
    }

    // Achievements Mini
    const achievementMiniEl = document.getElementById("achievement-mini-list");
    if (achievementMiniEl) {
        const unlocked = ACHIEVEMENTS.filter((item) => state.achievements[item.id]);
        const recent = unlocked.slice(-3);
        let html = `<div class="profile-chip">当前称号：${state.title}</div>`;
        if (!recent.length) {
            html += `<div class="achievement-desc">暂无成就，完成任务解锁。</div>`;
        } else {
            html += recent
                .map((item) => `<div class="achievement-card"><div class="achievement-title">${item.name}</div><div class="achievement-desc">${item.desc}</div></div>`)
                .join("");
        }
        achievementMiniEl.innerHTML = html;
    }

    // Skills
    const skillEl = document.getElementById("hud-skills");
    if (skillEl) {
        // Helper to match main.js getSkillLevel if not imported. 
        // Ideally should be imported from skills.js or helpers. 
        // For now we access state.skills directly.
        const getSkillLevel = (id) => state.skills[id] || 0;

        let skillHTML = `<h3>技能树</h3>`;
        skillHTML += `<div style="font-size:12px;opacity:0.7;margin-top:6px">可用技能点：${state.skillPoints}</div>`;

        Object.values(SKILL_TREE).forEach(group => {
            skillHTML += `<div style="margin-top:10px;font-weight:bold;color:#ffb347">${group.name}</div>`;
            group.skills.forEach(skill => {
                const level = getSkillLevel(skill.id);
                const isMax = level >= skill.max;
                const disabled = state.skillPoints <= 0 || isMax;
                skillHTML += `
            <button class="skill-item" data-skill-id="${skill.id}" data-skill-max="${skill.max}" ${disabled ? "disabled" : ""}>
              <span style="opacity:${isMax ? 0.6 : 1}">${skill.name}</span>
              <span>${level}/${skill.max}</span>
            </button>
          `;
            });
        });
        skillEl.innerHTML = skillHTML;
    }
};

export const showActionPicker = (zoneId, applyActionCallback) => {
    const group = ACTION_GROUPS[zoneId];
    if (!group) return false;

    // Remove existing
    const existing = document.getElementById("action-picker");
    if (existing) existing.remove();

    const overlay = document.createElement("div");
    overlay.id = "action-picker";
    overlay.className = "overlay";
    overlay.innerHTML = `
        <div class="glass-panel action-picker-panel">
            <div class="action-picker-title">${group.title}</div>
            <p class="action-picker-subtitle">${group.subtitle}</p>
            <div class="action-picker-grid" id="action-picker-grid"></div>
            <div style="margin-top:16px">
                <button class="btn-danger" id="action-picker-cancel">取消</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const grid = document.getElementById("action-picker-grid");
    const state = getState();

    group.actions.forEach((actionId) => {
        const action = ACTIONS.find((item) => item.id === actionId);
        if (!action) return;

        const energyCost = action.cost || 1;

        let tagHtml = "";
        if (action.entropy) {
            const entropyColors = { low: "#4ade80", medium: "#fbbf24", high: "#f87171" };
            const entropyLabels = { low: "被动", medium: "平衡", high: "主动" };
            tagHtml += `<span style="background:${entropyColors[action.entropy]}22; color:${entropyColors[action.entropy]}; padding:2px 6px; border-radius:4px; font-size:10px; margin-right:4px">${entropyLabels[action.entropy]}</span>`;
        }
        if (action.effects.focus) {
            const focusColor = action.effects.focus > 0 ? "#4ade80" : "#f87171";
            tagHtml += `<span style="color:${focusColor}; font-size:10px">专注 ${action.effects.focus > 0 ? '+' : ''}${action.effects.focus}</span>`;
        }

        const btn = document.createElement("button");
        btn.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
                <div style="font-weight:700">${action.name}</div>
                <div>${tagHtml}</div>
            </div>
            <div style="font-size:12px;opacity:0.8">${action.desc}</div>
            <div style="font-size:12px;opacity:0.7;margin-top:4px">精力消耗: ${energyCost}</div>
        `;

        if (state.energy < energyCost) {
            btn.disabled = true;
            btn.style.opacity = "0.5";
            btn.style.cursor = "not-allowed";
        } else {
            btn.onclick = () => {
                overlay.remove();
                if (applyActionCallback) applyActionCallback(actionId);
            };
        }
        grid.appendChild(btn);
    });

    // Add cancel handler
    const cancelBtn = document.getElementById("action-picker-cancel");
    if (cancelBtn) cancelBtn.onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };

    return true;
};
