export const TRAITS = {
  // === 认知类 (Cognitive) ===
  认知反脆弱: {
    id: "认知反脆弱",
    name: "认知反脆弱",
    desc: "从不确定性中获益，学习新技能效率+20%",
    effects: { learningRate: 1.2 },
    type: "positive",
  },
  思维僵化: {
    id: "思维僵化",
    name: "思维僵化",
    desc: "难以适应变化，学习新技能效率-30%",
    effects: { learningRate: 0.7 },
    type: "negative",
  },
  深度思考者: {
    id: "深度思考者",
    name: "深度思考者",
    desc: "高负荷学习时压力-20%",
    effects: { stressReduction: 0.2 },
    type: "positive",
  },

  // === 心理类 (Psychological) ===
  无畏: {
    id: "无畏",
    name: "无畏",
    desc: "压力上限提高20%，挑战成功率+10%",
    effects: { stressMax: 1.2, challengeBonus: 0.1 },
    type: "positive",
  },
  习得性无助: {
    id: "习得性无助",
    name: "习得性无助",
    desc: "遭遇失败时心情大幅下降，挑战成功率-10%",
    effects: { failurePenalty: 1.5, challengeBonus: -0.1 },
    type: "negative",
  },
  坚毅: {
    id: "坚毅",
    name: "坚毅",
    desc: "每回合自动恢复少量压力",
    effects: { stressRecovery: 2 },
    type: "positive",
  },

  // === 社交类 (Social) ===
  贵人运: {
    id: "贵人运",
    name: "贵人运",
    desc: "正面黑天鹅事件触发概率翻倍",
    effects: { blackSwanChance: 2.0 },
    type: "positive",
  },
  孤僻: {
    id: "孤僻",
    name: "孤僻",
    desc: "社交活动收益-30%",
    effects: { socialGain: 0.7 },
    type: "negative",
  },
  诚信: {
    id: "诚信",
    name: "诚信",
    desc: "长期积累声望速度+20%",
    effects: { reputationGain: 1.2 },
    type: "positive",
  },

  // === 职业类 (Career) ===
  危机驾驭者: {
    id: "危机驾驭者",
    name: "危机驾驭者",
    desc: "行业崩溃时受到的负面影响减半",
    effects: { crisisResistance: 0.5 },
    type: "positive",
  },
  竞争者: {
    id: "竞争者",
    name: "竞争者",
    desc: "在竞争类挑战中胜率+15%",
    effects: { competitionBonus: 0.15 },
    type: "positive",
  },
};

/**
 * 获取特质效果总和
 * @param {Array} traitList - 玩家拥有的特质ID列表
 * @returns {Object} 合并后的效果对象
 */
export const getTraitEffects = (traitList) => {
  const totalEffects = {
    learningRate: 1.0,
    stressReduction: 0,
    stressMax: 1.0,
    challengeBonus: 0,
    blackSwanChance: 1.0,
    socialGain: 1.0,
    crisisResistance: 1.0,
  };

  traitList.forEach((traitId) => {
    const trait = TRAITS[traitId];
    if (trait) {
      Object.entries(trait.effects).forEach(([key, value]) => {
        if (key === "learningRate" || key === "blackSwanChance" || key === "socialGain" || key === "reputationGain" || key === "stressMax") {
          totalEffects[key] *= value;
        } else if (key === "stressReduction" || key === "challengeBonus") {
          totalEffects[key] += value;
        } else if (key === "crisisResistance") {
          totalEffects[key] = Math.min(totalEffects[key], value);
        }
      });
    }
  });

  return totalEffects;
};
