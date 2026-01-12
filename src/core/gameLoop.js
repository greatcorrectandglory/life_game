import { getState, patchState } from "./enhancedState.js";
import { logger } from "../utils/logger.js";
import { ACTIONS } from "../data/actions.js";
import { CHAPTERS, getCurrentAge, TOTAL_TURNS } from "../data/stages.js";
import { calculateActualEffects, applySkillDecay } from "../systems/cognitive.js";
import { updateIndustries } from "../systems/industry.js";
import { processStress, resolveStressCheck } from "../systems/psychology.js";
import { checkDilemmaTriggers } from "../systems/dilemma.js";
import { checkDecisionEchoes } from "../systems/decisionEcho.js";
import { checkBlackSwan } from "../data/blackSwanEvents.js";
import { playActionAnim } from "../ui/action_anim.js";
import { createCombatState, executeAttack, executeDefend, executeEscape, executeSkill, executeEnemyTurn } from './combat.js';
import { getRandomEnemy } from '../data/enemies.js';
import { MAIN_QUESTS, SIDE_QUESTS, STORY_CHAINS } from "../data/quests.js";
import {
  playVirtueEffect,
  playStressExplosionEffect,
  playChapterTransition,
  playStoryTriggerEffect,
  playEchoEffect,
  playHealthWarningEffect,
  playBlackSwanEffect,
  updateStressVisual,
  updateFlowVisual
} from "../ui/visualEffects.js";

// === 核心循环 (Core Loop) ===

/**
 * 推进回合 (Advance Turn)
 * 核心循环：行动结算 -> 状态更新 -> 事件触发 -> 章节推进
 */
export const advanceTurn = () => {
  const state = getState();

  if (state.gameOver) {
    logger.warn("Cannot advance turn in game over state");
    return;
  }

  try {
    // 1. 基础时间推进
    const newTurn = state.totalTurns + 1;
    const newChapterTurn = state.chapterTurn + 1;
    const chapter = CHAPTERS[state.chapter];
    const newAge = getCurrentAge(state.chapter, newChapterTurn);

    // 2. 行业与经济更新 (每回合微调，每章节大变)
    const { industries, collapseEvent } = updateIndustries(state);
    
    // 3. 技能衰减 (艾宾浩斯)
    const newSkills = applySkillDecay(state);

    // 4. 压力自然恢复 (如果有"坚毅"特质)
    const stressRecovery = state.traits.includes("坚毅") ? 2 : 0;
    const newStress = Math.max(0, (state.stats.stress || 0) - stressRecovery);

    // 5. 更新状态
    patchState({
      totalTurns: newTurn,
      chapterTurn: newChapterTurn,
      turn: newTurn + 1, // 显示当前回合（总回合数+1）
      age: newAge,
      economy: { ...state.economy, industries },
      skills: newSkills,
      stats: { ...state.stats, stress: newStress },
      energy: state.energyMax, // 恢复精力
    });

    // 6. 更新视觉效果
    updateStressVisual(newStress);
    const isInFlow = newStress >= 40 && newStress <= 70;
    updateFlowVisual(isInFlow);

    // 健康警告
    if (state.stats.health <= 3) {
      playHealthWarningEffect();
    }

    // 7. 检查决策回响事件 (在黑天鹅之前)
    const echo = checkDecisionEchoes(getState());
    if (echo) {
      playEchoEffect(); // 播放回响特效
      triggerEvent({ ...echo.echo.echo, id: echo.echo.id, sourceEcho: echo }, "echo");
      return; // 回响事件优先,其他事件延后
    }

    // 7. 检查黑天鹅事件 (优先于行业崩溃)
    const blackSwan = checkBlackSwan(getState());
    if (blackSwan) {
      playBlackSwanEffect(blackSwan.isPositive || false); // 播放黑天鹅特效
      triggerEvent(blackSwan, "blackSwan");
    } else if (collapseEvent) {
      triggerEvent(collapseEvent, "industry");
    }

    // 8. 检查道德困境
    const dilemma = checkDilemmaTriggers(getState());
    if (dilemma) {
      triggerEvent(dilemma, "dilemma");
    }

    // 9. 检查章节推进
    if (newChapterTurn > chapter.turns) {
      advanceChapter();
    }

    logger.info("Turn advanced", { turn: newTurn, age: newAge });
  } catch (error) {
    logger.error("Failed to advance turn", { error });
  }
};

const getActionObjectiveValue = (state, key) => {
  return state.actionCounts?.[key] || 0;
};

const isQuestDone = (state, quest) => {
  if (!quest || quest.done) return false;
  return quest.objectives.every((objective) => {
    if (objective.type === "stat") {
      return (state.stats[objective.key] || 0) >= objective.target;
    }
    if (objective.type === "action") {
      return getActionObjectiveValue(state, objective.key) >= objective.target;
    }
    return false;
  });
};

const isChainStepDone = (state, step) => {
  if (!step) return false;
  if (step.turn && state.chapterTurn < step.turn) return false;
  if (!step.objectives || step.objectives.length === 0) return true;
  return step.objectives.every((objective) => {
    if (objective.type === "stat") {
      return (state.stats[objective.key] || 0) >= objective.target;
    }
    if (objective.type === "action") {
      return getActionObjectiveValue(state, objective.key) >= objective.target;
    }
    return false;
  });
};

const completeMainQuest = (state) => {
  applyRewards(state.quests.main?.rewards);
  patchState({
    quests: {
      ...state.quests,
      main: { ...state.quests.main, done: true }
    }
  });
  addLog(`主线完成：${state.quests.main.title}`);
  pushStory(`主线完成：${state.quests.main.title}`);
};

const completeSideQuest = (state, index) => {
  const quest = state.quests.side[index];
  if (!quest) return;
  applyRewards(quest.rewards);
  const nextSide = state.quests.side.map((item, idx) =>
    idx === index ? { ...item, done: true } : item
  );
  patchState({
    quests: {
      ...state.quests,
      side: nextSide
    }
  });
  addLog(`支线完成：${quest.title}`);
  pushStory(`支线完成：${quest.title}`);
};

const completeChainStep = (state, chain, step) => {
  if (!chain || !step) return;
  applyRewards(step.reward || {});
  const nextIndex = chain.index + 1;
  const nextQuestCounts = {
    ...state.questCounts,
    chain: (state.questCounts?.chain || 0) + 1
  };
  const nextStoryChain = {
    ...(state.quests?.storyChain || {}),
    step: nextIndex
  };
  patchState({
    chain: { ...chain, index: nextIndex },
    quests: { ...state.quests, storyChain: nextStoryChain },
    questCounts: nextQuestCounts,
    storyText: step.text || state.storyText
  });
  addLog(`剧情推进：${chain.title || "人生章节"}`);
  playStoryTriggerEffect(); // 播放剧情触发特效
  if (nextIndex >= chain.steps.length) {
    addLog(`剧情线完成：${chain.title || "人生章节"}`);
  }
};

const evaluateQuests = () => {
  const state = getState();
  let mainCompleted = false;

  if (state.quests?.main && isQuestDone(state, state.quests.main)) {
    completeMainQuest(state);
    mainCompleted = true;
  }

  if (state.quests?.side?.length) {
    state.quests.side.forEach((quest, index) => {
      if (isQuestDone(state, quest)) {
        completeSideQuest(state, index);
      }
    });
  }

  if (mainCompleted) {
    advanceChapter();
  }
};

const evaluateStoryChain = () => {
  const state = getState();
  const chain = state.chain;
  if (!chain || !chain.steps || chain.steps.length === 0) return;
  const step = chain.steps[chain.index];
  if (!step) return;
  if (isChainStepDone(state, step)) {
    completeChainStep(state, chain, step);
  }
};

/**
 * 执行行动
 * @param {Object|string} actionInput - Action object or ID
 */
export const executeAction = (actionInput) => {
  const state = getState();
  let action = actionInput;
  if (typeof actionInput === 'string') {
    action = ACTIONS.find((a) => a.id === actionInput);
  }

  if (!action) {
    logger.error("Action not found", { actionInput });
    return false;
  }

  if (state.energy < action.cost) {
    addLog(`精力不足，需要${action.cost}点。`);
    return false;
  }

  // 1. 计算实际收益 (认知吸收率)
  const effects = calculateActualEffects(action, state);

  // 2. 更新属性
  const updates = {
    energy: state.energy - action.cost,
    stats: { ...state.stats },
    skills: { ...state.skills },
    actionCounts: { ...state.actionCounts },
  };
  updates.actionCounts[action.id] = (updates.actionCounts[action.id] || 0) + 1;
  const categoryAliasMap = {
    health: "exercise",
    creative: "create",
  };
  const categoryKey = categoryAliasMap[action.category] || action.category;
  if (categoryKey) {
    updates.actionCounts[categoryKey] = (updates.actionCounts[categoryKey] || 0) + 1;
  }

  // 应用数值变化
  Object.entries(effects).forEach(([key, value]) => {
    if (key === "skillGain") {
      // 处理技能获取
      const { id, actualAmount, type } = value;
      const existingSkill = updates.skills[id];
      const normalizedSkill = typeof existingSkill === "number"
        ? { level: existingSkill, type, exp: 0, lastUsed: state.totalTurns }
        : { ...(existingSkill || { level: 0, type, exp: 0 }), type };
      const currentSkill = {
        ...normalizedSkill,
        level: normalizedSkill.level || 0
      };
      updates.skills[id] = {
        ...currentSkill,
        level: currentSkill.level + actualAmount * 0.1,
        lastUsed: state.totalTurns,
      };
    } else if (updates.stats[key] !== undefined) {
      updates.stats[key] = Math.max(0, updates.stats[key] + value);
    }
  });

  // 3. 处理压力影响
  if (effects.stress > 0) {
    const sourceType = action.entropy === "high" ? "EUSTRESS" : "DISTRESS";
    // processStress modifies state in place (be careful), simulating immutable here
    // In real impl, processStress should return updates. Assuming it modifies state.stats
    // We manually sync here for now
    updates.stats.stress = Math.max(0, (updates.stats.stress || 0) + effects.stress);
    if (sourceType === "EUSTRESS") updates.stats.grit = Math.min(100, (state.stats.grit || 0) + 1);
    else updates.stats.fragility = Math.min(100, (state.stats.fragility || 0) + 1);
  }

  patchState(updates);
  addLog(`执行行动：${action.name}。`);
  
  // 动画
  const baseActionId = action.id.split('_')[0]; 
  if (typeof document !== 'undefined') {
    playActionAnim(baseActionId, action.name, () => { });
  }

  // 4. 检查压力爆发
  const stressEvent = resolveStressCheck(getState());
  if (stressEvent) {
    // 播放压力事件视觉特效
    if (stressEvent.type === 'virtue') {
      playVirtueEffect(); // 升华特效
    } else if (stressEvent.type === 'collapse') {
      playStressExplosionEffect(); // 压力爆发特效
    }
    triggerEvent(stressEvent, "stress");
  }
  evaluateQuests();
  evaluateStoryChain();

  return true;
};

// === 战斗系统 (Combat System) ===

/**
 * 开始战斗
 */
export const startCombat = () => {
  const state = getState();
  if (state.energy <= 0) {
    addLog("精力不足，无法挑战。");
    return;
  }
  
  const chapterId = CHAPTERS[state.chapter]?.id || "career";
  const enemy = getRandomEnemy(chapterId);
  const combatState = createCombatState(state.stats, enemy);

  patchState({
    energy: state.energy - 1,
    combat: combatState
  });

  addLog("战斗开始！");
};

/**
 * 处理战斗行动
 */
export const handleCombatAction = (actionType, data) => {
  const state = getState();
  if (!state.combat) return;

  let nextCombat = state.combat;
  let updates = {};

  // 技能选择模式
  if (state.skillSelectMode) {
    if (actionType === 'cancel') {
      updates.skillSelectMode = false;
    } else if (actionType === 'use_skill') {
      nextCombat = executeSkill(nextCombat, data);
      updates.skillSelectMode = false;
      updates.combat = nextCombat;
      patchState(updates);
      checkCombatResult();
      return;
    } else {
      patchState(updates);
      return;
    }
  }

  // 战斗结束
  if (actionType === 'end_combat') {
    patchState({ combat: null });
    return;
  }

  // 下一回合（敌人行动）
  if (actionType === 'next_step') {
    nextCombat = executeEnemyTurn(nextCombat);
    patchState({ combat: nextCombat });
    checkCombatResult();
    return;
  }

  // 玩家行动
  if (actionType === 'attack') {
    nextCombat = executeAttack(nextCombat);
  } else if (actionType === 'defend') {
    nextCombat = executeDefend(nextCombat);
  } else if (actionType === 'escape') {
    nextCombat = executeEscape(nextCombat);
  } else if (actionType === 'skill') {
    patchState({ skillSelectMode: true });
    return;
  }

  patchState({ combat: nextCombat });

  checkCombatResult();
};

/**
 * 检查战斗结果
 */
export const checkCombatResult = () => {
  const state = getState();
  if (!state.combat) return;

  if (state.combat.result === 'victory') {
    const rewards = state.combat.enemy.reward || {};
    applyRewards(rewards);
    addLog(`挑战成功！获得奖励。`);
  } else if (state.combat.result === 'defeat') {
    patchState({
      stats: {
        ...state.stats,
        mood: Math.max(0, (state.stats.mood || 0) - 2),
        health: Math.max(0, (state.stats.health || 0) - 1)
      }
    });
    addLog("挑战失败，情绪受挫。");
  }
};

// === 辅助函数 (Helpers) ===

/**
 * 推进章节
 */
const advanceChapter = () => {
  const state = getState();
  const nextChapterIndex = state.chapter + 1;

  if (nextChapterIndex >= CHAPTERS.length) {
    endGame("completed");
    return;
  }

  const fromChapter = CHAPTERS[state.chapter].name;
  const nextChapter = CHAPTERS[nextChapterIndex];
  const toChapter = nextChapter.name;

  // 播放章节切换动画
  playChapterTransition(fromChapter, toChapter, () => {
    // 动画完成后更新状态
    const main = MAIN_QUESTS[nextChapter.id];
    const sidePool = SIDE_QUESTS[nextChapter.id] || [];
    const side = sidePool.length
      ? sidePool.slice().sort(() => Math.random() - 0.5).slice(0, 2)
      : [];
    const chain = STORY_CHAINS[nextChapter.id];

    patchState({
      chapter: nextChapterIndex,
      chapterIndex: nextChapterIndex, // 兼容
      chapterTurn: 1,
      energyMax: 12,
      energy: 12,
      actionCounts: {},
      quests: {
        ...state.quests,
        main: main ? { ...main, done: false } : null,
        side,
        completed: [],
        storyChain: { id: nextChapter.id, step: 0 }
      },
      chain: chain
        ? { title: chain.title, index: 0, steps: chain.steps.map((step) => ({ ...step })) }
        : { title: null, index: 0, steps: [] }
    });

    logger.info("Chapter advanced", {
      from: CHAPTERS[state.chapter].name,
      to: CHAPTERS[nextChapterIndex].name
    });

    pushStory(`进入新阶段：${CHAPTERS[nextChapterIndex].name}`);
  });
};

/**
 * 触发事件
 */
const triggerEvent = (event, type) => {
  logger.info("Event triggered", { type, eventId: event.id });
  
  const state = getState();
  const pending = [...state.events.pending, { ...event, eventType: type }];
  
  patchState({ 
    events: { ...state.events, pending } 
  });
  
  pushStory(`触发事件：${event.name || event.title}`);
};

/**
 * 游戏结束
 */
export const endGame = (reason) => {
  patchState({ gameOver: true });
  logger.info("Game ended", { reason });
  pushStory("游戏结束！");
};

/**
 * 应用奖励
 */
export const applyRewards = (rewards) => {
  if (!rewards) return;
  const state = getState();
  const updates = {
    stats: { ...state.stats },
    pools: { ...state.pools }
  };

  Object.entries(rewards).forEach(([key, value]) => {
    if (key === "traits" && Array.isArray(value)) {
      const nextTraits = new Set(state.traits || []);
      value.forEach((trait) => nextTraits.add(trait));
      updates.traits = Array.from(nextTraits);
      return;
    }
    if (key === "stressReduction") {
      updates.stats.stress = Math.max(0, (state.stats.stress || 0) - value);
      return;
    }
    if (key === "skillPoints") {
      updates.skillPoints = (state.skillPoints || 0) + value;
      return;
    }
    if (key === "talentPoints") {
      updates.talentPoints = (state.talentPoints || 0) + value;
      return;
    }
    if (key === "energy") {
      const max = state.energyMax || 0;
      updates.energy = Math.min(max, (state.energy || 0) + value);
      return;
    }
    if (key === "energyMax") {
      updates.energyMax = (state.energyMax || 0) + value;
      return;
    }
    if (updates.stats[key] !== undefined) {
      updates.stats[key] += value;
      return;
    }
    if (updates.pools[key] !== undefined) {
      updates.pools[key] += value;
    }
  });
  patchState(updates);
};

export const pushStory = (text) => {
  if (!text) return;
  const state = getState();
  const queue = [...state.storyQueue, text];
  patchState({ storyQueue: queue });
};

export const addLog = (text) => {
  if (!text) return;
  const state = getState();
  const log = [text, ...state.log].slice(0, 8);
  patchState({ log });
};

export const applyAction = (actionId) => {
  executeAction(actionId);
};

export const endTurn = () => {
  advanceTurn();
};

export const getProgress = () => {
  const state = getState();
  return Math.min(100, Math.floor((state.totalTurns / TOTAL_TURNS) * 100));
};

// === 决策回响系统导出 ===
export { applyEchoEffects, resolveEchoChoice, getDecisionStyleSummary } from "../systems/decisionEcho.js";
