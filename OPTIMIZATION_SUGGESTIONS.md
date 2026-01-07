# 优化建议

## 1. 代码架构重构

### 问题
- main.js 有 2214 行，职责混乱，难以维护

### 建议
- 将 main.js 拆分为多个模块
- 采用 MVC/MVVM 模式，分离数据、视图、控制器
- 考虑引入轻量级框架如 Alpine.js 或 Vue.js

### 建议结构
```javascript
src/
├── core/
│   ├── engine.js        # 核心引擎
│   ├── state.js         # 状态管理
│   ├── gameLoop.js      # 游戏循环
│   └── director.js      # 事件导演
├── systems/
│   ├── energy.js        # 精力系统
│   ├── skills.js        # 技能系统
│   ├── economy.js       # 经济系统
│   └── events.js        # 事件系统
├── ui/
│   ├── components/      # UI组件
│   └── renderer.js      # 渲染器
└── data/
    └── config.js        # 配置数据
```

---

## 2. 性能优化

### 问题
- 每次状态变化通知所有监听器，可能造成不必要的渲染

### 建议
- 实现状态差异检测，只更新变化的 UI 部分
- 使用 CSS transform 替代频繁的 DOM 操作
- 将静态数据（如 ACTIONS、SKILL_TREE）提取到独立文件
- 考虑使用 Web Worker 处理复杂计算

---

## 3. 实现设计文档中的核心机制

### 问题
设计文档中的关键功能未实现

### 建议
- **认知吸收率矩阵**：不同活动根据信息熵和认知负荷有不同的吸收率
- **艾宾浩斯衰减**：技能需要间隔重复，否则会衰减
- **技能标签系统**：支持技能跨行业迁移
- **行业生命周期**：完整的萌芽→成长→成熟→衰退循环

### 示例代码
```javascript
// 认知吸收率
const ENTROPY_RATES = {
  low_entropy: { decay: 0.8, skillGain: 1.0, moodBoost: 3 },
  high_entropy: { decay: 0.2, skillGain: 2.5, stressBoost: 5 }
};

const applyLearning = (action, state) => {
  const entropy = actions[action.id].entropy;
  const rate = ENTROPY_RATES[entropy];
  // 根据信息熵应用不同的吸收率
};
```

---

## 4. 代码质量改进

### 问题
- 缺少类型检查、错误处理、测试

### 建议
- 迁移到 TypeScript（或至少使用 JSDoc）
- 添加错误边界和错误处理
- 编写单元测试（使用 Vitest 或 Jest）
- 添加 ESLint + Prettier 代码规范
- 移除魔法数字，使用常量定义

### TypeScript 类型定义示例
```typescript
interface GameState {
  chapterIndex: number;
  turn: number;
  energy: number;
  energyMax: number;
  stats: {
    health: number;
    mood: number;
    knowledge: number;
    // ...
  };
}

interface Action {
  id: string;
  name: string;
  cost: number;
  entropy?: 'low' | 'high';
  effects: Record<string, number>;
}
```

---

## 5. 用户体验优化

### 问题
- 缺少存档、教程、帮助等功能

### 建议
- 实现本地存储存档功能
- 添加新手引导系统
- 添加成就系统提示
- 优化移动端适配（响应式设计）
- 添加键盘快捷键支持

---

## 6. 功能完善

### 问题
很多设计文档中的机制未实现

### 建议
- **善缘池系统**：记录善行，后期获得回报
- **杠铃策略反馈**：在游戏结束时展示不同策略的收益曲线对比
- **阶段结算机制**：每 N 回合进行一次完整结算
- **获得池系统**：将即时收益改为池子积累，阶段结算时集中触发

---

## 7. 开发工具优化

### 建议
- 添加构建工具（Vite 或 esbuild）
- 配置热更新
- 添加调试模式（显示内部状态）
- 添加性能监控

---

## 8. 具体代码改进

### 8.1 优化状态管理
```javascript
// 当前代码：每次都通知所有监听器
const patchState = (partial) => {
  Object.assign(state, partial);
  notify(); // 可能导致不必要的渲染
};

// 优化：添加路径追踪
const patchState = (partial) => {
  const changedKeys = Object.keys(partial);
  Object.assign(state, partial);
  notify(changedKeys); // 只通知相关监听器
};
```

### 8.2 提取配置数据
```javascript
// 当前：配置数据混在 main.js 中
const ACTIONS = [...]; // 200+ 行
const SKILL_TREE = {...}; // 100+ 行

// 优化：提取到独立文件
// src/data/actions.js
export const ACTIONS = [...];

// src/data/skills.js
export const SKILL_TREE = {...};
```

### 8.3 添加错误处理
```javascript
// 当前：缺少错误处理
const updateEconomy = (state) => {
  const economy = state.economy;
  if (!economy) return; // 静默失败
  // ...
};

// 优化：添加错误处理和日志
const updateEconomy = (state) => {
  try {
    const economy = state.economy;
    if (!economy) {
      logger.warn('Economy state not found', { state });
      return;
    }
    // ...
  } catch (error) {
    logger.error('Failed to update economy', { error, state });
    throw error;
  }
};
```

---

## 9. 优先级建议

### 高优先级
1. 拆分 main.js
2. 提取配置数据
3. 添加类型检查（JSDoc/TS）
4. 实现存档功能

### 中优先级
1. 实现认知吸收率机制
2. 添加错误处理
3. 优化状态更新机制
4. 添加单元测试

### 低优先级
1. 迁移到 TypeScript
2. 添加构建工具
3. 性能优化
4. 完整实现所有设计文档功能

---

## 10. 设计文档未实现功能清单

### 2. 生物经济模型
- [ ] 认知吸收率矩阵（信息熵 × 认知负荷）
- [ ] 艾宾浩斯衰减与间隔重复算法
- [ ] 技能迁移与元认知系统
- [ ] 天赋点数对成长凸性阈值的影响

### 3. 宏观模拟系统
- [ ] 行业生命周期引擎（萌芽/成长/成熟/衰退）
- [ ] 黑天鹅事件生成器（AI 命运导演）
- [ ] 动态难度调整（DDA）

### 4. 混沌引擎
- [ ] 扶老头等社会契约事件的决策树
- [ ] 蝴蝶效应机制（善缘池）
- [ ] 非对称风险收益模型

### 5. 心理物理学
- [ ] 压力的良性/恶性双属性
- [ ] 决心判定（崩溃 vs 升华）
- [ ] 创伤后成长机制

### 6. 战略博弈
- [ ] 杠铃策略配置反馈
- [ ] 香农恶魔波动收割
- [ ] 收益曲线对比展示

### 7. 技术架构
- [ ] 标签化技能系统
- [ ] 蒙特卡洛平衡性测试
- [ ] 数据持久化与存档系统

---

## 当前项目状态

- **代码行数**: main.js 2214 行
- **模块化程度**: 较低，大量代码集中在 main.js
- **测试覆盖**: 无测试
- **类型安全**: 无类型检查
- **错误处理**: 部分缺失
- **文档**: 有详细的设计文档，但实现度较低
