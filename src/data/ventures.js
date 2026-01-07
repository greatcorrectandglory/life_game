
/**
 * 高风险副业 (High Risk Ventures) 系统
 * 
 * 结构说明：
 * - id: 唯一标识
 * - name: 副业名称
 * - desc: 描述
 * - cost: 每回合投入精力/金钱
 * - duration: 持续回合数
 * - volatility: 波动性 (影响结果方差)
 * - outcomes: 可能的结局
 */

export const VENTURES = [
    {
        id: "venture_indie_game",
        name: "独立游戏开发",
        type: "creative",
        desc: "利用业余时间开发一款独特的游戏。需要持续投入精力。",
        cost: { energy: 2 },
        duration: 6, // 需坚持6回合
        volatility: "high", // 极高波动
        outcomes: [
            { type: "hit", chance: 0.1, text: "爆款传世！", rewards: { money: 500, social: 50, trait: "legend_creator" } },
            { type: "success", chance: 0.3, text: "小有成就，回本了。", rewards: { money: 50, social: 10 } },
            { type: "fail", chance: 0.6, text: "无人问津，石沉大海。", rewards: { stress: 10, wisdom: 5 } } // 失败获得智慧(经验)
        ]
    },
    {
        id: "venture_crypto",
        name: "高风险投资",
        type: "financial",
        desc: "把你积蓄的一半投入新兴市场。",
        cost: { money_percent: 0.5 },
        duration: 3,
        volatility: "extreme",
        outcomes: [
            { type: "skyrocket", chance: 0.05, text: "财富自由！资产翻了10倍！", mult: 10 },
            { type: "boom", chance: 0.15, text: "行情不错，翻倍了。", mult: 2 },
            { type: "bust", chance: 0.8, text: "泡沫破裂，血本无归。", mult: 0 }
        ]
    }
];

export const getVentureById = (id) => VENTURES.find(v => v.id === id);
