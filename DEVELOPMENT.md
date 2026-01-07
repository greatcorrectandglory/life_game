# 开发指南

## 代码规范

### JavaScript 风格
- 使用 ES6+ 语法
- 优先使用 const/let，避免 var
- 函数命名使用 camelCase
- 常量命名使用 UPPER_SNAKE_CASE
- 类名使用 PascalCase

### 文件命名
- 模块文件：lowercase.js
- 组件文件：PascalCase.js（如 UI 组件）
- 配置文件：lowercase.js
- 工具文件：lowercase.js

### 注释规范
```javascript
/**
 * 函数描述
 * @param {Type} param1 - 参数说明
 * @param {Type} param2 - 参数说明
 * @returns {Type} 返回值说明
 */
const functionName = (param1, param2) => {
  // 实现
};
```

## 模块职责

### core/
- **enhancedState.js**: 响应式状态管理
- **engine.js**: 游戏引擎核心逻辑
- **combat.js**: 战斗系统
- **director.js**: 事件导演（黑天鹅）
- **economy.js**: 经济系统
- **gameLoop.js**: 游戏循环和回合管理

### systems/
- **cognitive.js**: 认知吸收率和学习系统
- **skills.js**: 技能升级和管理
- **events.js**: 事件触发和处理

### utils/
- **logger.js**: 日志系统
- **helpers.js**: 通用工具函数
- **saveSystem.js**: 存档系统

### data/
- **chapters.js**: 章节配置
- **actions.js**: 行动配置
- **skillsTree.js**: 技能树
- **events.js**: 事件数据
- **constants.js**: 常量定义
- **zones.js**: 地图区域

## 状态管理

### 基本使用
```javascript
import { getState, patchState, subscribe } from './src/core/enhancedState.js';

// 获取状态（只读）
const state = getState();

// 更新状态
patchState({
  energy: 5,
  stats: {
    health: 10,
    mood: 8
  }
});

// 订阅状态变化
const unsubscribe = subscribe((newState, changedPaths) => {
  console.log('State changed:', changedPaths);
});

// 取消订阅
unsubscribe();
```

### 路径订阅
```javascript
// 只订阅特定路径的变化
const unsubscribe = subscribe((state, paths) => {
  if (paths.includes('stats.health')) {
    console.log('Health changed');
  }
}, ['stats.health']);
```

### 嵌套路径更新
```javascript
import { updatePath, getPath } from './src/core/enhancedState.js';

// 更新嵌套路径
updatePath('stats.health', 10);

// 获取嵌套路径
const health = getPath('stats.health', 0);
```

## 日志系统

### 使用示例
```javascript
import { logger } from './src/utils/logger.js';

// 不同级别日志
logger.debug('Debug message', { data: 'value' });
logger.info('Info message');
logger.warn('Warning message');
logger.error('Error message', { error });

// 设置日志级别
logger.setLevel('debug'); // debug, info, warn, error
```

## 存档系统

### 使用示例
```javascript
import { saveSystem, autoSaveManager } from './src/utils/saveSystem.js';

// 手动存档
saveSystem.save(getState());

// 手动读档
const savedState = saveSystem.load();

// 检查存档是否存在
if (saveSystem.exists()) {
  const metadata = saveSystem.getMetadata();
  console.log('Last saved:', metadata);
}

// 导出存档
saveSystem.export();

// 自动存档
autoSaveManager.start(getState);
autoSaveManager.stop();
```

## 认知吸收率系统

### 使用示例
```javascript
import {
  applyEntropyRate,
  calculateActualEffects,
  getActionEntropyInfo
} from './src/systems/cognitive.js';

// 应用认知吸收率
const effects = applyEntropyRate(action, state);

// 计算实际收益（考虑衰减）
const actualEffects = calculateActualEffects(action, state);

// 获取吸收率信息（用于UI）
const info = getActionEntropyInfo(action);
console.log(info.label, info.description);
```

## 技能系统

### 使用示例
```javascript
import {
  getSkillTree,
  getSkillLevel,
  canUpgradeSkill,
  upgradeSkill,
  getSkillProgress
} from './src/systems/skills.js';

// 获取技能树
const tree = getSkillTree();

// 获取技能等级
const level = getSkillLevel('logic');

// 检查是否可升级
if (canUpgradeSkill('logic')) {
  upgradeSkill('logic');
}

// 获取进度
const progress = getSkillProgress('logic');
console.log(`${progress.current}/${progress.max} (${progress.percentage}%)`);
```

## 事件系统

### 使用示例
```javascript
import {
  triggerSwanEvent,
  resolveStress,
  recordGoodKarma,
  checkKarmaTrigger
} from './src/systems/events.js';

// 触发黑天鹅事件
const event = triggerSwanEvent();

// 解析压力
const result = resolveStress();

// 记录善缘
recordGoodKarma('help_old_man', 2);

// 检查善缘触发
const karmaEvent = checkKarmaTrigger();
```

## 测试

### 编写测试
```javascript
import { describe, it, expect } from 'vitest';
import { getState, patchState } from '../src/core/enhancedState.js';

describe('State Management', () => {
  it('should update state', () => {
    patchState({ energy: 5 });
    const state = getState();
    expect(state.energy).toBe(5);
  });
});
```

### 运行测试
```bash
npm test           # 运行所有测试
npm run test:ui    # UI 界面
```

## 调试技巧

### 导出状态
```javascript
import { exportState } from './src/core/enhancedState.js';

// 导出当前状态到文件
exportState();
```

### 监听器调试
```javascript
import { getListenerCount } from './src/core/enhancedState.js';

console.log('Active listeners:', getListenerCount());
```

### 日志级别
```javascript
// 开发环境设置 debug 级别
logger.setLevel('debug');

// 生产环境设置 info 级别
logger.setLevel('info');
```

## 性能优化

### 避免频繁渲染
```javascript
// 使用路径订阅减少不必要的更新
subscribe((state, paths) => {
  if (paths.some(p => p.startsWith('stats.'))) {
    updateStatsUI(state);
  }
}, ['stats.health', 'stats.mood']);
```

### 批量更新
```javascript
import { batchUpdate } from './src/core/enhancedState.js';

// 批量更新减少重复渲染
batchUpdate(state => {
  return {
    energy: 5,
    stats: {
      health: 10,
      mood: 8
    }
  };
});
```

## 常见问题

### Q: 如何添加新行动？
A: 在 `src/data/actions.js` 中添加新的行动配置。

### Q: 如何添加新事件？
A: 在 `src/data/events.js` 中添加事件配置。

### Q: 如何修改技能树？
A: 在 `src/data/skillsTree.js` 中修改技能配置。

### Q: 如何添加新章节？
A: 在 `src/data/chapters.js` 中添加章节和任务配置。

## 构建和部署

### 本地构建
```bash
npm run build
```

### 预览构建结果
```bash
npm run preview
```

### 部署到静态托管
构建后的文件在 `dist/` 目录，可直接部署到 GitHub Pages、Netlify、Vercel 等。
