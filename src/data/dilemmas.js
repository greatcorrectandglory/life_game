
/**
 * 道德困境与分支抉择系统
 * 
 * 结构说明：
 * - id: 唯一标识
 * - title: 标题
 * - text: 描述文本
 * - options: 选项列表
 *   - text: 选项描述
 *   - immediate: 即时效果 (资源变化)
 *   - delayed: 延迟效果 (加入因果池/事件池)
 *   - risk: 风险概率 (可选)
 */

export const DILEMMAS = [
    {
        id: "dilemma_senior",
        trigger: "random_low_energy", // 触发条件示例
        title: "突发：倒地的老人",
        text: "回家的路上，你看到一位老人摔倒在路边，周围没有监控摄像头。此时你的精力已经见底。",
        options: [
            {
                id: "help",
                text: "直接扶起",
                desc: "不顾风险，伸出援手。",
                immediate: { energy: -1, mood: 2 },
                risk: {
                    chance: 0.3,
                    effect: { money: -500, mood: -4 },
                    effectText: "老人家人误会是你撞的，你赔了医药费。"
                },
                delayed: {
                    type: "karma",
                    value: "good_will",
                    magnitude: 1,
                    text: "你在心里种下了善意的种子。"
                }
            },
            {
                id: "record_help",
                text: "录像证据后扶起",
                desc: "保护自己，也帮助他人。",
                immediate: { energy: -2, mood: 1 },
                delayed: {
                    type: "trait",
                    value: "cautious",
                    text: "你变得更加谨慎，但也显得有些冷漠。"
                }
            },
            {
                id: "ignore",
                text: "匆忙离开",
                desc: "多一事不如少一事。",
                immediate: { stress: -1 },
                delayed: {
                    type: "karma",
                    value: "apathy",
                    magnitude: 1,
                    text: "你的冷漠可能在未来某种时刻回旋镖打到自己。"
                }
            }
        ]
    },
    {
        id: "dilemma_plagiarism",
        trigger: "school_project",
        title: "抉择：捷径的诱惑",
        text: "期末项目截稿在即，你发现了一份完美的开源代码，稍作修改就能拿高分，但这是抄袭。",
        options: [
            {
                id: "copy",
                text: "修改使用 (抄袭)",
                desc: "为了高分，通过图灵测试再说。",
                immediate: { skill: 0, knowledge: 0, academic: 5, stress: -2 }, // 分数高，压力小
                delayed: {
                    type: "risk_seed",
                    value: "integrity_scandal",
                    chance: 0.4, // 未来40%概率爆雷
                    text: "你埋下了一颗诚信危机的雷。"
                }
            },
            {
                id: "original",
                text: "坚持原创",
                desc: "可能会挂科，但问心无愧。",
                immediate: { skill: 3, energy: -3, stress: 2, academic: 2 }, // 分数可能一般
                delayed: {
                    type: "trait",
                    value: "integrity",
                    text: "你磨练了真实的能力，获得了[诚信]特质。"
                }
            }
        ]
    },
    {
        id: "dilemma_overtime",
        trigger: "career_crunch",
        title: "职场：无尽的加班",
        text: "老板暗示如果你这周连续通宵，升职机会就是你的。但你的身体已经发出了警告。",
        options: [
            {
                id: "push_limit",
                text: "拼了！通宵！",
                desc: "为了前途，透支身体。",
                immediate: { health: -4, money: 2, social: -1 },
                risk: {
                    chance: 0.2, // 20%概率直接进医院
                    effect: { health: -10, money: -5 },
                    effectText: "你突发急性肠胃炎住院，得不偿失。"
                },
                delayed: {
                    type: "career_boost",
                    value: 1,
                    text: "老板记住了你的拼命。"
                }
            },
            {
                id: "reject",
                text: "拒绝，回家睡觉",
                desc: "工作是为了生活，不是卖命。",
                immediate: { health: 2, mood: 2, money: 0 },
                delayed: {
                    type: "career_stagnation",
                    value: 1,
                    text: "你失去了这次晋升机会，但保留了革命本钱。"
                }
            }
        ]
    }
];

export const getDilemmaById = (id) => DILEMMAS.find(d => d.id === id);
