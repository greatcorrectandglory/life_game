/**
 * 决策回响系统 - Decision Echo System
 *
 * 负责:
 * 1. 检测可触发的回响事件
 * 2. 识别玩家的决策模式
 * 3. 触发回响事件
 * 4. 应用回响效果
 */

import { DECISION_ECHOES, getEchoesForDecision, getEchoesForPattern } from "../data/decisionEchoes.js";
import { logger } from "../core/logger.js";

/**
 * 检查是否有可触发的回响事件
 * @param {Object} state - 游戏状态
 * @returns {Object|null} 触发的回响事件
 */
export const checkDecisionEchoes = (state) => {
  if (!state.decisionHistory || state.decisionHistory.length === 0) {
    return null;
  }

  const eligibleEchoes = [];

  // 1. 检查单个决策的回响
  for (const decision of state.decisionHistory) {
    const echoes = getEchoesForDecision(decision.dilemmaId, decision.optionId);

    for (const echo of echoes) {
      // 检查是否已触发过
      if (state.triggeredEchoes?.includes(echo.id)) continue;

      // 检查触发条件
      if (canTriggerEcho(echo, decision, state)) {
        eligibleEchoes.push({ echo, sourceDecision: decision });
      }
    }
  }

  // 2. 检查决策模式的回响
  const patterns = analyzeDecisionPatterns(state);
  for (const [pattern, count] of Object.entries(patterns)) {
    const patternEchoes = getEchoesForPattern(pattern);

    for (const echo of patternEchoes) {
      // 检查是否已触发过
      if (state.triggeredEchoes?.includes(echo.id)) continue;

      // 检查是否满足阈值
      if (count >= echo.sourceDecision.threshold) {
        if (canTriggerPatternEcho(echo, state)) {
          eligibleEchoes.push({ echo, pattern, count });
        }
      }
    }
  }

  if (eligibleEchoes.length === 0) return null;

  // 3. 随机选择一个触发
  const selected = eligibleEchoes[Math.floor(Math.random() * eligibleEchoes.length)];

  // 4. 概率检查
  if (Math.random() < selected.echo.triggerConditions.probability) {
    return selected;
  }

  return null;
};

/**
 * 检查单个回响是否可以触发
 * @param {Object} echo - 回响事件
 * @param {Object} decision - 源决策
 * @param {Object} state - 游戏状态
 * @returns {boolean}
 */
const canTriggerEcho = (echo, decision, state) => {
  const conditions = echo.triggerConditions;

  // 检查回合间隔
  const turnsSinceDecision = state.totalTurns - decision.turn;
  if (turnsSinceDecision < conditions.minTurnsAfter) return false;

  // 检查章节间隔
  if (conditions.minChapterAfter) {
    const chaptersSinceDecision = state.chapter - decision.chapter;
    if (chaptersSinceDecision < conditions.minChapterAfter) return false;
  }

  // 检查特定章节要求
  if (conditions.requiredChapter !== undefined) {
    if (state.chapter !== conditions.requiredChapter) return false;
  }

  // 检查属性要求
  if (conditions.requiredStats) {
    for (const [key, value] of Object.entries(conditions.requiredStats)) {
      if ((state.stats[key] || 0) < value) return false;
    }
  }

  return true;
};

/**
 * 检查模式回响是否可以触发
 * @param {Object} echo - 回响事件
 * @param {Object} state - 游戏状态
 * @returns {boolean}
 */
const canTriggerPatternEcho = (echo, state) => {
  const conditions = echo.triggerConditions;

  // 检查总回合数
  if (state.totalTurns < conditions.minTurnsAfter) return false;

  // 检查章节
  if (conditions.minChapterAfter && state.chapter < conditions.minChapterAfter) {
    return false;
  }

  if (conditions.requiredChapter !== undefined) {
    if (state.chapter !== conditions.requiredChapter) return false;
  }

  return true;
};

/**
 * 分析玩家的决策模式
 * @param {Object} state - 游戏状态
 * @returns {Object} 模式计数 { pattern: count }
 */
export const analyzeDecisionPatterns = (state) => {
  if (!state.decisionHistory || state.decisionHistory.length === 0) {
    return {};
  }

  const patterns = {
    selfish: 0,      // 自私/冷漠
    altruistic: 0,   // 利他/助人
    integrity: 0,    // 坚持原则
    pragmatic: 0,    // 实用主义
    risk_taking: 0,  // 冒险
    cautious: 0,     // 谨慎
  };

  // 定义选项到模式的映射
  const optionPatterns = {
    // 扶老人困境
    "dilemma_senior.help": ["altruistic", "risk_taking"],
    "dilemma_senior.record_help": ["pragmatic", "cautious"],
    "dilemma_senior.ignore": ["selfish", "cautious"],

    // 抄袭困境
    "dilemma_plagiarism.copy": ["pragmatic"],
    "dilemma_plagiarism.original": ["integrity"],

    // 加班困境
    "dilemma_overtime.push_limit": ["pragmatic", "risk_taking"],
    "dilemma_overtime.reject": ["integrity", "cautious"],
  };

  // 统计模式
  for (const decision of state.decisionHistory) {
    const key = `${decision.dilemmaId}.${decision.optionId}`;
    const decisionPatterns = optionPatterns[key] || [];

    for (const pattern of decisionPatterns) {
      patterns[pattern]++;
    }
  }

  return patterns;
};

/**
 * 应用回响事件效果
 * @param {Object} state - 游戏状态
 * @param {Object} echoData - 回响数据 { echo, sourceDecision? }
 * @returns {Object} 应用结果
 */
export const applyEchoEffects = (state, echoData) => {
  const { echo } = echoData;
  const result = {
    title: echo.echo.title,
    text: echo.echo.text,
    effects: {},
    choices: echo.echo.choices || null,
    storyNote: echo.echo.storyNote,
  };

  // 应用属性效果
  if (echo.echo.effects) {
    Object.entries(echo.echo.effects).forEach(([key, value]) => {
      if (state.stats[key] !== undefined) {
        const oldValue = state.stats[key];
        state.stats[key] = Math.max(0, oldValue + value);
        result.effects[key] = value;
      }
    });
  }

  // 应用特质
  if (echo.echo.trait && !state.traits.includes(echo.echo.trait)) {
    state.traits.push(echo.echo.trait);
    result.traitGained = echo.echo.trait;
  }

  // 记录已触发
  if (!state.triggeredEchoes) {
    state.triggeredEchoes = [];
  }
  state.triggeredEchoes.push(echo.id);

  // 记录到历史
  if (!state.events.history) {
    state.events.history = [];
  }
  state.events.history.push({
    type: "echo",
    id: echo.id,
    turn: state.totalTurns,
    title: result.title,
  });

  logger.info("Decision echo triggered", { echoId: echo.id, effects: result.effects });

  return result;
};

/**
 * 处理回响事件的后续选择
 * @param {Object} state - 游戏状态
 * @param {Object} echo - 回响事件
 * @param {number} choiceIndex - 选择索引
 * @returns {Object} 结果
 */
export const resolveEchoChoice = (state, echo, choiceIndex) => {
  const choice = echo.echo.choices[choiceIndex];
  if (!choice) return null;

  const result = {
    text: choice.resultText,
    effects: {},
  };

  // 应用选择效果
  if (choice.effects) {
    Object.entries(choice.effects).forEach(([key, value]) => {
      if (state.stats[key] !== undefined) {
        state.stats[key] = Math.max(0, (state.stats[key] || 0) + value);
        result.effects[key] = value;
      }
    });
  }

  return result;
};

/**
 * 获取玩家的决策风格总结
 * @param {Object} state - 游戏状态
 * @returns {Object} 决策风格分析
 */
export const getDecisionStyleSummary = (state) => {
  const patterns = analyzeDecisionPatterns(state);
  const total = Object.values(patterns).reduce((sum, count) => sum + count, 0);

  if (total === 0) {
    return {
      dominant: "未知",
      description: "还没有足够的决策数据",
      patterns: {},
    };
  }

  // 找出主导模式
  const dominantPattern = Object.entries(patterns).reduce((max, [pattern, count]) =>
    count > max.count ? { pattern, count } : max
  , { pattern: "未知", count: 0 });

  const patternDescriptions = {
    selfish: "自我保护者 - 你倾向于优先考虑自己的利益",
    altruistic: "利他主义者 - 你愿意帮助他人,即使有风险",
    integrity: "原则坚守者 - 你坚持道德底线,不走捷径",
    pragmatic: "实用主义者 - 你追求最优解,灵活应变",
    risk_taking: "风险偏好者 - 你勇于冒险,追求高回报",
    cautious: "谨慎行事者 - 你稳健行事,规避风险",
  };

  return {
    dominant: dominantPattern.pattern,
    description: patternDescriptions[dominantPattern.pattern] || "独特风格",
    patterns: Object.fromEntries(
      Object.entries(patterns).map(([pattern, count]) => [
        pattern,
        { count, percentage: ((count / total) * 100).toFixed(1) },
      ])
    ),
  };
};
