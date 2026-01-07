import { getState, patchState } from '../core/enhancedState.js';
import { BLACK_SWAN_EVENTS } from '../data/events.js';
import { CHAPTERS } from '../data/chapters.js';
import { random } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

/**
 * 获取当前阶段的黑天鹅事件列表
 */
export const getCurrentSwanEvents = () => {
  const state = getState();
  const chapter = CHAPTERS[state.chapterIndex];

  if (!chapter) return [];

  return BLACK_SWAN_EVENTS[chapter.id] || [];
};

/**
 * 检查是否应该触发黑天鹅事件
 */
const shouldTriggerSwanEvent = (state) => {
  const minGap = 3;
  const last = state.lastSwanTurn || -99;
  const turn = state.turn;

  return turn - last >= minGap;
};

/**
 * 选择黑天鹅事件
 */
const selectSwanEvent = (state) => {
  const events = getCurrentSwanEvents();

  if (events.length === 0) return null;

  const stress = state.stats?.stress || 0;
  const money = state.stats?.money || 0;
  const social = state.stats?.social || 0;
  const resilience = state.resilience || 0;
  const entropyPool = state.entropyPool || 0;

  let weights = {
    negative_major: 0,
    negative_minor: 0,
    positive_opportunity: 0
  };

  if (stress > 75) {
    weights.negative_major += 40;
  } else if (stress > 50) {
    weights.negative_minor += 30;
  }

  if (money > 3000 && stress < 20) {
    weights.negative_minor += 35;
  }

  if (entropyPool > 5 && social >= 2) {
    weights.positive_opportunity += 25 + (resilience * 2);
  }

  if (Math.random() < 0.2) {
    weights.negative_major += 20;
  }

  const weightedEvents = events.map(event => ({
    ...event,
    weight: weights[event.id] || 10
  }));

  const selected = random.weightedChoice(weightedEvents);

  if (selected) {
    logger.info('Black swan event selected', {
      eventId: selected.id,
      weights
    });
  }

  return selected;
};

/**
 * 触发黑天鹅事件
 */
export const triggerSwanEvent = () => {
  const state = getState();

  if (!shouldTriggerSwanEvent(state)) {
    return null;
  }

  const event = selectSwanEvent(state);

  if (!event) return null;

  try {
    const updates = {
      lastSwanTurn: state.turn
    };

    if (event.rewards) {
      Object.entries(event.rewards).forEach(([key, value]) => {
        if (!updates.stats) updates.stats = {};
        updates.stats[key] = (state.stats[key] || 0) + value;

        if (key === 'stress') {
          updates.stressType = value > 0 ? 'Distress' : 'Eustress';
        }
      });
    }

    patchState(updates);

    logger.info('Black swan event triggered', {
      eventId: event.id,
      title: event.title,
      rewards: event.rewards
    });

    return event;
  } catch (error) {
    logger.error('Failed to trigger swan event', { error, event });
    throw error;
  }
};

/**
 * 解析压力
 */
export const resolveStress = () => {
  const state = getState();

  if (!state.stats || state.stats.stress < 15) {
    return null;
  }

  const resilience = state.resilience || 0;
  const virtueChance = Math.min(0.3 + resilience * 0.02, 0.6);
  const roll = Math.random();

  const result = {
    type: roll <= virtueChance ? 'virtue' : 'meltdown',
    timestamp: Date.now()
  };

  if (result.type === 'virtue') {
    const updates = {
      stats: {
        ...state.stats,
        stress: 0,
        mood: Math.max(0, state.stats.mood + 3),
        health: Math.max(0, state.stats.health + 2),
        skill: Math.max(0, state.stats.skill + 1)
      },
      title: '无畏',
      stressType: 'Eustress'
    };

    patchState(updates);

    result.title = '压力升华';
    result.text = '你在高压中完成了突破，状态进入高峰。';
    result.rewards = { mood: 3, health: 2, skill: 1 };

    logger.info('Stress resolved: Virtue', {
      resilience,
      chance: virtueChance,
      roll
    });
  } else {
    const updates = {
      skipTurn: 1,
      stats: {
        ...state.stats,
        health: Math.max(0, Math.floor(state.stats.health * 0.5)),
        mood: Math.max(0, Math.floor(state.stats.mood * 0.5))
      }
    };

    patchState(updates);

    result.title = '压力崩溃';
    result.text = '你被压力压垮，只能暂缓行动。';
    result.rewards = { health: -2, mood: -2 };

    logger.info('Stress resolved: Meltdown', {
      resilience,
      chance: virtueChance,
      roll
    });
  }

  return result;
};

/**
 * 记录善缘（用于蝴蝶效应）
 */
export const recordGoodKarma = (type, amount = 1) => {
  const state = getState();
  const goodKarma = state.goodKarma || 0;

  patchState({
    goodKarma: goodKarma + amount,
    karmaHistory: [
      ...(state.karmaHistory || []),
      { type, amount, timestamp: Date.now() }
    ]
  });

  logger.debug('Good karma recorded', { type, amount, total: goodKarma + amount });
};

/**
 * 检查善缘池触发
 */
export const checkKarmaTrigger = () => {
  const state = getState();
  const goodKarma = state.goodKarma || 0;

  if (goodKarma < 10) return null;

  const roll = Math.random();
  const triggerChance = Math.min(0.5, goodKarma * 0.02);

  if (roll > triggerChance) return null;

  const karmaEvent = {
    type: 'karma_return',
    title: '善缘回馈',
    text: '你过去的善行在今天得到了回报。',
    rewards: {
      social: Math.floor(goodKarma * 0.3),
      mood: Math.floor(goodKarma * 0.2)
    }
  };

  const updates = {
    goodKarma: 0
  };

  Object.entries(karmaEvent.rewards).forEach(([key, value]) => {
    if (!updates.stats) updates.stats = {};
    updates.stats[key] = (state.stats[key] || 0) + value;
  });

  patchState(updates);

  logger.info('Karma event triggered', {
    goodKarma,
    rewards: karmaEvent.rewards
  });

  return karmaEvent;
};

/**
 * 生成随机事件
 */
export const generateRandomEvent = (type = 'normal') => {
  const eventTypes = {
    normal: [
      { id: 'random_news', title: '新闻', text: '你看到了一条有趣的新闻。', rewards: { mood: 1 } },
      { id: 'random_encounter', title: '偶遇', text: '你遇到了一位老朋友。', rewards: { social: 1, mood: 1 } },
      { id: 'random_discovery', title: '发现', text: '你发现了一个有趣的新事物。', rewards: { knowledge: 1 } }
    ],
    rare: [
      { id: 'rare_opportunity', title: '难得机会', text: '一个难得的机会出现在你面前。', rewards: { money: 5, mood: 2 } },
      { id: 'rare_insight', title: '顿悟', text: '你对某个问题有了新的理解。', rewards: { skill: 2, knowledge: 1 } }
    ]
  };

  const events = eventTypes[type] || eventTypes.normal;
  const event = random.choice(events);

  if (event) {
    logger.info('Random event generated', { type, eventId: event.id });
  }

  return event;
};

/**
 * 应用事件
 */
export const applyEvent = (event) => {
  if (!event || !event.rewards) return;

  const updates = {};

  Object.entries(event.rewards).forEach(([key, value]) => {
    if (!updates.stats) updates.stats = {};
    updates.stats[key] = (getState().stats[key] || 0) + value;
  });

  patchState(updates);

  logger.info('Event applied', {
    eventId: event.id,
    rewards: event.rewards
  });
};

/**
 * 获取事件历史
 */
export const getEventHistory = (limit = 10) => {
  const state = getState();
  const history = state.eventHistory || [];

  return history.slice(-limit);
};

/**
 * 初始化事件系统
 */
export const initEventSystem = () => {
  logger.info('Event system initialized');
};
