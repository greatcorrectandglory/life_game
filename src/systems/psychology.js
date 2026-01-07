export const STRESS_SOURCES = {
  EUSTRESS: ["challenge", "growth", "competition", "creative_breakthrough"],
  DISTRESS: ["failure", "loss", "overwork", "passive_decay", "industry_collapse"],
};

export const PSYCHOLOGY_CONFIG = {
  STRESS_THRESHOLD: 80, // 触发判定的压力阈值
  BASE_VIRTUE_CHANCE: 0.2, // 基础升华概率
  MAX_GRIT: 100,
  MAX_FRAGILITY: 100,
};

/**
 * 处理压力变化（区分良性/恶性）
 * @param {Object} state - 游戏状态
 * @param {number} amount - 压力变化量
 * @param {string} source - 压力来源
 */
export const processStress = (state, amount, source) => {
  const isEustress = STRESS_SOURCES.EUSTRESS.includes(source);

  // 应用压力变化
  state.stats.stress = Math.max(0, state.stats.stress + amount);

  // 长期影响
  if (amount > 0) {
    if (isEustress) {
      // 良性压力：增加坚毅值
      state.stats.grit = Math.min(
        PSYCHOLOGY_CONFIG.MAX_GRIT,
        state.stats.grit + 1
      );
      state.stressType = "Eustress"; // 记录最后一次压力类型
    } else {
      // 恶性压力：增加脆弱值
      state.stats.fragility = Math.min(
        PSYCHOLOGY_CONFIG.MAX_FRAGILITY,
        state.stats.fragility + 1
      );
      state.stressType = "Distress";
    }
  }

  return state;
};

/**
 * 决心判定（压力爆表时调用）
 * P(升华) = 0.2 + Grit×0.005 - Fragility×0.008 + 历史挑战×0.01
 */
export const resolveStressCheck = (state) => {
  if (state.stats.stress < PSYCHOLOGY_CONFIG.STRESS_THRESHOLD) return null;

  const baseChance = PSYCHOLOGY_CONFIG.BASE_VIRTUE_CHANCE;
  const gritBonus = state.stats.grit * 0.005;
  const fragilityPenalty = state.stats.fragility * 0.008;
  const challengeBonus = (state.challenge?.victories || 0) * 0.01;

  // 计算最终升华概率 (10% - 70%)
  const virtueChance = Math.min(
    0.7,
    Math.max(0.1, baseChance + gritBonus - fragilityPenalty + challengeBonus)
  );

  // 执行判定
  const roll = Math.random();
  const isVirtue = roll < virtueChance;

  if (isVirtue) {
    // === 升华 (Virtue) ===
    return {
      type: "virtue",
      title: "压力升华",
      text: "你在极限压力下爆发出了惊人的韧性，化压力为动力！",
      effects: {
        stress: -state.stats.stress, // 压力清零
        grit: 10,
        mood: 5,
        health: 3,
        focus: 5,
      },
      traitGain: "无畏", // 可能获得的特质
      virtueActive: true,
      virtueTurns: 5, // 持续5回合BUFF
    };
  } else {
    // === 崩溃 (Meltdown) ===
    return {
      type: "meltdown",
      title: "压力崩溃",
      text: "压力压垮了你的防线，你需要时间来疗伤...",
      effects: {
        skipTurns: 2, // 跳过2回合
        health: -5,
        mood: -5,
        fragility: 5,
        focus: -3,
      },
      traitGain: Math.random() < 0.3 ? "习得性无助" : null,
    };
  }
};

/**
 * 获取当前的升华概率（用于UI显示）
 */
export const getVirtueChance = (state) => {
  const baseChance = PSYCHOLOGY_CONFIG.BASE_VIRTUE_CHANCE;
  const gritBonus = state.stats.grit * 0.005;
  const fragilityPenalty = state.stats.fragility * 0.008;
  const challengeBonus = (state.challenge?.victories || 0) * 0.01;

  return Math.min(
    0.7,
    Math.max(0.1, baseChance + gritBonus - fragilityPenalty + challengeBonus)
  );
};
