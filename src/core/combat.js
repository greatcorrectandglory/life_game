/**
 * 战斗系统核心引擎
 * 基于反脆弱人生的回合制战斗系统
 */

/**
 * 创建战斗状态
 */
export const createCombatState = (playerStats, enemy) => {
  const maxHp = Math.floor((playerStats.health || 8) * 5 + (playerStats.mood || 6) * 3);
  const maxMp = Math.floor((playerStats.knowledge || 6) * 2 + (playerStats.skill || 4) * 2);
  
  return {
    active: true,
    turn: 1,
    phase: 'player', // 'player' | 'enemy' | 'victory' | 'defeat'
    
    player: {
      hp: maxHp,
      maxHp,
      mp: maxMp,
      maxMp,
      atk: Math.floor((playerStats.knowledge || 6) + (playerStats.skill || 4) * 1.5),
      def: Math.floor((playerStats.social || 4) * 0.8),
      speed: 10,
      defending: false,
      buffs: []
    },
    
    enemy: {
      ...enemy,
      currentHp: enemy.hp,
      defending: false,
      debuffs: []
    },
    
    log: [`遭遇挑战：${enemy.name}！`],
    result: null
  };
};

/**
 * 计算伤害
 */
export const calculateDamage = (attacker, defender, isSkill = false, skillPower = 1) => {
  const baseDamage = attacker.atk * skillPower;
  const defense = defender.defending ? defender.def * 2 : defender.def;
  const damage = Math.max(1, Math.floor(baseDamage - defense * 0.5));
  const variance = Math.floor(damage * 0.2 * (Math.random() - 0.5));
  return Math.max(1, damage + variance);
};

/**
 * 执行玩家攻击
 */
export const executeAttack = (state) => {
  const damage = calculateDamage(state.player, state.enemy);
  state.enemy.currentHp = Math.max(0, state.enemy.currentHp - damage);
  state.log.push(`你发起攻击，造成 ${damage} 点伤害！`);
  
  if (state.enemy.currentHp <= 0) {
    state.phase = 'victory';
    state.log.push(`战胜了${state.enemy.name}！`);
    state.result = 'victory';
  } else {
    state.phase = 'enemy';
  }
  
  state.player.defending = false;
  return state;
};

/**
 * 执行玩家防御
 */
export const executeDefend = (state) => {
  state.player.defending = true;
  state.log.push('你进入防御姿态，下次受到伤害减半。');
  state.phase = 'enemy';
  return state;
};

/**
 * 执行技能
 */
export const executeSkill = (state, skill) => {
  if (state.player.mp < skill.cost) {
    state.log.push('精力不足，无法使用该技能！');
    return state;
  }
  
  state.player.mp -= skill.cost;
  
  if (skill.damage) {
    const damage = calculateDamage(state.player, state.enemy, true, skill.power || 1.5);
    state.enemy.currentHp = Math.max(0, state.enemy.currentHp - damage);
    state.log.push(`使用「${skill.name}」，造成 ${damage} 点伤害！`);
  }
  
  if (skill.heal) {
    const healAmount = Math.floor(skill.heal);
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + healAmount);
    state.log.push(`使用「${skill.name}」，恢复 ${healAmount} 点生命！`);
  }
  
  if (skill.buff) {
    state.player.buffs.push({ ...skill.buff, turns: skill.buff.duration || 2 });
    state.log.push(`使用「${skill.name}」，${skill.buffDesc || '获得增益效果'}！`);
  }
  
  if (state.enemy.currentHp <= 0) {
    state.phase = 'victory';
    state.log.push(`战胜了${state.enemy.name}！`);
    state.result = 'victory';
  } else {
    state.phase = 'enemy';
  }
  
  state.player.defending = false;
  return state;
};

/**
 * 尝试逃跑
 */
export const executeEscape = (state) => {
  const escapeChance = 0.4 + (state.player.speed * 0.02);
  if (Math.random() < escapeChance) {
    state.phase = 'escape';
    state.result = 'escape';
    state.log.push('成功逃离了战斗！');
  } else {
    state.log.push('逃跑失败！');
    state.phase = 'enemy';
  }
  return state;
};

/**
 * 执行敌人回合
 */
export const executeEnemyTurn = (state) => {
  if (state.phase !== 'enemy') return state;
  
  const enemy = state.enemy;
  const damage = calculateDamage(
    { atk: enemy.atk, def: 0 },
    state.player
  );
  
  state.player.hp = Math.max(0, state.player.hp - damage);
  state.log.push(`${enemy.name} 发起攻击，造成 ${damage} 点伤害！`);
  
  if (state.player.hp <= 0) {
    state.phase = 'defeat';
    state.result = 'defeat';
    state.log.push('你被击败了...');
  } else {
    state.turn += 1;
    state.phase = 'player';
    state.player.defending = false;
    
    // 处理buff持续时间
    state.player.buffs = state.player.buffs
      .map(b => ({ ...b, turns: b.turns - 1 }))
      .filter(b => b.turns > 0);
  }
  
  return state;
};

/**
 * 计算战斗奖励
 */
export const calculateRewards = (enemy) => {
  const rewards = { ...(enemy.reward || {}) };
  
  // 基础奖励
  if (!rewards.skillPoints) {
    rewards.skillPoints = Math.random() < 0.3 ? 1 : 0;
  }
  
  return rewards;
};

/**
 * 应用奖励到游戏状态
 */
export const applyRewards = (gameState, rewards) => {
  Object.entries(rewards).forEach(([key, value]) => {
    if (key === 'skillPoints') {
      gameState.skillPoints = (gameState.skillPoints || 0) + value;
    } else if (gameState.stats && gameState.stats[key] !== undefined) {
      gameState.stats[key] = Math.max(0, gameState.stats[key] + value);
    }
  });
  return gameState;
};
