export const MAIN_QUESTS = {
  primary: {
    title: "童年基础",
    desc: "建立良好的生活习惯",
    objectives: [
      { type: "stat", key: "health", target: 12 },
      { type: "stat", key: "mood", target: 12 },
    ],
    rewards: { skillPoints: 1, energy: 2 },
  },
  middle: {
    title: "探索世界",
    desc: "积累知识与人际关系",
    objectives: [
      { type: "stat", key: "knowledge", target: 10 },
      { type: "stat", key: "social", target: 5 },
    ],
    rewards: { skillPoints: 2, karma: 1 },
  },
  high: {
    title: "目标确立",
    desc: "为未来做好准备",
    objectives: [
      { type: "stat", key: "knowledge", target: 20 },
      { type: "stat", key: "focus", target: 12 },
    ],
    rewards: { talentPoints: 1, stress: -10 },
  },
  college: {
    title: "专业深耕",
    desc: "在某个领域达到专业水平",
    objectives: [
      { type: "stat", key: "skill", target: 20 },
      { type: "stat", key: "creativity", target: 10 },
    ],
    rewards: { skillPoints: 3, serendipity: 2 },
  },
  career: {
    title: "资本积累",
    desc: "建立经济基础与声望",
    objectives: [
      { type: "stat", key: "money", target: 5000 },
      { type: "stat", key: "reputation", target: 20 },
    ],
    rewards: { money: 2000, social: 5 },
  },
  midlife: {
    title: "韧性重构",
    desc: "在动荡中保持稳定",
    objectives: [
      { type: "stat", key: "grit", target: 30 },
      { type: "stat", key: "health", target: 15 },
    ],
    rewards: { stressReduction: 20, traits: ["坚毅"] },
  },
  late: {
    title: "精神遗产",
    desc: "将经验传递下去",
    objectives: [
      { type: "stat", key: "social", target: 30 },
      { type: "stat", key: "creativity", target: 20 },
    ],
    rewards: { karma: 5, reputation: 10 },
  },
};

export const SIDE_QUESTS = {
  primary: [
    {
      title: "运动小达人",
      objectives: [{ type: "action", key: "exercise", target: 5 }],
      rewards: { health: 3 },
    },
  ],
  middle: [
    {
      title: "书虫",
      objectives: [{ type: "action", key: "study", target: 5 }],
      rewards: { knowledge: 3 },
    },
  ],
  high: [
    {
      title: "社团活跃",
      objectives: [{ type: "action", key: "social", target: 5 }],
      rewards: { social: 3 },
    },
  ],
  college: [
    {
      title: "创业尝试",
      objectives: [{ type: "action", key: "create", target: 5 }],
      rewards: { creativity: 3, money: 500 },
    },
  ],
  career: [
    {
      title: "人脉拓展",
      objectives: [{ type: "stat", key: "social", target: 20 }],
      rewards: { reputation: 5, karma: 1 },
    },
  ],
  midlife: [
    {
      title: "养生之道",
      objectives: [{ type: "stat", key: "health", target: 18 }],
      rewards: { health: 5, stress: -10 },
    },
  ],
  late: [
    {
      title: "回忆录",
      objectives: [{ type: "action", key: "create", target: 3 }],
      rewards: { reputation: 10 },
    },
  ],
};

export const STORY_CHAINS = {
  // 简化的剧情链配置，具体逻辑由 director 处理
  primary: { steps: [] },
  middle: { steps: [] },
  high: { steps: [] },
  college: { steps: [] },
  career: { steps: [] },
  midlife: { steps: [] },
  late: { steps: [] },
};
