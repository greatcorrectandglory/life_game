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
  primary: {
    title: "启蒙时刻",
    steps: [
      {
        turn: 2,
        text: "第一天上学，你紧紧抓住书包带，看着陌生的教室和同学。下课铃响起时，你松了口气。",
        objectives: [{ type: "action", key: "study", target: 1 }],
        reward: { knowledge: 1, mood: 1 },
      },
      {
        turn: 4,
        text: "操场上，你第一次跑完800米。气喘吁吁时，你意识到——坚持比想象中简单。",
        objectives: [{ type: "action", key: "exercise", target: 2 }],
        reward: { health: 2, grit: 1 },
      },
      {
        turn: 6,
        text: "同学带了新玩具来学校，你很想加入。他们邀请你时，你第一次体会到被接纳的感觉。",
        objectives: [{ type: "action", key: "social", target: 2 }],
        reward: { social: 2, mood: 2 },
      },
      {
        turn: 9,
        text: "数学考试你只考了60分。回家路上看着卷子，你第一次感到'我可能不够聪明'的恐惧。",
        objectives: [{ type: "stat", key: "knowledge", target: 4 }],
        reward: { stress: 5, focus: 1 },
      },
      {
        turn: 12,
        text: "老师在全班面前表扬了你的进步。你低着头，脸颊发烫，却在心里暗暗决定——继续努力。",
        objectives: [{ type: "stat", key: "mood", target: 10 }],
        reward: { focus: 2, mood: 2, reputation: 1 },
      },
      {
        turn: 14,
        text: "暑假的最后一天，你翻开新学期的课本。窗外的蝉鸣渐渐远去，你感到时间的流逝。",
        objectives: [{ type: "action", key: "rest", target: 1 }],
        reward: { mood: 2, stress: -3 },
      },
    ],
  },
  middle: {
    title: "同伴与方法",
    steps: [
      {
        turn: 2,
        text: "身体开始变化，你突然意识到自己和别人的眼光。镜子里的自己变得陌生又敏感。",
        objectives: [{ type: "stat", key: "mood", target: 8 }],
        reward: { stress: 3, focus: 1 },
      },
      {
        turn: 5,
        text: "你和朋友组队完成了小组作业。讨论到深夜时,你第一次感到'被需要'的价值感。",
        objectives: [{ type: "action", key: "social", target: 2 }],
        reward: { social: 2, mood: 2, karma: 1 },
      },
      {
        turn: 7,
        text: "班里最受欢迎的同学转学了。你看着空空的座位,感受到关系的脆弱和珍贵。",
        objectives: [{ type: "action", key: "rest", target: 1 }],
        reward: { mood: -2, social: 1 },
      },
      {
        turn: 10,
        text: "第一次和父母顶嘴后,你躲在房间里。心里既愧疚又委屈——为什么他们不能理解我?",
        objectives: [{ type: "stat", key: "stress", target: 15 }],
        reward: { stress: 5, fragility: 2 },
      },
      {
        turn: 12,
        text: "你开始用笔记本记录学习方法,效率明显提升。原来掌控感就藏在这些小细节里。",
        objectives: [{ type: "action", key: "study", target: 3 }],
        reward: { knowledge: 3, focus: 2 },
      },
      {
        turn: 14,
        text: "同桌因为家庭原因情绪崩溃,你第一次主动递纸巾安慰。那一刻,你感到自己长大了。",
        objectives: [{ type: "stat", key: "social", target: 4 }],
        reward: { karma: 2, mood: 1, social: 1 },
      },
    ],
  },
  high: {
    title: "路线抉择",
    steps: [
      {
        turn: 3,
        text: "高一刚开学,你发现竞争比想象中激烈。排名榜上密密麻麻的名字,你的在中游晃荡。",
        objectives: [{ type: "stat", key: "knowledge", target: 8 }],
        reward: { stress: 5, focus: 1 },
      },
      {
        turn: 6,
        text: "某天放学路上,心动的感觉悄然袭来。你开始关注TA的座位、声音、笑容...然后纠结该不该表白。",
        objectives: [{ type: "action", key: "social", target: 2 }],
        reward: { mood: 3, stress: 5 },
      },
      {
        turn: 9,
        text: "高二模拟考你考砸了。看着成绩单,你第一次意识到——高考不是说说而已,而是真实的战争。",
        objectives: [{ type: "stat", key: "knowledge", target: 12 }],
        reward: { stress: 10, focus: 2, grit: 1 },
      },
      {
        turn: 11,
        text: "距离高考还有300天。教室后面的倒计时牌每天都在跳动,你感到时间像沙漏一样流逝。",
        objectives: [{ type: "stat", key: "focus", target: 10 }],
        reward: { stress: 8, grit: 2 },
      },
      {
        turn: 13,
        text: "填志愿的那天,你盯着电脑屏幕发呆。每一个选择都像人生的分叉路口——没有回头路。",
        objectives: [{ type: "action", key: "study", target: 5 }],
        reward: { skill: 2, stress: 5 },
      },
      {
        turn: 15,
        text: "高考结束,你走出考场。阳光刺眼,你不知道该哭还是笑,只是感到——某个阶段真的结束了。",
        objectives: [{ type: "stat", key: "mood", target: 8 }],
        reward: { mood: 3, stress: -10, grit: 3 },
      },
    ],
  },
  college: {
    title: "能力试炼",
    steps: [
      {
        turn: 2,
        text: "大一军训结束,你坐在宿舍床上,看着陌生的室友。这是第一次真正离开家,自由与孤独同时涌来。",
        objectives: [{ type: "action", key: "social", target: 1 }],
        reward: { social: 1, mood: -1, stress: 3 },
      },
      {
        turn: 5,
        text: "社团面试你被刷了下来。走出教室时,你怀疑——我真的有什么特长吗?我擅长什么?",
        objectives: [{ type: "stat", key: "skill", target: 5 }],
        reward: { stress: 5, fragility: 1 },
      },
      {
        turn: 7,
        text: "跨学科小组合作,你负责的部分卡住了。深夜求助学长时,你体会到——协作比单打独斗强大得多。",
        objectives: [{ type: "action", key: "social", target: 3 }],
        reward: { social: 3, knowledge: 2, karma: 1 },
      },
      {
        turn: 10,
        text: "你熬夜完成了第一个像样的作品。虽然粗糙,但提交的那一刻,你感到——这是真正属于我的东西。",
        objectives: [{ type: "action", key: "create", target: 2 }],
        reward: { creativity: 3, mood: 3, reputation: 1 },
      },
      {
        turn: 12,
        text: "暑期实习面试失败了5次。你开始怀疑大学学的东西是否真的有用,还是只是纸上谈兵?",
        objectives: [{ type: "stat", key: "skill", target: 12 }],
        reward: { stress: 10, grit: 2 },
      },
      {
        turn: 14,
        text: "毕业前夕,你和室友在天台喝酒聊天。大家都在谈未来规划,你却突然感到迷茫——我想要什么样的人生?",
        objectives: [{ type: "stat", key: "creativity", target: 10 }],
        reward: { mood: -2, stress: 8, focus: 2 },
      },
    ],
  },
  career: {
    title: "现实试炼",
    steps: [
      {
        turn: 2,
        text: "第一份工资到账,你盯着手机短信发呆。数字比想象中少,但那是你真正用时间和劳动换来的。",
        objectives: [{ type: "stat", key: "money", target: 1000 }],
        reward: { money: 500, mood: 2 },
      },
      {
        turn: 5,
        text: "凌晨两点,你还在加班。办公室只剩你一人,咖啡已经凉了。你开始理解'打工人'这个词的重量。",
        objectives: [{ type: "action", key: "work", target: 3 }],
        reward: { skill: 2, stress: 10, money: 800 },
      },
      {
        turn: 7,
        text: "你的方案在会议上被否定。回到工位时,你怀疑——我是不是不适合这行?还是我还不够努力?",
        objectives: [{ type: "stat", key: "skill", target: 15 }],
        reward: { stress: 8, grit: 2, fragility: 1 },
      },
      {
        turn: 9,
        text: "一个老同事主动帮你引荐了重要客户。你突然意识到——稳定的关系网络真的能改变命运。",
        objectives: [{ type: "stat", key: "social", target: 10 }],
        reward: { reputation: 2, karma: 1, money: 1000 },
      },
      {
        turn: 11,
        text: "升职竞争你输了,对方是领导的亲戚。你攥着拳头,第一次体会到——有些事不是努力就能改变的。",
        objectives: [{ type: "stat", key: "reputation", target: 15 }],
        reward: { stress: 15, fragility: 3, grit: 2 },
      },
      {
        turn: 13,
        text: "行业寒冬,公司开始裁员。你每天看着工位一个个空下来,感到不确定性像乌云一样笼罩。",
        objectives: [{ type: "action", key: "work", target: 4 }],
        reward: { stress: 12, money: 1500, grit: 3 },
      },
    ],
  },
  midlife: {
    title: "韧性重构",
    steps: [
      {
        turn: 3,
        text: "体检报告上出现了几个箭头。医生说'注意休息',你苦笑——什么时候身体也开始背叛自己了?",
        objectives: [{ type: "stat", key: "health", target: 12 }],
        reward: { stress: 10, health: -2 },
      },
      {
        turn: 6,
        text: "孩子的学费账单、父母的医药费、房贷...你盯着账户余额,感到责任的重量压在肩上。",
        objectives: [{ type: "stat", key: "money", target: 8000 }],
        reward: { stress: 15, grit: 2 },
      },
      {
        turn: 8,
        text: "你开始重新规划生活节奏:早睡、运动、冥想。身体慢慢恢复时,你感到——掌控感正在回来。",
        objectives: [{ type: "stat", key: "health", target: 14 }],
        reward: { health: 3, stress: -5, mood: 2 },
      },
      {
        turn: 10,
        text: "公司年轻人越来越多,你的经验开始被质疑'过时'。你不知道该坚守还是改变,焦虑感蔓延。",
        objectives: [{ type: "action", key: "work", target: 3 }],
        reward: { stress: 12, fragility: 2, skill: 2 },
      },
      {
        turn: 12,
        text: "深夜,你和老友聊起中年危机。他说'我们都在学着接受平凡',你沉默了——我真的甘心吗?",
        objectives: [{ type: "stat", key: "mood", target: 12 }],
        reward: { mood: -2, stress: 5, grit: 3 },
      },
      {
        turn: 14,
        text: "你决定承担更多团队责任,带新人、分享经验。那一刻你意识到——价值不只是产出,还有传承。",
        objectives: [{ type: "action", key: "social", target: 4 }],
        reward: { reputation: 3, karma: 2, mood: 3 },
      },
    ],
  },
  late: {
    title: "回响与遗产",
    steps: [
      {
        turn: 2,
        text: "退休那天,你清空工位。同事们说'保重',你走出办公楼,突然不知道明天该做什么——失落与解脱交织。",
        objectives: [{ type: "stat", key: "mood", target: 10 }],
        reward: { mood: -3, stress: -10 },
      },
      {
        turn: 5,
        text: "你开始整理自己的笔记、作品、经验。希望留下些什么,让后来的人少走些弯路。",
        objectives: [{ type: "action", key: "create", target: 2 }],
        reward: { creativity: 2, reputation: 2, karma: 1 },
      },
      {
        turn: 7,
        text: "社区里的年轻人主动请教你。分享经验时,你看到他们眼中的光——原来我的故事还能照亮别人。",
        objectives: [{ type: "stat", key: "social", target: 14 }],
        reward: { karma: 3, mood: 3, reputation: 2 },
      },
      {
        turn: 10,
        text: "老友聚会,你们聊起年轻时的梦想。有人实现了,有人妥协了,但每个人都笑着说'不后悔'。",
        objectives: [{ type: "action", key: "social", target: 3 }],
        reward: { mood: 3, stress: -5 },
      },
      {
        turn: 12,
        text: "你帮助的年轻人成功了,他专程来感谢你。你看着他,仿佛看到曾经的自己——人生在他人身上延续。",
        objectives: [{ type: "stat", key: "creativity", target: 12 }],
        reward: { mood: 4, reputation: 3, karma: 3 },
      },
      {
        turn: 14,
        text: "夕阳下,你坐在公园长椅上回顾一生。有遗憾,有骄傲,但更多是——感激。感激经历的一切。",
        objectives: [{ type: "stat", key: "mood", target: 15 }],
        reward: { mood: 5, stress: -10, reputation: 5 },
      },
    ],
  },
};
