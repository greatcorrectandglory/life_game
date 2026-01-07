/**
 * 认知吸收率配置
 * 基于信息熵和认知负荷的双轴模型
 */
export const ENTROPY_RATES = {
  low: {
    decay: 0.8,
    skillGain: 1.0,
    moodBoost: 3,
    stressImpact: -2,
    description: "低熵活动（如看还珠格格）"
  },
  medium: {
    decay: 0.5,
    skillGain: 1.5,
    moodBoost: 1,
    stressImpact: 0,
    description: "中熵活动（如普通学习）"
  },
  high: {
    decay: 0.2,
    skillGain: 2.5,
    moodBoost: -1,
    stressImpact: 3,
    description: "高熵活动（如深度思考、分析权游）"
  }
};

/**
 * 应用认知吸收率
 */
export const applyEntropyRate = (action, state) => {
  const entropy = action.entropy || 'medium';
  const rate = ENTROPY_RATES[entropy];

  if (!rate) {
    return { ...action.effects };
  }

  const modifiedEffects = {};
  Object.entries(action.effects).forEach(([key, value]) => {
    if (key === 'knowledge' || key === 'skill' || key === 'creativity') {
      modifiedEffects[key] = Math.floor(value * rate.skillGain);
    } else if (key === 'mood') {
      modifiedEffects[key] = value + rate.moodBoost;
    } else {
      modifiedEffects[key] = value;
    }
  });

  if (rate.stressImpact !== 0) {
    modifiedEffects.stress = (state.stats?.stress || 0) + rate.stressImpact;
  }

  return modifiedEffects;
};

/**
 * 获取奖励条目
 */
export const getRewardEntries = (rewards, REWARD_LABELS) => {
  if (!rewards) {
    return [];
  }
  return Object.entries(rewards)
    .filter(([, value]) => value !== 0 && value !== null && value !== undefined)
    .map(([key, value]) => ({
      key,
      value,
      label: REWARD_LABELS[key] || key
    }));
};

/**
 * 防抖函数
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * 节流函数
 */
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * 深度克隆对象
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
};

/**
 * 安全的数学运算
 */
export const safeMath = {
  add: (a, b) => {
    const result = (a || 0) + (b || 0);
    return isNaN(result) ? 0 : result;
  },
  sub: (a, b) => {
    const result = (a || 0) - (b || 0);
    return isNaN(result) ? 0 : result;
  },
  mul: (a, b) => {
    const result = (a || 0) * (b || 0);
    return isNaN(result) ? 0 : result;
  }
};

/**
 * 随机数生成器（带种子，用于测试）
 */
export const random = {
  _seed: Date.now(),
  setSeed(seed) {
    this._seed = seed;
  },
  getSeed() {
    return this._seed;
  },
  float(min = 0, max = 1) {
    this._seed = (this._seed * 9301 + 49297) % 233280;
    const randomValue = this._seed / 233280;
    return min + randomValue * (max - min);
  },
  int(min, max) {
    return Math.floor(this.float(min, max + 1));
  },
  choice(arr) {
    if (!Array.isArray(arr) || arr.length === 0) return null;
    return arr[this.int(0, arr.length - 1)];
  },
  weightedChoice(items) {
    if (!Array.isArray(items) || items.length === 0) return null;
    const totalWeight = items.reduce((sum, item) => sum + (item.weight || 1), 0);
    let random = this.float(0, totalWeight);
    for (const item of items) {
      random -= (item.weight || 1);
      if (random <= 0) return item;
    }
    return items[items.length - 1];
  }
};
