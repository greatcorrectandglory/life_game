
/**
 * NPC 关系与互动系统
 * 
 * 结构说明：
 * - id: 唯一标识
 * - name: 姓名
 * - role: 角色 (导师/同伴/对手)
 * - desc: 描述
 * - affinity: 初始好感度 (-100 ~ 100)
 * - skills: NPC擅长的领域 (可请教)
 * - interactions: 特殊互动事件
 */

export const NPCS = [
    {
        id: "npc_mentor_li",
        name: "李教授",
        role: "mentor",
        desc: "严厉但富有智慧的学术导师。",
        affinity: 20,
        bonuses: { knowledge: 1.2 }, // 好感度高时增加学习收益
        skills: ["logic", "research"],
        contacts: [
            { id: "ask_advice", label: "请教困惑", cost: 2, effect: { knowledge: 3, mood: -1 } },
            { id: "assist_research", label: "协助研究", cost: 3, effect: { skill: 4, affinity: 5 } }
        ]
    },
    {
        id: "npc_partner_zhang",
        name: "张小豪",
        role: "friend",
        desc: "充满活力的创业伙伴，虽然有点冲动。",
        affinity: 50,
        bonuses: { mood: 1.1 }, // 好感度高时恢复效率提升
        skills: ["communication", "execution"],
        contacts: [
            { id: "hang_out", label: "出去撸串", cost: 1, effect: { mood: 4, health: -1, affinity: 3 } },
            { id: "brainstorm", label: "头脑风暴", cost: 2, effect: { creativity: 3, affinity: 2 } }
        ]
    },
    {
        id: "npc_rival_wang",
        name: "王卷王",
        role: "rival",
        desc: "视你为最大竞争对手的同期生。",
        affinity: -10,
        bonuses: { stress: 1.1 }, // 存在感强会增加压力，但也增加动力
        skills: ["planning", "efficiency"],
        contacts: [
            { id: "compete", label: "发起挑战", cost: 3, effect: { skill: 5, stress: 3, affinity: -2 } },
            { id: "ignore", label: "无视嘲讽", cost: 0, effect: { mood: 1, stress: -1 } }
        ]
    }
];

export const getNPCById = (id) => NPCS.find(n => n.id === id);
