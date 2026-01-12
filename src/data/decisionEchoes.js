/**
 * 决策回响系统 - Decision Echoes
 *
 * 这个系统记录玩家的重要决策,并在未来的人生阶段触发回响事件
 * 体现"蝴蝶效应":过去的选择会以意想不到的方式影响未来
 *
 * 结构说明:
 * - sourceDecision: 源决策ID (困境选择的dilemmaId + optionId)
 * - triggerConditions: 触发条件
 *   - minTurnsAfter: 最少间隔回合数
 *   - minChapterAfter: 最少间隔章节数
 *   - requiredStats: 需要的属性条件
 *   - probability: 触发概率
 * - echo: 回响事件内容
 *   - title: 标题
 *   - text: 描述文本
 *   - effects: 属性效果
 *   - choices: 可选的后续选择
 */

export const DECISION_ECHOES = [
  // ========== 扶老人困境的回响 ==========
  {
    id: "echo_senior_help",
    sourceDecision: { dilemmaId: "dilemma_senior", optionId: "help" },
    triggerConditions: {
      minTurnsAfter: 20,
      minChapterAfter: 2,
      probability: 0.6,
    },
    echo: {
      title: "回响：善缘轮回",
      text: "地铁上,一个陌生人突然说'你还记得我吗?三年前你扶起了我父亲。'他递给你一张名片——他是某大公司的HR。'如果需要内推机会,随时联系我。'",
      effects: {
        social: 5,
        reputation: 3,
        karma: 2,
        mood: 3,
      },
      storyNote: "当年的善举,在多年后以意想不到的方式回报。",
    },
  },
  {
    id: "echo_senior_ignore",
    sourceDecision: { dilemmaId: "dilemma_senior", optionId: "ignore" },
    triggerConditions: {
      minTurnsAfter: 15,
      minChapterAfter: 1,
      probability: 0.5,
    },
    echo: {
      title: "回响：内疚的回旋镖",
      text: "深夜失眠,你突然想起多年前那个倒地的老人。如果当时帮了他,结局会不会不同?那天的选择像一根刺,时不时扎进心里。",
      effects: {
        mood: -3,
        stress: 5,
        fragility: 2,
      },
      storyNote: "冷漠的选择在心底留下了阴影。",
    },
  },
  {
    id: "echo_senior_record",
    sourceDecision: { dilemmaId: "dilemma_senior", optionId: "record_help" },
    triggerConditions: {
      minTurnsAfter: 10,
      probability: 0.4,
    },
    echo: {
      title: "回响:谨慎的代价",
      text: "朋友聚会时有人提起那次'录像扶老人'的事。大家沉默了一会儿,气氛有些尴尬。你意识到——过度的自我保护,也在疏远着真诚的关系。",
      effects: {
        social: -2,
        mood: -1,
      },
      storyNote: "谨慎保护了自己,但也建立了人际距离。",
    },
  },

  // ========== 抄袭困境的回响 ==========
  {
    id: "echo_plagiarism_copy",
    sourceDecision: { dilemmaId: "dilemma_plagiarism", optionId: "copy" },
    triggerConditions: {
      minTurnsAfter: 25,
      minChapterAfter: 2,
      requiredChapter: 4, // 职场期才触发
      probability: 0.4,
    },
    echo: {
      title: "回响：诚信危机爆雷",
      text: "公司背景调查发现你大学时期的学术不端记录。HR找你谈话:'我们很看重诚信,这件事可能会影响你的晋升。'那个当年的捷径,现在成了职业生涯的绊脚石。",
      effects: {
        reputation: -10,
        stress: 15,
        fragility: 5,
        money: -2000,
      },
      storyNote: "学生时代埋下的雷,在职场期爆炸。",
    },
  },
  {
    id: "echo_plagiarism_original",
    sourceDecision: { dilemmaId: "dilemma_plagiarism", optionId: "original" },
    triggerConditions: {
      minTurnsAfter: 20,
      minChapterAfter: 2,
      probability: 0.7,
    },
    echo: {
      title: "回响：能力的底气",
      text: "面试官问:'你能独立完成这个项目吗?'你毫不犹豫地说'可以'——因为大学时你真的练过。那些熬夜原创的经历,现在成了你最大的自信来源。",
      effects: {
        skill: 5,
        confidence: 3,
        reputation: 5,
        mood: 4,
      },
      storyNote: "真实的能力在关键时刻成为最大底气。",
    },
  },

  // ========== 加班困境的回响 ==========
  {
    id: "echo_overtime_push",
    sourceDecision: { dilemmaId: "dilemma_overtime", optionId: "push_limit" },
    triggerConditions: {
      minTurnsAfter: 15,
      minChapterAfter: 1,
      probability: 0.5,
    },
    echo: {
      title: "回响：透支的身体",
      text: "体检报告显示多项指标异常。医生说:'你这是长期高强度工作导致的。'你想起多年前那次拼命加班——那时的选择,现在要用健康偿还。",
      effects: {
        health: -5,
        stress: 10,
        mood: -3,
        money: -1000, // 医疗费
      },
      storyNote: "年轻时透支的身体,中年时要加倍偿还。",
    },
  },
  {
    id: "echo_overtime_reject",
    sourceDecision: { dilemmaId: "dilemma_overtime", optionId: "reject" },
    triggerConditions: {
      minTurnsAfter: 20,
      minChapterAfter: 2,
      probability: 0.6,
    },
    echo: {
      title: "回响：健康的红利",
      text: "同事们纷纷出现健康问题时,你依然精力充沛。当年拒绝过度加班的选择,现在看来是最明智的投资——健康才是最大的竞争力。",
      effects: {
        health: 3,
        mood: 4,
        grit: 3,
      },
      storyNote: "保护健康的选择在长期竞争中显现出优势。",
    },
  },

  // ========== 累积性回响 (需要多次相同选择) ==========
  {
    id: "echo_pattern_selfish",
    sourceDecision: {
      pattern: "selfish", // 模式匹配:多次冷漠/自私选择
      threshold: 3,       // 需要至少3次
    },
    triggerConditions: {
      minTurnsAfter: 30,
      minChapterAfter: 3,
      probability: 0.8,
    },
    echo: {
      title: "回响：孤独的代价",
      text: "你意识到通讯录里没有一个可以深夜倾诉的朋友。多年来的自我保护和冷漠,让你建起了坚固的墙——但也把温暖隔绝在外。",
      effects: {
        social: -10,
        mood: -5,
        stress: 10,
        fragility: 5,
      },
      choices: [
        {
          text: "试图改变",
          effects: { mood: 2, stress: -5 },
          resultText: "你决定主动联系老朋友,尝试重建关系。",
        },
        {
          text: "接受孤独",
          effects: { fragility: 3, grit: 2 },
          resultText: "你告诉自己'孤独也是一种力量'。",
        },
      ],
    },
  },
  {
    id: "echo_pattern_altruistic",
    sourceDecision: {
      pattern: "altruistic", // 模式匹配:多次善良/助人选择
      threshold: 3,
    },
    triggerConditions: {
      minTurnsAfter: 30,
      minChapterAfter: 3,
      probability: 0.7,
    },
    echo: {
      title: "回响：善意的网络",
      text: "你需要帮助时,意想不到地有很多人主动伸出援手。你突然意识到——这些年播下的善意种子,现在长成了一张互助的网络。",
      effects: {
        social: 10,
        karma: 5,
        mood: 5,
        reputation: 5,
      },
      storyNote: "多年的善举编织成一张安全网。",
    },
  },
  {
    id: "echo_pattern_integrity",
    sourceDecision: {
      pattern: "integrity", // 模式匹配:多次坚持原则
      threshold: 3,
    },
    triggerConditions: {
      minTurnsAfter: 35,
      minChapterAfter: 3,
      requiredChapter: 5, // 中年期
      probability: 0.8,
    },
    echo: {
      title: "回响：原则的复利",
      text: "年轻人问你:'在这个浮躁的时代,怎么坚持原则?'你想起那些艰难的选择——每一次都很痛苦,但现在回头看,正是这些选择塑造了今天的你。",
      effects: {
        reputation: 10,
        mood: 5,
        grit: 5,
        social: 5,
      },
      trait: "榜样",
      storyNote: "坚持原则的人生,在中年时获得尊重。",
    },
  },
];

/**
 * 根据源决策查找可能的回响事件
 * @param {string} dilemmaId - 困境ID
 * @param {string} optionId - 选项ID
 * @returns {Array} 可能的回响事件列表
 */
export const getEchoesForDecision = (dilemmaId, optionId) => {
  return DECISION_ECHOES.filter(
    (echo) =>
      echo.sourceDecision.dilemmaId === dilemmaId &&
      echo.sourceDecision.optionId === optionId
  );
};

/**
 * 根据决策模式查找回响事件
 * @param {string} pattern - 决策模式
 * @returns {Array} 可能的回响事件列表
 */
export const getEchoesForPattern = (pattern) => {
  return DECISION_ECHOES.filter(
    (echo) => echo.sourceDecision.pattern === pattern
  );
};
