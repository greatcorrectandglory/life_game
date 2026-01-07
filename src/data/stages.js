export const CHAPTERS = [
  {
    id: "primary",
    name: "童年期",
    turns: 15,
    ageRange: [6, 12],
    description: "建立基础习惯，探索兴趣",
    focusAreas: ["health", "mood", "basic_learning"],
    availableZones: ["study", "exercise", "rest", "passive_ent"],
    challenges: ["exam"],
    unlockIndustry: false,
    economyActive: false,
  },
  {
    id: "middle",
    name: "初中期",
    turns: 15,
    ageRange: [12, 15],
    description: "方法形成，社交启蒙",
    focusAreas: ["knowledge", "social", "self_discovery"],
    availableZones: ["study", "exercise", "social", "active_leisure", "passive_ent", "rest"],
    challenges: ["exam", "competition"],
    unlockIndustry: false,
    economyActive: false,
  },
  {
    id: "high",
    name: "高中期",
    turns: 15,
    ageRange: [15, 18],
    description: "目标聚焦，压力考验",
    focusAreas: ["knowledge", "skill", "stress_management"],
    availableZones: ["study", "exercise", "social", "create", "rest"],
    challenges: ["exam", "competition", "debate"],
    unlockIndustry: false,
    economyActive: false,
  },
  {
    id: "college",
    name: "大学期",
    turns: 15,
    ageRange: [18, 22],
    description: "能力沉淀，方向选择",
    focusAreas: ["skill", "creativity", "social", "career_prep"],
    availableZones: ["study", "exercise", "social", "create", "work", "active_leisure", "rest"],
    challenges: ["exam", "competition", "interview"],
    unlockIndustry: true,
    economyActive: false,
  },
  {
    id: "career",
    name: "职场期",
    turns: 15,
    ageRange: [22, 35],
    description: "资本积累，职业发展",
    focusAreas: ["money", "skill", "social", "career_growth"],
    availableZones: ["work", "social", "create", "exercise", "active_leisure", "rest"],
    challenges: ["interview", "competition", "crisis"],
    unlockIndustry: true,
    economyActive: true,
    industryRisk: "medium",
  },
  {
    id: "midlife",
    name: "中年期",
    turns: 15,
    ageRange: [35, 50],
    description: "韧性重构，价值平衡",
    focusAreas: ["health", "social", "resilience", "legacy"],
    availableZones: ["work", "social", "create", "exercise", "rest"],
    challenges: ["crisis", "competition"],
    unlockIndustry: true,
    economyActive: true,
    industryRisk: "high",
  },
  {
    id: "late",
    name: "晚年期",
    turns: 15,
    ageRange: [50, 65],
    description: "回响遗产，经验传承",
    focusAreas: ["health", "social", "legacy", "reflection"],
    availableZones: ["social", "create", "rest", "active_leisure"],
    challenges: ["crisis"],
    unlockIndustry: false,
    economyActive: true,
    industryRisk: "low",
  },
];

export const TOTAL_TURNS = CHAPTERS.reduce((sum, ch) => sum + ch.turns, 0);

export const STAGE_PROMPTS = {
  primary: "你的童年在探索中度过。学会了基本的生活技能，也开始对这个世界产生好奇。",
  middle: "进入青春期，你开始寻找自己的学习方法，也第一次体会到社交的复杂。",
  high: "高考的压力让你不得不做出选择。是随波逐流，还是走自己的路？",
  college: "大学是一个自由的试验场。你可以深耕专业，也可以广泛探索。选择权在你手中。",
  career: "踏入社会，你开始积累真正的资本——不仅是金钱，还有技能、人脉和声望。",
  midlife: "中年危机？或许是重新定义自己的机会。健康和关系变得比以往更重要。",
  late: "回望走过的路，你积累的经验和智慧开始发光。是时候思考留下什么了。",
};

export const CHAPTER_EVENTS = {
  primary: {
    dilemmaPool: ["playground_bully", "homework_cheat", "first_friend"],
    blackSwanPool: ["family_change", "early_talent", "health_scare"],
  },
  middle: {
    dilemmaPool: ["peer_pressure", "first_crush", "study_method", "dilemma_senior"],
    blackSwanPool: ["family_crisis", "mentor_appear", "social_shift"],
  },
  high: {
    dilemmaPool: ["college_choice", "burnout", "relationship", "dilemma_plagiarism"],
    blackSwanPool: ["policy_change", "competition_win", "health_warning"],
  },
  college: {
    dilemmaPool: ["internship_dilemma", "career_vs_passion", "academic_integrity"],
    blackSwanPool: ["startup_chance", "industry_boom", "relationship_crisis"],
  },
  career: {
    dilemmaPool: ["dilemma_overtime", "office_politics", "side_business", "ethical_choice"],
    blackSwanPool: ["industry_collapse", "promotion_chance", "investment_opportunity"],
  },
  midlife: {
    dilemmaPool: ["midlife_crisis", "family_vs_career", "health_warning", "legacy_choice"],
    blackSwanPool: ["career_pivot", "health_crisis", "unexpected_windfall"],
  },
  late: {
    dilemmaPool: ["retirement", "legacy", "health_decline", "final_project"],
    blackSwanPool: ["late_success", "health_major", "family_reunion"],
  },
};

export const getChapterById = (id) => CHAPTERS.find((ch) => ch.id === id);
export const getChapterByIndex = (index) => CHAPTERS[index];
export const getCurrentAge = (chapter, chapterTurn) => {
  const ch = CHAPTERS[chapter];
  if (!ch) return 6;
  const [startAge, endAge] = ch.ageRange;
  const progress = chapterTurn / ch.turns;
  return Math.floor(startAge + (endAge - startAge) * progress);
};
