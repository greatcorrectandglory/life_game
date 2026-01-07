export const BLACK_SWAN_EVENTS = {
  primary: [
    {
      id: "negative_major",
      title: "黑天鹅：家中变故",
      text: "父母工作变动，家里需要重新安排节奏。",
      rewards: { mood: -2, stress: 2 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：生活波动",
      text: "家庭开支增加，你的生活节奏被打乱。",
      rewards: { mood: -1, stress: 1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：家庭转机",
      text: "父母获得新机会，家庭氛围明显改善。",
      rewards: { mood: 2, social: 1 }
    }
  ],
  middle: [
    {
      id: "negative_major",
      title: "黑天鹅：情感挫折",
      text: "一次表白被拒，情绪受到了冲击。",
      rewards: { mood: -2, stress: 2 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：朋友圈风波",
      text: "朋友圈出现误会，你的社交节奏被打乱。",
      rewards: { mood: -1, social: -1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：关键认可",
      text: "被重要的人认可，你的信心大增。",
      rewards: { mood: 2, social: 1 }
    }
  ],
  high: [
    {
      id: "negative_major",
      title: "黑天鹅：政策变动",
      text: "升学政策突变，压力骤增。",
      rewards: { mood: -2, stress: 2 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：竞争升级",
      text: "周围竞争骤然加剧，你需要调整节奏。",
      rewards: { mood: -1, stress: 1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：机会窗口",
      text: "一次竞赛机会让你脱颖而出。",
      rewards: { knowledge: 2, mood: 1 }
    }
  ],
  college: [
    {
      id: "negative_major",
      title: "黑天鹅：行业断层",
      text: "突发行业冲击，项目被迫暂停。",
      rewards: { money: -3, mood: -2, health: -1 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：节奏受阻",
      text: "外部环境变化让你不得不调整节奏。",
      rewards: { money: -2, mood: -1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：窗口机会",
      text: "变局带来机会，你抓住了关键入口。",
      rewards: { money: 3, skill: 1, social: 1 }
    }
  ],
  career: [
    {
      id: "negative_major",
      title: "黑天鹅：行业断层",
      text: "突发行业冲击，项目被迫暂停。",
      rewards: { money: -3, mood: -2, health: -1 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：节奏受阻",
      text: "外部环境变化让你不得不调整节奏。",
      rewards: { money: -2, mood: -1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：窗口机会",
      text: "变局带来机会，你抓住了关键入口。",
      rewards: { money: 3, skill: 1, social: 1 }
    }
  ],
  midlife: [
    {
      id: "negative_major",
      title: "黑天鹅：行业断层",
      text: "突发行业冲击，项目被迫暂停。",
      rewards: { money: -3, mood: -2, health: -1 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：节奏受阻",
      text: "外部环境变化让你不得不调整节奏。",
      rewards: { money: -2, mood: -1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：窗口机会",
      text: "变局带来机会，你抓住了关键入口。",
      rewards: { money: 3, skill: 1, social: 1 }
    }
  ],
  late: [
    {
      id: "negative_major",
      title: "黑天鹅：行业断层",
      text: "突发行业冲击，项目被迫暂停。",
      rewards: { money: -3, mood: -2, health: -1 }
    },
    {
      id: "negative_minor",
      title: "黑天鹅：节奏受阻",
      text: "外部环境变化让你不得不调整节奏。",
      rewards: { money: -2, mood: -1 }
    },
    {
      id: "positive_opportunity",
      title: "黑天鹅：窗口机会",
      text: "变局带来机会，你抓住了关键入口。",
      rewards: { money: 3, skill: 1, social: 1 }
    }
  ]
};

export const ACHIEVEMENTS = [
  {
    id: "main_first",
    name: "主线新星",
    desc: "完成任意主线任务。",
    title: "主线新星",
    perk: { id: "learning_boost", name: "专注新手", effect: "学习类行动收益 +1" }
  },
  {
    id: "main_three",
    name: "主线推进者",
    desc: "完成3个主线任务。",
    title: "推进者",
    perk: { id: "vitality_plus", name: "精力充沛", effect: "精力上限 +1 (生效中)" } // Note: Max energy logic separate
  },
  {
    id: "side_first",
    name: "支线探索者",
    desc: "完成任意支线任务。",
    title: "探索者",
    perk: { id: "social_charm", name: "社交魅力", effect: "社交行动额外获得1点人脉值(Social)" }
  },
  {
    id: "chain_first",
    name: "剧情见证者",
    desc: "完成任意剧情步骤。",
    title: "见证者",
    perk: { id: "insight_bonus", name: "洞察力", effect: "所有技能升级判定降低要求(TBD)" }
  }
];
