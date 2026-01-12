import { SKILL_DEFINITIONS } from "../data/skillDefinitions.js";

/**
 * 计算实际效果
 * 简化公式: 效果 = 基础值 × 参与度修正 × 衰减修正 × 天赋修正
 */
export const calculateActualEffects = (action, state) => {
  const base = { ...action.effects };

  // 1. 参与度修正（根据熵和负荷）
  const engagementMod = getEngagementModifier(action);

  // 2. 衰减修正（重复行动衰减）
  const decayMod = getDecayModifier(action.id, state.actionCounts);

  // 3. 天赋修正
  const talentMod = getTalentModifier(action, state.talents);

  // 4. 专注力修正
  const focusMod = getFocusModifier(state.stats.focus);

  // 应用修正
  const result = {};
  for (const [key, value] of Object.entries(base)) {
    if (["knowledge", "skill", "creativity"].includes(key)) {
      // 成长类属性受所有修正影响
      result[key] = Math.max(
        1,
        Math.round(value * engagementMod * decayMod * talentMod * focusMod)
      );
    } else {
      // 其他属性只受部分修正
      result[key] = value;
    }
  }

  // 技能获取计算
  if (action.skillGain) {
    const skillAmount = action.skillGain.amount;
    result.skillGain = {
      ...action.skillGain,
      actualAmount: Math.max(
        1,
        Math.floor(skillAmount * engagementMod * talentMod * focusMod)
      ),
    };
  }

  return result;
};

/**
 * 参与度修正
 * 高熵高负荷 = 高收益，低熵低负荷 = 低收益
 */
const getEngagementModifier = (action) => {
  const entropyBonus = { low: 0.8, medium: 1.0, high: 1.3 };
  const loadPenalty = { low: 1.0, medium: 0.9, high: 0.8 }; // 高负荷稍微降低单次效率（因为难）

  const eMod = entropyBonus[action.entropy] || 1.0;
  const lMod = loadPenalty[action.load] || 1.0;

  return eMod * lMod;
};

/**
 * 衰减修正（艾宾浩斯简化）
 * 效率 = 1 / (1 + count/5)
 */
const getDecayModifier = (actionId, actionCounts) => {
  const count = actionCounts[actionId] || 0;
  // 前3次不衰减，之后缓慢衰减
  if (count < 3) return 1.0;
  return 1 / (1 + (count - 2) / 8);
};

/**
 * 天赋修正
 */
const getTalentModifier = (action, talents) => {
  let mod = 1.0;

  if (action.category === "study" && talents.rational > 0) {
    mod += talents.rational * 0.1;
  }
  if (action.category === "social" && talents.empathic > 0) {
    mod += talents.empathic * 0.1;
  }
  if (action.category === "creative" && talents.empathic > 0) {
    mod += talents.empathic * 0.1;
  }
  if (action.category === "health" && talents.grit > 0) {
    mod += talents.grit * 0.1;
  }

  return mod;
};

/**
 * 专注力修正
 */
const getFocusModifier = (focus) => {
  if (focus >= 8) return 1.2;
  if (focus >= 5) return 1.0;
  if (focus >= 3) return 0.7;
  return 0.4;
};

/**
 * 技能衰减（每回合调用）
 */
export const applySkillDecay = (state) => {
  const skills = { ...state.skills };

  for (const [skillId, skillData] of Object.entries(skills)) {
    const normalizedSkill = typeof skillData === "number"
      ? { level: skillData, lastUsed: -1 }
      : { ...(skillData || {}) };
    normalizedSkill.level = normalizedSkill.level || 0;
    if (normalizedSkill.lastUsed === undefined || normalizedSkill.lastUsed === null) {
      normalizedSkill.lastUsed = -1;
    }

    const definition = SKILL_DEFINITIONS[skillId];
    if (!definition) continue;

    let decayAmount = 0;

    // 机械记忆类技能快速衰减
    if (definition.type === "rote") {
      decayAmount = definition.decayRate * 5;
    } else if (definition.type === "deep") {
      // 深度技能缓慢衰减
      decayAmount = definition.decayRate;
    } else {
      decayAmount = definition.decayRate * 2;
    }

    // 只要有等级就衰减，除非本回合刚用过
    if (normalizedSkill.level > 0 && normalizedSkill.lastUsed < state.totalTurns) {
      normalizedSkill.level = Math.max(0, normalizedSkill.level - decayAmount);
    }

    skills[skillId] = normalizedSkill;
  }

  return skills;
};
