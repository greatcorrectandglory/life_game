/**
 * 人生回顾面板 - Life Review Panel
 *
 * 展示玩家的重要决策、剧情节点、人生轨迹
 */

import { getState } from '../core/enhancedState.js';
import { CHAPTERS } from '../data/stages.js';
import { getDecisionStyleSummary } from '../systems/decisionEcho.js';

/**
 * 创建人生回顾面板
 */
export const createLifeReviewPanel = () => {
  const state = getState();

  const data = {
    // 基础信息
    currentAge: state.age,
    currentChapter: CHAPTERS[state.chapter].name,
    totalTurns: state.totalTurns,
    progress: Math.floor((state.totalTurns / 105) * 100),

    // 人生轨迹
    trajectory: generateLifeTrajectory(state),

    // 重要决策
    keyDecisions: getKeyDecisions(state),

    // 决策风格
    decisionStyle: getDecisionStyleSummary(state),

    // 触发的剧情点
    storyMilestones: getStoryMilestones(state),

    // 回响事件
    echoes: getTriggeredEchoes(state),

    // 性格标签
    personalityTags: generatePersonalityTags(state),

    // 人生高光时刻
    highlights: getLifeHighlights(state),

    // 人生低谷
    lowPoints: getLifeLowPoints(state),
  };

  return data;
};

/**
 * 生成人生轨迹数据 (用于可视化)
 */
const generateLifeTrajectory = (state) => {
  // 简化版:记录每个章节结束时的关键属性
  const trajectory = [];

  // 如果有历史事件,从中提取章节数据
  const chapterSnapshots = {};

  // 当前状态
  chapterSnapshots[state.chapter] = {
    chapter: state.chapter,
    chapterName: CHAPTERS[state.chapter].name,
    age: state.age,
    health: state.stats.health,
    mood: state.stats.mood,
    stress: state.stats.stress,
    knowledge: state.stats.knowledge,
    social: state.stats.social,
    money: state.stats.money,
  };

  // 转换为数组
  Object.values(chapterSnapshots).forEach((snapshot) => {
    trajectory.push(snapshot);
  });

  return trajectory;
};

/**
 * 获取重要决策
 */
const getKeyDecisions = (state) => {
  if (!state.decisionHistory || state.decisionHistory.length === 0) {
    return [];
  }

  return state.decisionHistory.map((decision) => ({
    dilemmaId: decision.dilemmaId,
    optionId: decision.optionId,
    turn: decision.turn,
    chapter: decision.chapter,
    chapterName: CHAPTERS[decision.chapter]?.name || '未知阶段',
  }));
};

/**
 * 获取剧情里程碑
 */
const getStoryMilestones = (state) => {
  const milestones = [];

  // 从事件历史中提取剧情相关事件
  if (state.events?.history) {
    state.events.history.forEach((event) => {
      if (event.type === 'story' || event.type === 'quest' || event.type === 'chain') {
        milestones.push({
          type: event.type,
          title: event.title,
          turn: event.turn,
        });
      }
    });
  }

  // 添加已完成的任务
  if (state.questCounts) {
    if (state.questCounts.main > 0) {
      milestones.push({
        type: 'achievement',
        title: `完成了 ${state.questCounts.main} 个主线任务`,
        count: state.questCounts.main,
      });
    }
    if (state.questCounts.chain > 0) {
      milestones.push({
        type: 'achievement',
        title: `经历了 ${state.questCounts.chain} 个剧情节点`,
        count: state.questCounts.chain,
      });
    }
  }

  return milestones;
};

/**
 * 获取已触发的回响事件
 */
const getTriggeredEchoes = (state) => {
  if (!state.triggeredEchoes || state.triggeredEchoes.length === 0) {
    return [];
  }

  return state.triggeredEchoes.map((echoId) => ({
    id: echoId,
    // 可以从events.history中查找详细信息
  }));
};

/**
 * 生成性格标签
 */
const generatePersonalityTags = (state) => {
  const tags = [];

  // 根据属性生成标签
  if (state.stats.grit > 30) tags.push({ tag: '坚毅者', color: '#f59e0b' });
  if (state.stats.fragility > 30) tags.push({ tag: '脆弱者', color: '#ef4444' });
  if (state.stats.knowledge > 40) tags.push({ tag: '学者', color: '#3b82f6' });
  if (state.stats.social > 40) tags.push({ tag: '社交达人', color: '#10b981' });
  if (state.stats.creativity > 30) tags.push({ tag: '创作者', color: '#8b5cf6' });
  if (state.stats.money > 10000) tags.push({ tag: '富裕', color: '#eab308' });
  if (state.pools?.karma > 5) tags.push({ tag: '善良', color: '#06b6d4' });

  // 根据特质添加标签
  if (state.traits) {
    state.traits.forEach((trait) => {
      tags.push({ tag: trait, color: '#a855f7' });
    });
  }

  return tags;
};

/**
 * 获取人生高光时刻
 */
const getLifeHighlights = (state) => {
  const highlights = [];

  // 升华事件
  if (state.events?.history) {
    state.events.history.forEach((event) => {
      if (event.type === 'virtue') {
        highlights.push({
          title: '压力升华',
          turn: event.turn,
          description: '在极限压力下实现了突破',
        });
      }
    });
  }

  // 挑战胜利
  if (state.challenge?.victories > 5) {
    highlights.push({
      title: '挑战大师',
      description: `战胜了 ${state.challenge.victories} 个挑战`,
    });
  }

  // 正面黑天鹅
  if (state.events?.history) {
    state.events.history.forEach((event) => {
      if (event.type === 'blackSwan' && event.positive) {
        highlights.push({
          title: '幸运降临',
          turn: event.turn,
          description: event.title,
        });
      }
    });
  }

  return highlights;
};

/**
 * 获取人生低谷
 */
const getLifeLowPoints = (state) => {
  const lowPoints = [];

  // 崩溃事件
  if (state.events?.history) {
    state.events.history.forEach((event) => {
      if (event.type === 'meltdown') {
        lowPoints.push({
          title: '精神崩溃',
          turn: event.turn,
          description: '压力过大导致短暂崩溃',
        });
      }
    });
  }

  // 挑战失败
  if (state.challenge?.defeats > 3) {
    lowPoints.push({
      title: '多次挫折',
      description: `遭遇了 ${state.challenge.defeats} 次挫败`,
    });
  }

  // 负面黑天鹅
  if (state.events?.history) {
    state.events.history.forEach((event) => {
      if (event.type === 'blackSwan' && !event.positive) {
        lowPoints.push({
          title: '危机降临',
          turn: event.turn,
          description: event.title,
        });
      }
    });
  }

  return lowPoints;
};

/**
 * 渲染人生回顾面板
 */
export const renderLifeReviewPanel = (containerId) => {
  const data = createLifeReviewPanel();
  const container = document.getElementById(containerId);
  if (!container) return;

  const html = `
    <div class="life-review-panel">
      <div class="review-header">
        <h2>人生回顾</h2>
        <div class="review-progress">
          <span>${data.currentChapter} · ${data.currentAge}岁</span>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${data.progress}%"></div>
          </div>
          <span>${data.progress}% 完成</span>
        </div>
      </div>

      ${data.personalityTags.length > 0 ? `
      <div class="review-section">
        <h3>性格标签</h3>
        <div class="personality-tags">
          ${data.personalityTags.map(t => `
            <span class="personality-tag" style="background: ${t.color}20; color: ${t.color}; border: 1px solid ${t.color}50;">
              ${t.tag}
            </span>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${data.decisionStyle.dominant !== '未知' ? `
      <div class="review-section">
        <h3>决策风格</h3>
        <div class="decision-style">
          <div class="style-dominant">${data.decisionStyle.description}</div>
          <div class="style-patterns">
            ${Object.entries(data.decisionStyle.patterns).map(([pattern, info]) => `
              <div class="pattern-item">
                <span class="pattern-name">${getPatternName(pattern)}</span>
                <span class="pattern-percent">${info.percentage}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      ` : ''}

      ${data.keyDecisions.length > 0 ? `
      <div class="review-section">
        <h3>重要决策 (${data.keyDecisions.length})</h3>
        <div class="key-decisions">
          ${data.keyDecisions.slice(-5).reverse().map(d => `
            <div class="decision-item">
              <span class="decision-chapter">${d.chapterName}</span>
              <span class="decision-id">${getDecisionTitle(d.dilemmaId)}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${data.highlights.length > 0 ? `
      <div class="review-section">
        <h3>✨ 高光时刻</h3>
        <div class="highlight-list">
          ${data.highlights.map(h => `
            <div class="highlight-item">
              <strong>${h.title}</strong>
              <p>${h.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${data.lowPoints.length > 0 ? `
      <div class="review-section">
        <h3>💔 艰难时刻</h3>
        <div class="lowpoint-list">
          ${data.lowPoints.map(l => `
            <div class="lowpoint-item">
              <strong>${l.title}</strong>
              <p>${l.description}</p>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${data.storyMilestones.length > 0 ? `
      <div class="review-section">
        <h3>人生足迹</h3>
        <div class="milestone-list">
          ${data.storyMilestones.slice(-10).reverse().map(m => `
            <div class="milestone-item">
              <span class="milestone-icon">${getMilestoneIcon(m.type)}</span>
              <span class="milestone-title">${m.title}</span>
            </div>
          `).join('')}
        </div>
      </div>
      ` : ''}
    </div>
  `;

  container.innerHTML = html;
};

// 辅助函数
const getPatternName = (pattern) => {
  const names = {
    selfish: '自我保护',
    altruistic: '利他主义',
    integrity: '坚持原则',
    pragmatic: '实用主义',
    risk_taking: '风险偏好',
    cautious: '谨慎行事',
  };
  return names[pattern] || pattern;
};

const getDecisionTitle = (dilemmaId) => {
  const titles = {
    dilemma_senior: '扶老人困境',
    dilemma_plagiarism: '抄袭诱惑',
    dilemma_overtime: '加班压力',
  };
  return titles[dilemmaId] || dilemmaId;
};

const getMilestoneIcon = (type) => {
  const icons = {
    story: '📖',
    quest: '🎯',
    chain: '🔗',
    achievement: '🏆',
  };
  return icons[type] || '·';
};
