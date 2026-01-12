# 可玩性提升方案

## ❌ 核心问题与影响

| 问题 | 现状表现 | 对可玩性的影响 |
| --- | --- | --- |
| 反馈循环弱 | 行动结果只有数值变化，缺乏情感冲击 | 玩家感受不到选择的“重量” |
| 重复感强 | 同一阶段只有 3-4 种敌人，任务只有 2 个支线 | 很快感到无聊 |
| 叙事碎片化 | STORY_CHAINS 配置为空，剧情链未实现 | 缺乏沉浸叙事 |
| 战斗过于简单 | 攻击/防御/逃跑，技能系统存在但不丰富 | 战斗缺乏策略深度 |
| 缺乏长期目标牵引 | 任务系统简单，没有“人生成就”系统 | 动力不足 |
| 社交系统缺失 | NPC 数据存在但未被利用 | 缺乏人际关系维度 |

## 🚀 具体改进建议

### 1. 丰富叙事体验 - 实现剧情链 (高优先级)

目前 `STORY_CHAINS` 为空，建议为每个人生阶段添加 3-5 个剧情事件。

```javascript
// src/data/quests.js - 示例扩展
export const STORY_CHAINS = {
  primary: {
    steps: [
      { turn: 3, event: "first_day_school", text: "第一天上学的紧张感..." },
      { turn: 8, event: "summer_vacation", text: "暑假的自由和迷茫..." },
    ]
  },
  high: {
    steps: [
      { turn: 5, event: "first_love", text: "心动的感觉悄然来袭..." },
      { turn: 15, event: "college_decision", text: "高考志愿，人生分叉路口..." },
    ]
  },
  // ...
};
```

### 2. 增加关系系统 (高优先级)

现有 `npcs.js` 已存在，但未被游戏使用。建议实现：

- 好感度系统：与 NPC 互动积累好感
- 关系事件：达到阈值触发特殊剧情
- 人脉影响：职场阶段的人脉直接影响行业崩溃时的生存率

```javascript
// 建议新增: src/systems/relationships.js
export const RELATIONSHIP_EVENTS = {
  mentor: [
    { threshold: 50, event: "mentor_guidance", effect: { skillBoost: 2 } },
    { threshold: 80, event: "mentor_legacy", effect: { trait: "传承者" } },
  ],
  // ...
};
```

### 3. 扩展道德困境库 (中优先级)

目前只有 3 个困境，建议扩展到每阶段 2-3 个，共 15+ 个。

| 人生阶段 | 建议添加的困境 |
| --- | --- |
| 小学 | “告状还是沉默”、“考试作弊的诱惑” |
| 高中 | “恋爱 vs 学业”、“补课 vs 自学” |
| 职场 | “跳槽 vs 忠诚”、“揭发领导腐败” |
| 中年 | “创业冒险 vs 安稳养家” |

### 4. 战斗系统策略化 (中优先级)

当前技能只有攻击/防御/逃跑。建议：

- 元素克制：如“理性”克“焦虑”，“社交”克“孤独”
- 连击系统：连续正确决策触发“心流连击”
- 特殊技能：基于玩家培养的技能解锁战斗能力

```javascript
// 示例: 技能影响战斗
const combatBonus = (playerStats, enemy) => {
  if (enemy.type === "social" && playerStats.social > 15) {
    return { atkBonus: 5, desc: "你的社交能力让你更容易化解矛盾" };
  }
  // ...
};
```

### 5. 成就与里程碑系统 (高优先级)

建议实现真正的成就系统：

```javascript
// 建议新增: src/data/achievements.js
export const ACHIEVEMENTS = [
  { id: "bookworm", name: "书虫", desc: "累计学习 100 次", icon: "📚", check: s => s.actionCounts.study >= 100 },
  { id: "survivor", name: "反脆弱者", desc: "经历 5 次黑天鹅后仍保持健康 > 10", icon: "💪", check: s => s.blackSwanSurvived >= 5 && s.stats.health > 10 },
  { id: "mentor_legacy", name: "薪火相传", desc: "晚年阶段传授技能给 3 个 NPC", icon: "🕯️", check: s => s.mentorCount >= 3 },
];
```

### 6. 视觉反馈与动效 (低优先级但体验提升大)

已有 `action_anim.js`，可进一步增强：

- 压力爆发特效：屏幕震动、红色闪烁
- 升华特效：金光特效、音效
- 季节/时间变化：不同阶段的背景视觉变化

### 7. 重玩价值 - 分支结局系统

建议添加 8 种以上结局：

| 结局类型 | 触发条件 |
| --- | --- |
| 🏆 传奇人生 | 财富 > 50000 + 声望 > 50 + 健康 > 15 |
| 📚 学者之路 | 知识 > 50 + 创造力 > 30 |
| 💔 中年危机 | 中年阶段压力爆表 + 健康 < 5 |
| 🌅 平凡幸福 | 均衡发展但无突出项 |
| 🎲 反脆弱者 | 经历 3+ 次重大危机并存活 |

## 📋 推荐实施优先级

### 第一阶段 (增加核心内容)
- 扩展困境库至 15 个
- 实现剧情链系统
- 添加更多敌人/挑战变体

### 第二阶段 (系统深化)
- 实现关系系统
- 成就系统
- 分支结局

### 第三阶段 (体验打磨)
- 战斗策略化
- 视觉反馈增强
- 音效系统
