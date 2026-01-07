/**
 * 战斗技能数据
 * 基于现有技能树的战斗技能
 */

export const COMBAT_SKILLS = [
    // 学术类技能
    {
        id: 'logic_strike',
        name: '逻辑打击',
        desc: '用缜密的逻辑分析攻击敌人',
        cost: 8,
        damage: true,
        power: 1.6,
        requires: { logic: 1 }
    },
    {
        id: 'research_insight',
        name: '研究洞察',
        desc: '找出对方的弱点',
        cost: 12,
        damage: true,
        power: 2.0,
        requires: { research: 2 }
    },
    {
        id: 'knowledge_shield',
        name: '知识壁垒',
        desc: '用广博的知识构建防护',
        cost: 10,
        buff: { def: 5, duration: 3 },
        buffDesc: '防御提升',
        requires: { foundation: 1 }
    },

    // 职场类技能
    {
        id: 'execute_focus',
        name: '高效执行',
        desc: '集中精力快速行动',
        cost: 10,
        damage: true,
        power: 1.8,
        requires: { execution: 1 }
    },
    {
        id: 'project_plan',
        name: '项目规划',
        desc: '制定周密的行动计划',
        cost: 15,
        buff: { atk: 4, def: 2, duration: 3 },
        buffDesc: '攻防双提升',
        requires: { planning: 2 }
    },

    // 社交类技能
    {
        id: 'persuasion',
        name: '说服技巧',
        desc: '用言语动摇对方',
        cost: 8,
        damage: true,
        power: 1.4,
        debuff: { atk: -3, duration: 2 },
        requires: { communication: 1 }
    },
    {
        id: 'trust_bond',
        name: '信任纽带',
        desc: '召唤朋友的支持',
        cost: 12,
        heal: 20,
        requires: { trust: 1 }
    },
    {
        id: 'rally',
        name: '鼓舞士气',
        desc: '激励自己全力以赴',
        cost: 18,
        buff: { atk: 6, duration: 2 },
        buffDesc: '攻击大幅提升',
        requires: { leadership: 2 }
    },

    // 创作类技能
    {
        id: 'narrative_twist',
        name: '叙事反转',
        desc: '用故事的力量改变局面',
        cost: 14,
        damage: true,
        power: 1.7,
        heal: 10,
        requires: { story: 1 }
    },
    {
        id: 'aesthetic_burst',
        name: '审美冲击',
        desc: '用美学的力量震慑对方',
        cost: 16,
        damage: true,
        power: 2.2,
        requires: { aesthetic: 2 }
    },

    // 健康类技能
    {
        id: 'endurance',
        name: '耐力恢复',
        desc: '调动身体储备恢复体力',
        cost: 10,
        heal: 25,
        requires: { fitness: 1 }
    },
    {
        id: 'stress_release',
        name: '压力释放',
        desc: '将压力转化为力量',
        cost: 12,
        damage: true,
        power: 1.5,
        heal: 15,
        requires: { stress: 1 }
    },
    {
        id: 'second_wind',
        name: '回光返照',
        desc: '在危机时刻爆发潜能',
        cost: 20,
        damage: true,
        power: 2.5,
        buff: { atk: 3, duration: 1 },
        buffDesc: '下回合攻击提升',
        requires: { habit: 2 }
    },

    // 基础技能（无需求）
    {
        id: 'concentrate',
        name: '集中精神',
        desc: '深呼吸，恢复少量精力',
        cost: 0,
        heal: 8
    },
    {
        id: 'analyze',
        name: '冷静分析',
        desc: '分析局势，提升下次攻击',
        cost: 5,
        buff: { atk: 2, duration: 2 },
        buffDesc: '攻击小幅提升'
    }
];

/**
 * 获取玩家可用的战斗技能
 */
export const getAvailableSkills = (playerSkills) => {
    return COMBAT_SKILLS.filter(skill => {
        if (!skill.requires) return true;
        return Object.entries(skill.requires).every(([skillId, level]) => {
            return (playerSkills[skillId] || 0) >= level;
        });
    });
};

/**
 * 获取技能详情
 */
export const getSkillById = (id) => {
    return COMBAT_SKILLS.find(skill => skill.id === id);
};
