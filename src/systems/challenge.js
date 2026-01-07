import { SKILL_DEFINITIONS } from "../data/skillDefinitions.js";

/**
 * 挑战类型定义
 */
export const CHALLENGE_TYPES = {
  exam: {
    id: "exam",
    name: "考试挑战",
    difficulty: (state) => state.chapter * 5 + 10,
    statUsed: ["knowledge", "skill", "focus"],
    bonusSkills: ["memorization", "logic"],
    rewards: {
      success: { reputation: 3, mood: 2, knowledge: 2 },
      fail: { mood: -2, stress: 3 },
    },
    description: "检验知识积累的阶段性测试",
  },

  interview: {
    id: "interview",
    name: "面试挑战",
    difficulty: (state) => 20 + state.career.position * 5,
    statUsed: ["social", "skill", "knowledge"],
    bonusSkills: ["communication", "trust"],
    rewards: {
      success: { money: 2000, reputation: 5, careerExp: 10 },
      fail: { mood: -3, stress: 4 },
    },
    description: "争取更好职位和薪资的机会",
  },

  competition: {
    id: "competition",
    name: "技能竞赛",
    difficulty: (state) => 15 + state.chapter * 4,
    statUsed: ["skill", "creativity", "focus"],
    bonusSkills: ["execution", "planning"],
    rewards: {
      success: { reputation: 8, serendipity: 3, trait: "竞争者" },
      fail: { stress: 3, mood: -1 },
    },
    description: "在专业领域与他人一决高下",
  },

  crisis: {
    id: "crisis",
    name: "危机公关",
    difficulty: (state) => 25 + state.stats.fragility * 0.1,
    statUsed: ["grit", "social", "money"],
    bonusSkills: ["leadership", "stressManagement"],
    rewards: {
      success: { grit: 5, reputation: 5, trait: "危机驾驭者" },
      fail: { reputation: -5, money: -2000, stress: 10 },
    },
    description: "处理突发状况，化险为夷",
  },

  debate: {
    id: "debate",
    name: "公开辩论",
    difficulty: (state) => 12 + state.chapter * 3,
    statUsed: ["knowledge", "social", "logic"],
    bonusSkills: ["logic", "communication"],
    rewards: {
      success: { social: 4, reputation: 3 },
      fail: { mood: -2 },
    },
    description: "通过逻辑和口才说服对手",
  },
};

/**
 * 计算挑战结果
 * 成功率 = (玩家能力值 / 难度值) * 随机修正
 */
export const calculateChallengeOutcome = (state, challengeType) => {
  const challenge = CHALLENGE_TYPES[challengeType];
  if (!challenge) return null;

  const difficulty = challenge.difficulty(state);

  // 1. 计算基础能力值 (Stats)
  let basePower = 0;
  challenge.statUsed.forEach((stat) => {
    basePower += state.stats[stat] || 0;
  });

  // 2. 计算技能加成 (Skills)
  let skillPower = 0;
  if (challenge.bonusSkills) {
    challenge.bonusSkills.forEach((skillId) => {
      const skill = state.skills[skillId];
      if (skill && skill.level > 0) {
        skillPower += skill.level * 2; // 技能等级每级+2
      }
    });
  }

  // 3. 计算天赋修正 (Talents)
  let talentMod = 1.0;
  if (challengeType === "exam" && state.talents.rational > 0)
    talentMod += 0.1 * state.talents.rational;
  if (challengeType === "interview" && state.talents.empathic > 0)
    talentMod += 0.1 * state.talents.empathic;
  if (challengeType === "crisis" && state.talents.grit > 0)
    talentMod += 0.1 * state.talents.grit;

  // 4. 计算总战力
  const totalPower = (basePower + skillPower) * talentMod;

  // 5. 计算胜率 (限制在 5% - 95%)
  // 引入 0.8-1.2 的随机波动
  const randomFactor = 0.8 + Math.random() * 0.4;
  let winChance = (totalPower / difficulty) * randomFactor;
  winChance = Math.max(0.05, Math.min(0.95, winChance));

  // 6. 执行判定
  const isSuccess = Math.random() < winChance;

  return {
    success: isSuccess,
    challengeName: challenge.name,
    playerPower: Math.round(totalPower),
    difficulty: Math.round(difficulty),
    winChance: Math.round(winChance * 100),
    rewards: isSuccess ? challenge.rewards.success : challenge.rewards.fail,
    description: challenge.description,
  };
};
