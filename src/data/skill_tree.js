export const SKILL_TREE = {
    academic: {
        name: "学术",
        skills: [
            { id: "logic", name: "逻辑思维", max: 3, effect: "学习收益 +" },
            { id: "research", name: "研究方法", max: 3, effect: "任务效率 +" },
            { id: "foundation", name: "基础学科", max: 3, effect: "知识储备 +" }
        ]
    },
    career: {
        name: "职场",
        skills: [
            { id: "execution", name: "执行力", max: 3, effect: "工作收益 +" },
            { id: "planning", name: "项目管理", max: 3, effect: "稳定性 +" },
            { id: "insight", name: "行业洞察", max: 3, effect: "金钱收益 +" }
        ]
    },
    social: {
        name: "社交",
        skills: [
            { id: "communication", name: "沟通表达", max: 3, effect: "社交收益 +", tags: ["#表达", "#共情"] },
            { id: "trust", name: "信任维护", max: 3, effect: "关系稳定 +", tags: ["#长期主义", "#人脉"] },
            { id: "leadership", name: "领导力", max: 3, effect: "任务奖励 +", tags: ["#管理", "#魄力"] }
        ]
    },
    creative: {
        name: "创作",
        skills: [
            { id: "story", name: "叙事表达", max: 3, effect: "灵感收益 +", tags: ["#表达", "#结构"] },
            { id: "aesthetic", name: "视觉审美", max: 3, effect: "创作收益 +", tags: ["#审美", "#感性"] },
            { id: "craft", name: "创意实践", max: 3, effect: "完成质量 +", tags: ["#动手", "#专注"] }
        ]
    },
    health: {
        name: "健康",
        skills: [
            { id: "fitness", name: "体能管理", max: 3, effect: "健康上限 +" },
            { id: "stress", name: "压力调节", max: 3, effect: "情绪稳定 +" },
            { id: "habit", name: "生活习惯", max: 3, effect: "恢复效率 +" }
        ]
    }
};
