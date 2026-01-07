export const SKILL_TYPES = {
  DEEP: "deep",
  ROTE: "rote",
  HYBRID: "hybrid",
};

export const SKILL_DEFINITIONS = {
  logic: {
    id: "logic",
    name: "逻辑思维",
    category: "academic",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#批判思维", "#问题解决", "#分析"],
    transferability: 0.8,
    decayRate: 0.02,
    description: "独立分析问题的能力",
  },

  memorization: {
    id: "memorization",
    name: "应试技巧",
    category: "academic",
    maxLevel: 5,
    type: SKILL_TYPES.ROTE,
    tags: ["#应试", "#背诵"],
    transferability: 0.1,
    decayRate: 0.15,
    description: "快速记忆和应付考试的技巧",
  },

  research: {
    id: "research",
    name: "研究方法",
    category: "academic",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#研究", "#信息处理", "#批判思维"],
    transferability: 0.75,
    decayRate: 0.03,
    description: "系统性研究和分析的能力",
  },

  foundation: {
    id: "foundation",
    name: "基础学科",
    category: "academic",
    maxLevel: 5,
    type: SKILL_TYPES.HYBRID,
    tags: ["#数学", "#科学", "#基础"],
    transferability: 0.6,
    decayRate: 0.05,
    description: "数理化等基础学科知识",
  },

  spatialThinking: {
    id: "spatialThinking",
    name: "空间思维",
    category: "professional",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#空间感", "#可视化", "#设计"],
    transferability: 0.7,
    decayRate: 0.03,
    linkedIndustries: ["architecture", "gameDesign", "creative"],
    description: "三维空间想象和设计能力",
  },

  regulations: {
    id: "regulations",
    name: "规范背诵",
    category: "professional",
    maxLevel: 5,
    type: SKILL_TYPES.ROTE,
    tags: ["#行业规范", "#法规"],
    transferability: 0.05,
    decayRate: 0.2,
    linkedIndustries: ["architecture", "finance", "healthcare"],
    description: "行业规范和法规的记忆",
  },

  programming: {
    id: "programming",
    name: "编程开发",
    category: "professional",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#编程", "#逻辑", "#技术"],
    transferability: 0.65,
    decayRate: 0.04,
    linkedIndustries: ["tech"],
    description: "软件开发和编程能力",
  },

  dataAnalysis: {
    id: "dataAnalysis",
    name: "数据分析",
    category: "professional",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#数据", "#分析", "#决策"],
    transferability: 0.7,
    decayRate: 0.04,
    linkedIndustries: ["tech", "finance"],
    description: "数据驱动的分析和决策能力",
  },

  financial: {
    id: "financial",
    name: "金融知识",
    category: "professional",
    maxLevel: 5,
    type: SKILL_TYPES.HYBRID,
    tags: ["#金融", "#投资", "#风险"],
    transferability: 0.5,
    decayRate: 0.06,
    linkedIndustries: ["finance"],
    description: "金融市场和投资知识",
  },

  execution: {
    id: "execution",
    name: "执行力",
    category: "career",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#执行", "#效率", "#产出"],
    transferability: 0.8,
    decayRate: 0.02,
    description: "高效完成任务的能力",
  },

  planning: {
    id: "planning",
    name: "项目管理",
    category: "career",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#规划", "#管理", "#协调"],
    transferability: 0.75,
    decayRate: 0.03,
    description: "规划和管理项目的能力",
  },

  insight: {
    id: "insight",
    name: "行业洞察",
    category: "career",
    maxLevel: 5,
    type: SKILL_TYPES.HYBRID,
    tags: ["#洞察", "#趋势", "#判断"],
    transferability: 0.4,
    decayRate: 0.08,
    description: "对行业趋势的判断能力",
  },

  communication: {
    id: "communication",
    name: "沟通表达",
    category: "social",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#沟通", "#表达", "#说服"],
    transferability: 0.85,
    decayRate: 0.02,
    description: "清晰表达和说服他人的能力",
  },

  trust: {
    id: "trust",
    name: "信任维护",
    category: "social",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#信任", "#关系", "#长期"],
    transferability: 0.9,
    decayRate: 0.01,
    description: "建立和维护信任关系的能力",
  },

  leadership: {
    id: "leadership",
    name: "领导力",
    category: "social",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#领导", "#影响力", "#决策"],
    transferability: 0.85,
    decayRate: 0.02,
    description: "带领团队和影响他人的能力",
  },

  negotiation: {
    id: "negotiation",
    name: "谈判技巧",
    category: "social",
    maxLevel: 5,
    type: SKILL_TYPES.HYBRID,
    tags: ["#谈判", "#博弈", "#沟通"],
    transferability: 0.7,
    decayRate: 0.04,
    description: "在谈判中争取利益的能力",
  },

  story: {
    id: "story",
    name: "叙事表达",
    category: "creative",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#叙事", "#创意", "#表达"],
    transferability: 0.75,
    decayRate: 0.03,
    linkedIndustries: ["creative"],
    description: "讲述引人入胜故事的能力",
  },

  aesthetic: {
    id: "aesthetic",
    name: "视觉审美",
    category: "creative",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#审美", "#设计", "#视觉"],
    transferability: 0.7,
    decayRate: 0.03,
    linkedIndustries: ["creative", "architecture"],
    description: "视觉设计和审美判断能力",
  },

  craft: {
    id: "craft",
    name: "创意实践",
    category: "creative",
    maxLevel: 5,
    type: SKILL_TYPES.HYBRID,
    tags: ["#实践", "#创作", "#技艺"],
    transferability: 0.6,
    decayRate: 0.04,
    linkedIndustries: ["creative"],
    description: "将创意转化为作品的能力",
  },

  fitness: {
    id: "fitness",
    name: "体能管理",
    category: "health",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#体能", "#健康", "#耐力"],
    transferability: 0.9,
    decayRate: 0.05,
    description: "保持身体健康和体能的能力",
  },

  stressManagement: {
    id: "stressManagement",
    name: "压力调节",
    category: "health",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#压力", "#情绪", "#恢复"],
    transferability: 0.9,
    decayRate: 0.02,
    description: "管理压力和情绪的能力",
  },

  habit: {
    id: "habit",
    name: "生活习惯",
    category: "health",
    maxLevel: 5,
    type: SKILL_TYPES.DEEP,
    tags: ["#习惯", "#自律", "#作息"],
    transferability: 0.95,
    decayRate: 0.02,
    description: "维持健康生活习惯的能力",
  },
};

export const SKILL_CATEGORIES = {
  academic: { name: "学术", color: "#4ade80" },
  professional: { name: "专业", color: "#60a5fa" },
  career: { name: "职场", color: "#f59e0b" },
  social: { name: "社交", color: "#ec4899" },
  creative: { name: "创作", color: "#a78bfa" },
  health: { name: "健康", color: "#34d399" },
};

export const SKILL_TAG_INDEX = {
  "#批判思维": ["logic", "research"],
  "#问题解决": ["logic", "programming"],
  "#分析": ["logic", "dataAnalysis", "research"],
  "#应试": ["memorization"],
  "#背诵": ["memorization", "regulations"],
  "#空间感": ["spatialThinking"],
  "#设计": ["spatialThinking", "aesthetic"],
  "#编程": ["programming"],
  "#逻辑": ["logic", "programming"],
  "#数据": ["dataAnalysis"],
  "#金融": ["financial"],
  "#执行": ["execution"],
  "#规划": ["planning"],
  "#沟通": ["communication", "negotiation"],
  "#领导": ["leadership"],
  "#叙事": ["story"],
  "#审美": ["aesthetic", "spatialThinking"],
  "#创意": ["story", "craft"],
  "#体能": ["fitness"],
  "#压力": ["stressManagement"],
  "#习惯": ["habit"],
};

export const getSkillById = (id) => SKILL_DEFINITIONS[id];
export const getSkillsByCategory = (category) =>
  Object.values(SKILL_DEFINITIONS).filter((s) => s.category === category);
export const getSkillsByTag = (tag) =>
  (SKILL_TAG_INDEX[tag] || []).map((id) => SKILL_DEFINITIONS[id]);
export const getSkillsByIndustry = (industry) =>
  Object.values(SKILL_DEFINITIONS).filter((s) =>
    s.linkedIndustries?.includes(industry)
  );
