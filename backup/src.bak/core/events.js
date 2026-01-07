const resolveStress = (state) => {
  if (!state || !state.stats) {
    return null;
  }
  if (state.stats.stress < 15) {
    return null;
  }
  const resilience = state.resilience || 0;
  const virtueChance = Math.min(0.3 + resilience * 0.02, 0.6);
  const roll = Math.random();
  if (roll <= virtueChance) {
    state.stats.stress = 0;
    state.stats.mood = Math.max(0, (state.stats.mood || 0) + 3);
    state.stats.health = Math.max(0, (state.stats.health || 0) + 2);
    state.stats.skill = Math.max(0, (state.stats.skill || 0) + 1);
    state.title = "无畏";
    return {
      type: "virtue",
      title: "压力升华",
      text: "你在高压中完成了突破，状态进入高峰。",
      rewards: { mood: 3, health: 2, skill: 1 }
    };
  }
  state.skipTurn = 1;
  state.stats.health = Math.max(0, Math.floor((state.stats.health || 0) * 0.5));
  state.stats.mood = Math.max(0, Math.floor((state.stats.mood || 0) * 0.5));
  return {
    type: "meltdown",
    title: "压力崩溃",
    text: "你被压力压垮，只能暂缓行动。",
    rewards: { health: -2, mood: -2 }
  };
};

export { resolveStress };
