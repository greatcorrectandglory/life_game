# 快速开始指南

## 环境要求

- Node.js 18+
- 现代浏览器（Chrome、Firefox、Safari、Edge）

## 安装步骤

### 1. 克隆项目
```bash
cd /mnt/d/test/life
```

### 2. 安装依赖
```bash
npm install
```

### 3. 启动开发服务器
```bash
npm run dev
```

浏览器会自动打开 http://localhost:3000

## 项目结构概览

### 新架构（优化后）
```
src/
├── core/              # 核心系统（引擎、状态、战斗等）
├── systems/           # 游戏系统（认知、技能、事件）
├── ui/                # UI 组件
├── data/              # 配置数据
└── utils/             # 工具函数（日志、存档等）
```

### 旧架构（已备份）
```
backup/
├── main.js.bak        # 原始入口文件（2214行）
└── src.bak/           # 原始源码目录
```

## 核心功能使用

### 状态管理
```javascript
import { getState, patchState } from './src/core/enhancedState.js';

// 获取当前状态
const state = getState();

// 更新状态
patchState({ energy: 5, stats: { health: 10 } });
```

### 存档系统
```javascript
import { saveSystem } from './src/utils/saveSystem.js';

// 保存游戏
saveSystem.save(getState());

// 读取游戏
const state = saveSystem.load();
```

### 认知吸收率
```javascript
import { calculateActualEffects } from './src/systems/cognitive.js';

// 计算实际收益（考虑吸收率和衰减）
const effects = calculateActualEffects(action, state);
```

### 技能系统
```javascript
import { upgradeSkill, getSkillLevel } from './src/systems/skills.js';

// 升级技能
upgradeSkill('logic');

// 获取技能等级
const level = getSkillLevel('logic');
```

## 开发命令

```bash
# 开发
npm run dev          # 启动开发服务器

# 构建
npm run build        # 构建生产版本
npm run preview      # 预览构建结果

# 测试
npm run test         # 运行测试
npm run test:ui      # 测试 UI 界面

# 代码质量
npm run lint         # 检查代码
npm run lint:fix     # 自动修复
npm run format       # 格式化代码
```

## 调试技巧

### 1. 查看日志
打开浏览器控制台，日志默认设置为 info 级别。

```javascript
import { logger } from './src/utils/logger.js';

// 设置为 debug 级别查看详细日志
logger.setLevel('debug');
```

### 2. 导出状态
```javascript
import { exportState } from './src/core/enhancedState.js';

// 导出当前状态到文件
exportState();
```

### 3. 监听状态变化
```javascript
import { subscribe } from './src/core/enhancedState.js';

subscribe((state, changedPaths) => {
  console.log('Changed:', changedPaths);
  console.log('New state:', state);
});
```

## 常见问题

### Q: 安装依赖失败？
A: 尝试使用 npm 镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### Q: 端口 3000 被占用？
A: 修改 vite.config.js 中的端口号：
```javascript
server: {
  port: 3001  // 改为其他端口
}
```

### Q: 如何添加新功能？
A: 参考 DEVELOPMENT.md 开发指南。

### Q: 原始代码在哪里？
A: 在 backup/ 目录下，main.js.bak 是原始入口文件。

## 下一步

- 阅读 [README.md](./README.md) 了解项目概览
- 阅读 [DEVELOPMENT.md](./DEVELOPMENT.md) 学习开发
- 阅读 [人生模拟器头脑风暴.md](./人生模拟器头脑风暴.md) 理解设计理念
- 阅读 [OPTIMIZATION_SUGGESTIONS.md](./OPTIMIZATION_SUGGESTIONS.md) 查看优化详情

## 支持

如有问题，请提交 Issue 或查看项目文档。
