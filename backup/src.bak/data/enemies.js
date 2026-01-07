/**
 * 敌人/挑战数据
 * 每个人生阶段的"挑战"以敌人形式出现
 */

export const ENEMIES = {
    // 小学期挑战
    primary: [
        {
            id: 'exam_anxiety',
            name: '考试焦虑',
            desc: '期末考试的压力让你喘不过气',
            hp: 25,
            atk: 6,
            def: 2,
            reward: { mood: 3, knowledge: 2 }
        },
        {
            id: 'bully_fear',
            name: '校园欺凌恐惧',
            desc: '来自高年级的欺负',
            hp: 30,
            atk: 8,
            def: 3,
            reward: { mood: 2, social: 2 }
        },
        {
            id: 'homework_mountain',
            name: '作业堆积',
            desc: '永远写不完的作业',
            hp: 20,
            atk: 5,
            def: 1,
            reward: { knowledge: 3, skill: 1 }
        }
    ],

    // 初中期挑战
    middle: [
        {
            id: 'peer_pressure',
            name: '同伴压力',
            desc: '融入群体的焦虑',
            hp: 40,
            atk: 10,
            def: 5,
            reward: { social: 3, mood: 2 }
        },
        {
            id: 'grade_competition',
            name: '成绩竞争',
            desc: '班级排名带来的压力',
            hp: 45,
            atk: 12,
            def: 4,
            reward: { knowledge: 4, skill: 2 }
        },
        {
            id: 'identity_crisis',
            name: '身份迷茫',
            desc: '我是谁？我要成为什么样的人？',
            hp: 35,
            atk: 8,
            def: 6,
            reward: { mood: 4, creativity: 2 }
        }
    ],

    // 高中期挑战
    high: [
        {
            id: 'gaokao_pressure',
            name: '高考压力',
            desc: '人生的第一个重大关卡',
            hp: 60,
            atk: 15,
            def: 8,
            reward: { knowledge: 5, skill: 3, skillPoints: 1 }
        },
        {
            id: 'sleep_deprivation',
            name: '熬夜疲惫',
            desc: '长期睡眠不足的累积',
            hp: 50,
            atk: 12,
            def: 4,
            reward: { health: 3, mood: 2 }
        },
        {
            id: 'future_anxiety',
            name: '未来焦虑',
            desc: '对大学和未来的迷茫',
            hp: 55,
            atk: 14,
            def: 6,
            reward: { mood: 4, skill: 2 }
        }
    ],

    // 大学期挑战
    college: [
        {
            id: 'academic_struggle',
            name: '挂科危机',
            desc: '大学课程的难度超出预期',
            hp: 70,
            atk: 16,
            def: 8,
            reward: { knowledge: 5, skill: 3 }
        },
        {
            id: 'social_isolation',
            name: '社交孤立',
            desc: '在新环境中难以建立关系',
            hp: 60,
            atk: 12,
            def: 10,
            reward: { social: 5, mood: 3 }
        },
        {
            id: 'internship_rejection',
            name: '实习被拒',
            desc: '一次次面试失败',
            hp: 65,
            atk: 14,
            def: 7,
            reward: { skill: 4, money: 2 }
        }
    ],

    // 职场期挑战
    career: [
        {
            id: 'workplace_politics',
            name: '职场政治',
            desc: '复杂的办公室关系',
            hp: 90,
            atk: 20,
            def: 12,
            reward: { social: 5, skill: 3, money: 3 }
        },
        {
            id: 'deadline_crunch',
            name: '死线压力',
            desc: '永远赶不完的项目',
            hp: 80,
            atk: 18,
            def: 8,
            reward: { skill: 5, money: 4 }
        },
        {
            id: 'imposter_syndrome',
            name: '冒充者综合征',
            desc: '我真的配得上这份工作吗？',
            hp: 75,
            atk: 15,
            def: 15,
            reward: { mood: 5, skill: 4 }
        }
    ],

    // 中年期挑战
    midlife: [
        {
            id: 'midlife_crisis',
            name: '中年危机',
            desc: '对人生意义的质疑',
            hp: 100,
            atk: 22,
            def: 14,
            reward: { mood: 6, creativity: 4, skillPoints: 1 }
        },
        {
            id: 'health_warning',
            name: '健康警报',
            desc: '身体开始发出信号',
            hp: 85,
            atk: 18,
            def: 10,
            reward: { health: 8, mood: 3 }
        },
        {
            id: 'financial_burden',
            name: '经济压力',
            desc: '房贷、子女教育、父母养老',
            hp: 95,
            atk: 20,
            def: 12,
            reward: { money: 8, skill: 3 }
        }
    ],

    // 晚年期挑战
    late: [
        {
            id: 'legacy_anxiety',
            name: '遗产焦虑',
            desc: '我留下了什么？',
            hp: 80,
            atk: 15,
            def: 18,
            reward: { creativity: 6, social: 4, skillPoints: 2 }
        },
        {
            id: 'loneliness',
            name: '孤独感',
            desc: '社交圈逐渐缩小',
            hp: 70,
            atk: 12,
            def: 15,
            reward: { social: 6, mood: 5 }
        },
        {
            id: 'meaning_search',
            name: '意义追寻',
            desc: '人生的终极问题',
            hp: 90,
            atk: 18,
            def: 20,
            reward: { mood: 8, creativity: 5, skillPoints: 2 }
        }
    ]
};

/**
 * 根据章节获取随机敌人
 */
export const getRandomEnemy = (chapterId) => {
    const pool = ENEMIES[chapterId] || ENEMIES.primary;
    const index = Math.floor(Math.random() * pool.length);
    return { ...pool[index] };
};

/**
 * 根据章节获取敌人列表
 */
export const getEnemiesForChapter = (chapterId) => {
    return ENEMIES[chapterId] || ENEMIES.primary;
};
