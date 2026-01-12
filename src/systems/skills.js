import { SKILL_TREE } from '../data/skill_tree.js';
import { getState, patchState } from '../core/enhancedState.js';
import { logger } from '../utils/logger.js';

/**
 * 获取技能树
 */
export const getSkillTree = () => {
  return SKILL_TREE;
};

/**
 * 获取指定类别的技能列表
 */
export const getCategorySkills = (category) => {
  const tree = getSkillTree();
  return tree[category]?.skills || [];
};

/**
 * 获取技能信息
 */
export const getSkillInfo = (skillId) => {
  const tree = getSkillTree();

  for (const category in tree) {
    const skill = tree[category].skills.find(s => s.id === skillId);
    if (skill) {
      return {
        ...skill,
        category,
        categoryName: tree[category].name
      };
    }
  }

  return null;
};

/**
 * 获取玩家当前技能等级
 */
export const getSkillLevel = (skillId) => {
  const state = getState();
  const entry = state.skills[skillId];
  if (!entry) return 0;
  return typeof entry === 'number' ? entry : entry.level || 0;
};

/**
 * 检查技能是否已满级
 */
export const isSkillMaxed = (skillId) => {
  const skillInfo = getSkillInfo(skillId);
  if (!skillInfo) return true;

  const currentLevel = getSkillLevel(skillId);
  return currentLevel >= skillInfo.max;
};

/**
 * 检查技能是否可升级
 */
export const canUpgradeSkill = (skillId) => {
  if (isSkillMaxed(skillId)) return false;

  const state = getState();
  if (state.skillPoints <= 0) return false;

  const skillInfo = getSkillInfo(skillId);
  if (!skillInfo) return false;

  const currentLevel = getSkillLevel(skillId);

  if (skillInfo.requires) {
    for (const [reqSkill, reqLevel] of Object.entries(skillInfo.requires)) {
      if (getSkillLevel(reqSkill) < reqLevel) {
        return false;
      }
    }
  }

  return true;
};

/**
 * 升级技能
 */
export const upgradeSkill = (skillId) => {
  if (!canUpgradeSkill(skillId)) {
    logger.warn('Cannot upgrade skill', { skillId });
    return false;
  }

  try {
    const state = getState();
    const skillInfo = getSkillInfo(skillId);
    const currentEntry = state.skills[skillId];
    const currentLevel = getSkillLevel(skillId);

    const newLevel = currentLevel + 1;
    const nextEntry = typeof currentEntry === 'number'
      ? { level: newLevel, lastUsed: state.totalTurns }
      : {
          ...(currentEntry || {}),
          level: newLevel,
          lastUsed: currentEntry?.lastUsed ?? state.totalTurns
        };

    patchState({
      skillPoints: state.skillPoints - 1,
      skills: {
        ...state.skills,
        [skillId]: nextEntry
      }
    });

    logger.info('Skill upgraded', {
      skillId,
      oldLevel: currentLevel,
      newLevel,
      remainingPoints: state.skillPoints - 1
    });

    return true;
  } catch (error) {
    logger.error('Failed to upgrade skill', { error, skillId });
    throw error;
  }
};

/**
 * 获取技能等级进度条（用于UI）
 */
export const getSkillProgress = (skillId) => {
  const skillInfo = getSkillInfo(skillId);
  if (!skillInfo) return { current: 0, max: 1, percentage: 0 };

  const current = getSkillLevel(skillId);
  const max = skillInfo.max;

  return {
    current,
    max,
    percentage: Math.min(100, Math.floor((current / max) * 100))
  };
};

/**
 * 获取技能加成
 */
export const getSkillBonus = (statKey) => {
  const state = getState();
  const skills = state.skills || {};
  let bonus = 0;

  Object.entries(skills).forEach(([skillId, entry]) => {
    const skillInfo = getSkillInfo(skillId);
    if (!skillInfo) return;
    const level = typeof entry === 'number' ? entry : entry.level || 0;

    const statMap = {
      'logic': 'knowledge',
      'research': 'knowledge',
      'foundation': 'knowledge',
      'execution': 'skill',
      'planning': 'skill',
      'insight': 'money',
      'communication': 'social',
      'trust': 'social',
      'leadership': 'social',
      'story': 'creativity',
      'aesthetic': 'creativity',
      'craft': 'creativity',
      'fitness': 'health',
      'stress': 'mood',
      'habit': 'health'
    };

    const mappedStat = statMap[skillId];
    if (mappedStat === statKey) {
      bonus += level * 0.5;
    }
  });

  return Math.floor(bonus);
};

/**
 * 计算总技能点数
 */
export const getTotalSkillPoints = () => {
  const state = getState();
  const skills = state.skills || {};

  return Object.values(skills).reduce((sum, entry) => {
    const level = typeof entry === 'number' ? entry : entry.level || 0;
    return sum + level;
  }, 0);
};

/**
 * 获取可升级的技能列表
 */
export const getUpgradeableSkills = () => {
  const tree = getSkillTree();
  const upgradeable = [];

  for (const category in tree) {
    tree[category].skills.forEach(skill => {
      if (canUpgradeSkill(skill.id)) {
        upgradeable.push({
          ...skill,
          category,
          categoryName: tree[category].name
        });
      }
    });
  }

  return upgradeable;
};

/**
 * 重置技能点（用于测试或特殊情况）
 */
export const resetSkills = () => {
  const state = getState();

  const totalPoints = getTotalSkillPoints();
  const spentPoints = totalPoints;

  patchState({
    skillPoints: state.skillPoints + spentPoints,
    skills: {}
  });

  logger.info('Skills reset', { refundedPoints: spentPoints });

  return true;
};

/**
 * 获取技能统计信息
 */
export const getSkillStats = () => {
  const tree = getSkillTree();
  const state = getState();
  const skills = state.skills || {};

  const stats = {
    totalSkills: 0,
    learnedSkills: 0,
    maxedSkills: 0,
    totalLevels: 0,
    maxLevels: 0,
    categoryStats: {}
  };

  for (const category in tree) {
    const categorySkills = tree[category].skills;
    stats.totalSkills += categorySkills.length;
    stats.maxLevels += categorySkills.reduce((sum, s) => sum + s.max, 0);

    let categoryLearned = 0;
    let categoryMaxed = 0;
    let categoryLevels = 0;

    categorySkills.forEach(skill => {
      const entry = skills[skill.id];
      const level = typeof entry === 'number' ? entry : entry?.level || 0;
      stats.totalLevels += level;

      if (level > 0) categoryLearned++;
      if (level >= skill.max) categoryMaxed++;
      categoryLevels += level;
    });

    stats.learnedSkills += categoryLearned;
    stats.maxedSkills += categoryMaxed;

    stats.categoryStats[category] = {
      name: tree[category].name,
      total: categorySkills.length,
      learned: categoryLearned,
      maxed: categoryMaxed,
      levels: categoryLevels
    };
  }

  return stats;
};
