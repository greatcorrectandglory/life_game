import { INDUSTRY_PHASES } from "../systems/industry.js";

export const BLACK_SWAN_EVENTS = {
  // === 负面黑天鹅 (Negative) ===
  negative: {
    major: [
      {
        id: "industry_collapse",
        name: "行业崩塌",
        description: "你所在的行业遭遇结构性危机，大量职位消失。",
        chapters: ["career", "midlife"],
        trigger: (state) =>
          state.career.industry &&
          state.economy.industries[state.career.industry]?.phase ===
            INDUSTRY_PHASES.COLLAPSE,
        effects: { money: -5000, stress: 20, mood: -10 },
        consequence: "industry_migration", // 触发技能迁移逻辑
      },
      {
        id: "health_crisis",
        name: "重大疾病",
        description: "长期的忽视终于爆发，你不得不停下脚步。",
        chapters: ["midlife", "late"],
        trigger: (state) =>
          state.stats.health < 5 ||
          (state.stats.fragility > 60 && Math.random() < 0.2),
        effects: { health: -8, money: -8000, skipTurns: 3 },
      },
      {
        id: "economic_crash",
        name: "金融危机",
        description: "全球经济陷入衰退，资产大幅缩水。",
        chapters: ["career", "midlife", "late"],
        trigger: (state) =>
          state.economy.cycle === "recession" && Math.random() < 0.15,
        effects: { money: -10000, stress: 15 },
      },
      {
        id: "family_emergency",
        name: "家庭变故",
        description: "突如其来的家庭责任压在你肩上。",
        chapters: ["career", "midlife"],
        trigger: (state) => Math.random() < 0.05,
        effects: { money: -3000, mood: -8, stress: 10 },
      },
    ],
    minor: [
      {
        id: "job_loss",
        name: "意外失业",
        description: "公司架构调整，你不幸被波及。",
        chapters: ["career", "midlife"],
        trigger: (state) => Math.random() < 0.08,
        effects: { money: -2000, mood: -3, stress: 8 },
      },
      {
        id: "relationship_break",
        name: "关系破裂",
        description: "一段重要的关系走到了尽头。",
        chapters: ["high", "college", "career"],
        trigger: (state) => state.stats.social < 3 && Math.random() < 0.1,
        effects: { social: -4, mood: -5, stress: 5 },
      },
      {
        id: "burnout",
        name: "职业倦怠",
        description: "你对工作失去了热情，效率大降。",
        chapters: ["career", "midlife"],
        trigger: (state) => state.stats.stress > 70 && Math.random() < 0.1,
        effects: { performance: -3, mood: -3 },
      },
    ],
  },

  // === 正面黑天鹅 (Positive) ===
  positive: {
    major: [
      {
        id: "mentor_discovery",
        name: "贵人相助",
        description: "一位行业大佬注意到了你的才华，愿意提携你。",
        chapters: ["college", "career"],
        requirement: (state) =>
          state.pools.karma >= 3 || state.pools.serendipity >= 5,
        effects: { social: 8, money: 3000, reputation: 5 },
        trait: "贵人运",
      },
      {
        id: "investment_windfall",
        name: "投资暴涨",
        description: "你早期的一笔冒险投资获得了百倍回报！",
        chapters: ["career", "midlife", "late"],
        requirement: (state) => state.pools.riskExposure >= 3,
        effects: { money: 20000 },
      },
      {
        id: "viral_success",
        name: "意外爆红",
        description: "你的作品意外走红，获得了大量关注。",
        chapters: ["college", "career", "midlife"],
        requirement: (state) =>
          state.stats.creativity >= 15 && state.pools.serendipity >= 3,
        effects: { reputation: 10, money: 5000, social: 5 },
      },
      {
        id: "startup_success",
        name: "创业突围",
        description: "你的项目在激烈的竞争中脱颖而出。",
        chapters: ["career"],
        requirement: (state) =>
          state.career.industry === "tech" && state.stats.skill >= 15,
        effects: { money: 15000, reputation: 8 },
      },
    ],
    minor: [
      {
        id: "lucky_opportunity",
        name: "机会窗口",
        description: "一个意外的机会向你敞开了大门。",
        chapters: ["high", "college", "career"],
        requirement: (state) => state.pools.serendipity >= 2,
        effects: { money: 1000, reputation: 2 },
      },
      {
        id: "unexpected_bonus",
        name: "意外之财",
        description: "一笔意料之外的奖金。",
        chapters: ["career", "midlife"],
        requirement: (state) => Math.random() < 0.1,
        effects: { money: 2000, mood: 2 },
      },
    ],
  },
};

/**
 * 黑天鹅触发检查
 */
export const checkBlackSwan = (state) => {
  // 负面黑天鹅：压力越高、安全边际越低，概率越高
  const stressFactor = (state.stats.stress || 0) / 100;
  const safetyFactor = (state.pools.safetyMargin || 0) / 100;
  const negativeChance = 0.05 + stressFactor * 0.05 - safetyFactor * 0.03;

  if (Math.random() < negativeChance) {
    // 从池中选择
    const pool = [
      ...BLACK_SWAN_EVENTS.negative.major,
      ...BLACK_SWAN_EVENTS.negative.minor,
    ].filter((e) => {
      // 检查章节限制
      if (
        e.chapters &&
        !e.chapters.includes(state.chapterObj?.id || "unknown")
      )
        return false;
      // 检查触发条件
      if (e.trigger && !e.trigger(state)) return false;
      return true;
    });

    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  // 正面黑天鹅：需要满足条件
  const serendipityFactor = (state.pools.serendipity || 0) / 100;
  const positiveChance = 0.02 + serendipityFactor * 0.05;

  if (Math.random() < positiveChance) {
    const pool = [
      ...BLACK_SWAN_EVENTS.positive.major,
      ...BLACK_SWAN_EVENTS.positive.minor,
    ].filter((e) => e.requirement(state));

    if (pool.length > 0) {
      return pool[Math.floor(Math.random() * pool.length)];
    }
  }

  return null;
};
