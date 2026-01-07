/**
 * 善缘回报系统
 * 在玩家遭遇困境时，检查是否触发善缘回报
 */

export const KARMA_CONFIG = {
  COST_PER_HELP: 1, // 每次回报消耗的善缘值
  BASE_CHANCE: 0.1, // 基础触发概率
};

/**
 * 检查善缘回报
 * @param {Object} state - 游戏状态
 * @param {Object} crisis - 危机事件 { type, severity }
 */
export const checkKarmaPayback = (state, crisis) => {
  if (state.pools.karma <= 0) return null;

  // 危机严重程度越高，触发回报概率越大
  const severityMultiplier = { minor: 0.1, major: 0.3, critical: 0.5 };
  const baseChance = severityMultiplier[crisis.severity] || KARMA_CONFIG.BASE_CHANCE;

  // 善缘越多，概率越高
  const triggerChance = baseChance + state.pools.karma * 0.05;

  if (Math.random() < triggerChance) {
    // 消耗善缘
    const karmaUsed = Math.min(state.pools.karma, 3);
    
    // 生成回报内容
    const payback = generateKarmaPayback(crisis, karmaUsed);
    
    // 更新状态（消耗善缘）
    // 注意：这里只返回数据，状态更新由调用者处理，或者我们需要传入可变状态
    // 为了保持纯函数风格，我们返回消耗量，由调用者扣除
    
    return {
      triggered: true,
      karmaCost: karmaUsed,
      ...payback
    };
  }

  return null;
};

/**
 * 生成具体的回报内容
 */
const generateKarmaPayback = (crisis, karmaLevel) => {
  const stories = {
    job_loss: [
      "当初你帮助过的落魄校友，如今已是行业新贵，给你介绍了一份工作。",
      "多年前你扶起的老人，他的孙女正好在这家公司任职，愿意为你内推。",
      "一位曾经受你指点的实习生，现在邀请你加入他的创业团队。",
    ],
    health_crisis: [
      "一位你曾经帮助过的医生朋友，主动提供了免费的专家会诊。",
      "社区里受过你恩惠的邻居们，轮流来照顾你的生活起居。",
      "你早期捐助的医疗基金，为你提供了大病特别救助。",
    ],
    bankruptcy: [
      "过去积累的人脉网络在关键时刻伸出援手，为你提供了过桥资金。",
      "一位老客户听说你的困境，提前预付了下一年的服务费。",
      "朋友们发起了一次众筹，帮助你度过难关。",
    ],
    general: [
      "过去的善意在意想不到的时刻得到了回报。",
      "种善因，得善果。你的困境出现了转机。",
    ]
  };

  const pool = stories[crisis.type] || stories.general;
  const story = pool[Math.floor(Math.random() * pool.length)];

  // 根据善缘等级计算效果
  const effects = calculatePaybackEffects(crisis, karmaLevel);

  return {
    type: "karma_payback",
    title: "善缘回报",
    text: story,
    effects,
  };
};

/**
 * 计算回报效果
 */
const calculatePaybackEffects = (crisis, level) => {
  const multiplier = level; // 善缘等级倍率

  switch (crisis.type) {
    case "job_loss":
      return { money: 2000 * multiplier, mood: 2 * multiplier };
    case "health_crisis":
      return { health: 3 * multiplier, money: 1000 * multiplier };
    case "bankruptcy":
      return { money: 5000 * multiplier, social: 1 * multiplier };
    default:
      return { mood: 3 * multiplier, stress: -5 * multiplier };
  }
};
