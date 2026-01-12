import { DILEMMAS } from "../data/dilemmas.js";

/**
 * 检查并触发困境
 * @param {Object} state - 游戏状态
 * @returns {Object|null} 触发的困境对象
 */
export const checkDilemmaTriggers = (state) => {
  // 过滤出符合条件的困境
  const eligibleDilemmas = DILEMMAS.filter((dilemma) => {
    // 1. 检查是否已触发过
    if (state.events.dilemmaResults[dilemma.id]) return false;

    // 2. 检查章节要求
    if (dilemma.chapterRequired && dilemma.chapterRequired !== state.chapter)
      return false;

    // 3. 检查属性要求
    if (dilemma.requirements) {
      for (const [key, value] of Object.entries(dilemma.requirements)) {
        if ((state.stats[key] || 0) < value) return false;
      }
    }

    // 4. 检查特殊触发器
    if (dilemma.trigger === "random_low_energy" && state.energy > 3)
      return false;
    if (dilemma.trigger === "high_stress" && state.stats.stress < 60)
      return false;

    return true;
  });

  if (eligibleDilemmas.length === 0) return null;

  // 基础触发概率 15% (可被机遇池修正)
  const triggerChance = 0.15 + (state.pools.serendipity || 0) * 0.01;

  if (Math.random() < triggerChance) {
    // 随机选择一个
    return eligibleDilemmas[
      Math.floor(Math.random() * eligibleDilemmas.length)
    ];
  }

  return null;
};

/**
 * 解决困境选择
 * @param {Object} state - 游戏状态
 * @param {string} dilemmaId - 困境ID
 * @param {string} optionId - 选项ID
 */
export const resolveDilemma = (state, dilemmaId, optionId) => {
  const dilemma = DILEMMAS.find((d) => d.id === dilemmaId);
  if (!dilemma) return null;

  const option = dilemma.options.find((o) => o.id === optionId);
  if (!option) return null;

  const result = {
    immediateEffects: { ...option.immediate },
    delayedEffects: null,
    riskTriggered: false,
    riskText: null,
    storyText: option.resultText || "你做出了选择。",
  };

  // 1. 处理风险判定
  if (option.risk && Math.random() < option.risk.chance) {
    result.riskTriggered = true;
    result.riskText = option.risk.effectText;

    // 合并风险惩罚
    Object.entries(option.risk.effect).forEach(([key, value]) => {
      result.immediateEffects[key] =
        (result.immediateEffects[key] || 0) + value;
    });
  }

  // 2. 处理延迟效果 (加入池子)
  if (option.delayed) {
    result.delayedEffects = option.delayed;

    // 善缘池 / 恶缘池
    if (option.delayed.type === "karma") {
      const magnitude = option.delayed.magnitude || 1;
      const isGood = option.delayed.value === "good_will";
      state.pools.karma += isGood ? magnitude : -magnitude;
    }

    // 特质获取
    if (option.delayed.type === "trait") {
      if (!state.traits.includes(option.delayed.value)) {
        state.traits.push(option.delayed.value);
        result.traitGained = option.delayed.value;
      }
    }
  }

  // 3. 记录选择结果和决策历史
  state.events.dilemmaResults[dilemmaId] = {
    optionId,
    turn: state.totalTurns,
    chapter: state.chapter,
    riskTriggered: result.riskTriggered,
  };

  // 记录到决策历史 (用于决策回响系统)
  if (!state.decisionHistory) {
    state.decisionHistory = [];
  }
  state.decisionHistory.push({
    dilemmaId,
    optionId,
    turn: state.totalTurns,
    chapter: state.chapter,
    riskTriggered: result.riskTriggered,
  });

  // 4. 应用即时效果到状态
  Object.entries(result.immediateEffects).forEach(([key, value]) => {
    state.stats[key] = Math.max(0, (state.stats[key] || 0) + value);
  });

  return result;
};
