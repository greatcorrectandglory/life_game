export const CHAPTERS = [
  { id: "primary", name: "小学期", turns: 3 },
  { id: "middle", name: "初中期", turns: 3 },
  { id: "high", name: "高中期", turns: 3 },
  { id: "college", name: "大学期", turns: 3 },
  { id: "career", name: "职场期", turns: 3 },
  { id: "midlife", name: "中年期", turns: 3 },
  { id: "late", name: "晚年期", turns: 3 }
];

export const MAIN_QUESTS = {
  primary: {
    title: "小学：建立基础",
    desc: "运动与基础思维训练，建立节奏。",
    objectives: [
      { type: "stat", key: "health", target: 10 },
      { type: "stat", key: "knowledge", target: 8 }
    ],
    rewards: { skillPoints: 1, mood: 2 }
  },
  middle: {
    title: "初中：发现方法",
    desc: "找到适合自己的学习方式。",
    objectives: [
      { type: "stat", key: "skill", target: 10 },
      { type: "action", key: "study", target: 4 }
    ],
    rewards: { skillPoints: 1, mood: 2 }
  },
  high: {
    title: "高中：明确路线",
    desc: "完成一次清晰选择。",
    objectives: [
      { type: "stat", key: "knowledge", target: 14 },
      { type: "stat", key: "mood", target: 8 }
    ],
    rewards: { skillPoints: 1, talentPoints: 1 }
  },
  college: {
    title: "大学：沉淀能力",
    desc: "完成一次核心能力突破。",
    objectives: [
      { type: "stat", key: "skill", target: 16 },
      { type: "action", key: "create", target: 3 }
    ],
    rewards: { skillPoints: 2 }
  },
  career: {
    title: "职场：形成资本",
    desc: "稳住收入与关系。",
    objectives: [
      { type: "stat", key: "money", target: 16 },
      { type: "stat", key: "social", target: 12 }
    ],
    rewards: { skillPoints: 2 }
  },
  midlife: {
    title: "中年：守住节奏",
    desc: "保持稳定与韧性。",
    objectives: [
      { type: "stat", key: "health", target: 16 },
      { type: "stat", key: "mood", target: 12 }
    ],
    rewards: { skillPoints: 2 }
  },
  late: {
    title: "晚年：留下作品",
    desc: "保持心态并完成输出。",
    objectives: [
      { type: "stat", key: "creativity", target: 12 },
      { type: "stat", key: "social", target: 14 }
    ],
    rewards: { skillPoints: 2 }
  }
};

export const SIDE_QUESTS = {
  primary: [
    {
      title: "发现兴趣",
      desc: "多尝试不同活动。",
      objectives: [{ type: "action", key: "study", target: 2 }],
      rewards: { mood: 2 }
    },
    {
      title: "体能小目标",
      desc: "坚持运动。",
      objectives: [{ type: "action", key: "exercise", target: 2 }],
      rewards: { health: 2 }
    }
  ],
  middle: [
    {
      title: "社交尝试",
      desc: "主动参与一次社交。",
      objectives: [{ type: "action", key: "social", target: 2 }],
      rewards: { social: 2 }
    },
    {
      title: "复盘学习",
      desc: "完成一次复盘。",
      objectives: [{ type: "stat", key: "knowledge", target: 12 }],
      rewards: { skill: 2 }
    }
  ],
  high: [
    {
      title: "阶段冲刺",
      desc: "连续学习。",
      objectives: [{ type: "action", key: "study", target: 3 }],
      rewards: { knowledge: 2 }
    },
    {
      title: "情绪修复",
      desc: "保持休息节奏。",
      objectives: [{ type: "action", key: "rest", target: 2 }],
      rewards: { mood: 2 }
    }
  ],
  college: [
    {
      title: "项目挑战",
      desc: "完成小型项目。",
      objectives: [{ type: "action", key: "create", target: 3 }],
      rewards: { creativity: 2 }
    },
    {
      title: "人脉积累",
      desc: "建立信任关系。",
      objectives: [{ type: "stat", key: "social", target: 14 }],
      rewards: { social: 2 }
    }
  ],
  career: [
    {
      title: "副业探索",
      desc: "尝试额外收入来源。",
      objectives: [{ type: "action", key: "work", target: 3 }],
      rewards: { money: 3 }
    },
    {
      title: "行业学习",
      desc: "补足行业知识。",
      objectives: [{ type: "stat", key: "knowledge", target: 18 }],
      rewards: { skill: 2 }
    }
  ],
  midlife: [
    {
      title: "生活重构",
      desc: "改善健康与情绪。",
      objectives: [{ type: "action", key: "exercise", target: 3 }],
      rewards: { health: 3 }
    },
    {
      title: "关系维护",
      desc: "稳定社交。",
      objectives: [{ type: "stat", key: "social", target: 16 }],
      rewards: { social: 2 }
    }
  ],
  late: [
    {
      title: "回忆整理",
      desc: "完成一次个人总结。",
      objectives: [{ type: "action", key: "create", target: 2 }],
      rewards: { creativity: 2 }
    },
    {
      title: "家族连接",
      desc: "加强关系网络。",
      objectives: [{ type: "action", key: "social", target: 2 }],
      rewards: { social: 2 }
    }
  ]
};

export const STORY_CHAINS = {
  primary: {
    title: "启蒙之路",
    steps: [
      {
        text: "你第一次意识到，坚持运动能让你更专注。",
        objectives: [{ type: "action", key: "exercise", target: 2 }],
        reward: { mood: 2 }
      },
      {
        text: "你在一次课堂上举手发言，开始建立自信。",
        objectives: [{ type: "action", key: "study", target: 3 }],
        reward: { knowledge: 2 }
      }
    ]
  },
  middle: {
    title: "方法与友伴",
    steps: [
      {
        text: "你和朋友一起完成了一个小项目。",
        objectives: [{ type: "action", key: "social", target: 2 }],
        reward: { social: 2 }
      },
      {
        text: "你开始形成自己的学习方法。",
        objectives: [{ type: "action", key: "study", target: 3 }],
        reward: { skill: 2 }
      }
    ]
  },
  high: {
    title: "路线抉择",
    steps: [
      {
        text: "一次关键考试让你重新审视目标。",
        objectives: [{ type: "stat", key: "knowledge", target: 14 }],
        reward: { mood: 2 }
      },
      {
        text: "你决定下一步的方向。",
        objectives: [{ type: "stat", key: "mood", target: 8 }],
        reward: { skillPoints: 1 }
      }
    ]
  },
  college: {
    title: "能力试炼",
    steps: [
      {
        text: "你参与了一次跨学科的挑战。",
        objectives: [{ type: "action", key: "create", target: 3 }],
        reward: { creativity: 2 }
      },
      {
        text: "你开始建立自己的核心竞争力。",
        objectives: [{ type: "stat", key: "skill", target: 16 }],
        reward: { skillPoints: 1 }
      }
    ]
  },
  career: {
    title: "现实试炼",
    steps: [
      {
        text: "你第一次感受到现金流的重要。",
        objectives: [{ type: "stat", key: "money", target: 16 }],
        reward: { money: 2 }
      },
      {
        text: "你需要学会维持关系与资源。",
        objectives: [{ type: "stat", key: "social", target: 12 }],
        reward: { social: 2 }
      }
    ]
  },
  midlife: {
    title: "韧性重构",
    steps: [
      {
        text: "你开始重新整理生活的节奏。",
        objectives: [{ type: "stat", key: "health", target: 16 }],
        reward: { health: 2 }
      },
      {
        text: "你学会用心态对抗变化。",
        objectives: [{ type: "stat", key: "mood", target: 12 }],
        reward: { mood: 2 }
      }
    ]
  },
  late: {
    title: "回响与遗产",
    steps: [
      {
        text: "你整理自己的经验，希望留下些什么。",
        objectives: [{ type: "stat", key: "creativity", target: 12 }],
        reward: { creativity: 2 }
      },
      {
        text: "你开始把影响力传递下去。",
        objectives: [{ type: "stat", key: "social", target: 14 }],
        reward: { social: 2 }
      }
    ]
  }
};

export const TOTAL_TURNS = CHAPTERS.reduce((sum, chapter) => sum + chapter.turns, 0);
