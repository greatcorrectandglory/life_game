import { logger } from './logger.js';

/**
 * 创建初始游戏状态 - 大重构版本
 * 支持105回合（7章×15回合）、标签化技能、行业系统、善缘系统等
 */
export const createInitialState = () => ({
  // === 时间系统 ===
  age: 6,                      // 当前年龄
  week: 1,                     // 当前周数（每回合1周）
  chapter: 0,                  // 章节索引
  chapterTurn: 1,              // 章节内回合
  totalTurns: 0,               // 总回合数
  
  // === 精力系统（扩展） ===
  energy: 12,
  energyMax: 12,
  energyRecovery: 12,          // 每回合恢复量
  
  // === 核心属性（重新设计） ===
  stats: {
    // 基础属性 (0-20)
    health: 10,                // 健康
    mood: 10,                  // 情绪
    focus: 10,                 // 专注力（影响学习效率）
    
    // 成长属性（无上限，长期积累）
    knowledge: 0,              // 知识积累
    skill: 0,                  // 实践技能
    creativity: 0,             // 创造力
    
    // 社会资本
    social: 0,                 // 人脉值
    reputation: 0,             // 声望
    money: 0,                  // 金钱（可负）
    
    // 心理属性
    stress: 0,                 // 压力值 (0-100)
    grit: 0,                   // 坚毅值（长期积累，影响升华概率）
    fragility: 0,              // 脆弱值（长期积累，影响崩溃概率）
  },
  
  // === 技能系统（标签化） ===
  // 格式: { skillId: { level, type, decay, lastUsed } }
  skills: {},
  skillPoints: 0,
  
  // === 特质系统 ===
  traits: [],                  // ["认知反脆弱", "思维僵化", "诚信", ...]
  
  // === 天赋系统（扩展） ===
  talents: {
    rational: 0,               // 理性天赋（学习+规划）
    empathic: 0,               // 感性天赋（社交+创作）
    grit: 0,                   // 坚韧天赋（健康+抗压）
    luck: 0,                   // 运气天赋（正面黑天鹅概率）
    optionality: 0,            // 期权天赋（技能迁移率）
  },
  talentPoints: 5,
  talentMode: null,            // "select" | "ready"
  talentDraft: { rational: 0, empathic: 0, grit: 0, luck: 0, optionality: 0 },
  
  // === 反脆弱核心池 ===
  pools: {
    karma: 0,                  // 善缘池（好人好报）
    serendipity: 0,            // 机遇池（主动挑战积累）
    riskExposure: 0,           // 风险敞口（冒险行为积累）
    safetyMargin: 0,           // 安全边际（保守行为积累）
    transferPool: 0,           // 技能迁移池（行业崩溃时可用）
  },
  
  // === 行业与职业系统 ===
  career: {
    industry: null,            // 当前行业: "tech" | "finance" | "architecture" | ...
    position: 0,               // 职位等级 0-5
    experience: 0,             // 行业经验
    history: [],               // 职业历史
  },
  
  // === 经济系统（扩展） ===
  economy: {
    cycle: "growth",           // "growth" | "peak" | "recession" | "recovery"
    cycleTurn: 0,
    cycleDuration: 8,          // 周期长度
    // 每个行业独立生命周期
    industries: {
      tech: { phase: "growth", health: 100, volatility: 0.8 },
      finance: { phase: "mature", health: 80, volatility: 0.6 },
      architecture: { phase: "stable", health: 70, volatility: 0.4 },
      education: { phase: "stable", health: 75, volatility: 0.2 },
      healthcare: { phase: "growth", health: 90, volatility: 0.3 },
      creative: { phase: "emerging", health: 60, volatility: 0.7 },
      manufacturing: { phase: "mature", health: 65, volatility: 0.5 },
    }
  },
  
  // === 事件系统 ===
  events: {
    pending: [],               // 待触发事件
    active: null,              // 当前事件/困境
    history: [],               // 历史事件
    dilemmaResults: {},        // 困境选择结果
    lastBlackSwanTurn: -99,    // 上次黑天鹅回合
  },

  // === 决策回响系统 ===
  decisionHistory: [],         // 决策历史 [{ dilemmaId, optionId, turn, chapter }]
  triggeredEchoes: [],         // 已触发的回响事件ID
  decisionPatterns: {},        // 决策模式统计
  
  // === 挑战系统（替代原战斗系统） ===
  challenge: {
    active: null,              // 当前挑战
    victories: 0,              // 胜利次数
    defeats: 0,                // 失败次数
    streak: 0,                 // 连胜
    history: [],               // 挑战历史
  },
  
  // === 任务系统 ===
  quests: {
    main: null,                // 当前主线任务
    side: [],                  // 支线任务列表
    completed: [],             // 已完成任务
    storyChain: { id: null, step: 0 },  // 剧情链进度
  },
  
  // === 行动计数（用于衰减计算） ===
  actionCounts: {},            // { actionId: count }
  consecutiveActions: {},      // { actionId: consecutiveCount }
  lastActionGroup: null,
  
  // === UI与展示状态 ===
  log: [],
  storyQueue: [],
  storyText: "",
  storyTimer: 0,
  storyHold: 0,
  
  // === 成就与称号 ===
  title: "新人",
  titles: ["新人"],
  achievements: {},
  questCounts: { main: 0, side: 0, chain: 0 },
  
  // === 游戏状态 ===
  gamePhase: "talent_select",  // "talent_select" | "playing" | "event" | "challenge" | "chapter_end" | "game_over"
  skipTurn: 0,                 // 跳过回合数
  virtueActive: false,         // 升华状态激活
  virtueTurnsLeft: 0,          // 升华剩余回合
  gameOver: false,
  modalLock: false,
  
  // === 兼容旧系统（保持向后兼容） ===
  combat: null,
  skillSelectMode: false,
  chapterIndex: 0,             // 别名，兼容旧代码
  turn: 1,                     // 别名，兼容旧代码
  resilience: 5,               // 旧属性，保留兼容
  entropyPool: 0,
  lastSwanTurn: -99,
  stressType: "neutral",
  chain: { title: null, index: 0, steps: [] },  // 旧剧情链格式兼容
});

const state = createInitialState();

/**
 * 监听器集合
 * 每个监听器可以订阅特定的路径
 */
const listeners = new Map();

/**
 * 添加路径订阅
 * @param {Function} listener - 监听器函数
 * @param {Array<string>} paths - 订阅的路径数组
 */
export const subscribe = (listener, paths = []) => {
  if (typeof listener !== 'function') {
    logger.warn('Attempted to subscribe non-function listener');
    return () => { };
  }

  const id = Symbol('listener');
  listeners.set(id, { listener, paths });
  logger.debug('Listener subscribed', { id: id.toString(), paths });

  return () => {
    listeners.delete(id);
    logger.debug('Listener unsubscribed', { id: id.toString() });
  };
};

/**
 * 通知监听器
 * @param {Array<string>} changedPaths - 变化的路径数组
 */
const notify = (changedPaths = []) => {
  listeners.forEach(({ listener, paths }) => {
    try {
      if (paths.length === 0 || changedPaths.some(path => paths.includes(path))) {
        listener(state, changedPaths);
      }
    } catch (error) {
      logger.error('Listener error', { error, listener: listener.name || 'anonymous' });
    }
  });
};

/**
 * 获取当前状态的只读副本
 */
export const getState = () => {
  return JSON.parse(JSON.stringify(state));
};

/**
 * 获取当前状态的引用（内部使用）
 */
export const getStateRef = () => state;

/**
 * 更新状态
 * @param {Object} partial - 部分状态更新
 * @param {boolean} notifyAll - 是否通知所有监听器
 */
export const patchState = (partial, notifyAll = false) => {
  if (!partial || typeof partial !== 'object') {
    logger.warn('Invalid state patch', { partial });
    return;
  }

  try {
    const changedPaths = Object.keys(partial);

    Object.keys(partial).forEach(key => {
      if (typeof partial[key] === 'object' && partial[key] !== null && !Array.isArray(partial[key])) {
        state[key] = { ...(state[key] || {}), ...partial[key] };
      } else {
        state[key] = partial[key];
      }
    });

    notify(notifyAll ? [] : changedPaths);

    logger.debug('State patched', { changedPaths, notifyAll });
  } catch (error) {
    logger.error('Failed to patch state', { error, partial });
    throw error;
  }
};

/**
 * 重置状态
 */
export const resetState = () => {
  try {
    const next = createInitialState();
    Object.keys(state).forEach(key => delete state[key]);
    Object.assign(state, next);
    notify([]);
    logger.info('State reset');
  } catch (error) {
    logger.error('Failed to reset state', { error });
    throw error;
  }
};

/**
 * 深度更新嵌套对象
 * @param {string} path - 路径（如 'stats.health'）
 * @param {*} value - 新值
 */
export const updatePath = (path, value) => {
  try {
    const keys = path.split('.');
    let target = state;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!target[keys[i]]) {
        target[keys[i]] = {};
      }
      target = target[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const oldValue = target[lastKey];
    target[lastKey] = value;

    notify([path]);

    logger.debug('Path updated', { path, oldValue, newValue: value });
  } catch (error) {
    logger.error('Failed to update path', { error, path, value });
    throw error;
  }
};

/**
 * 获取嵌套值
 * @param {string} path - 路径（如 'stats.health'）
 * @param {*} defaultValue - 默认值
 */
export const getPath = (path, defaultValue = null) => {
  try {
    const keys = path.split('.');
    let target = state;

    for (const key of keys) {
      if (target == null) {
        return defaultValue;
      }
      target = target[key];
    }

    return target !== undefined ? target : defaultValue;
  } catch (error) {
    logger.error('Failed to get path', { error, path });
    return defaultValue;
  }
};

/**
 * 批量更新状态（原子操作）
 * @param {Function} updater - 更新函数，接收当前状态，返回部分更新
 */
export const batchUpdate = (updater) => {
  try {
    const current = getState();
    const updates = updater(current);

    if (updates) {
      patchState(updates);
    }

    return state;
  } catch (error) {
    logger.error('Failed to batch update', { error, updater });
    throw error;
  }
};

/**
 * 创建状态的不可变快照
 */
export const snapshotState = (stateToSnapshot = state) => {
  try {
    return JSON.parse(JSON.stringify(stateToSnapshot));
  } catch (error) {
    logger.error('Failed to snapshot state', { error });
    return null;
  }
};

/**
 * 导出状态（用于调试）
 */
export const exportState = () => {
  try {
    const snapshot = snapshotState();
    const blob = new Blob([JSON.stringify(snapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `antifragile_state_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    logger.info('State exported');
    return true;
  } catch (error) {
    logger.error('Failed to export state', { error });
    return false;
  }
};

/**
 * 获取监听器数量（用于调试）
 */
export const getListenerCount = () => listeners.size;

/**
 * 清除所有监听器（用于测试）
 */
export const clearListeners = () => {
  listeners.clear();
  logger.info('All listeners cleared');
};

// Exports are done inline
