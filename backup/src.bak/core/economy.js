const PHASES = [
  { id: "boom", label: "繁荣", workMultiplier: 1.5 },
  { id: "steady", label: "平稳", workMultiplier: 1.0 },
  { id: "bust", label: "萧条", workMultiplier: 0.3 },
  { id: "recovery", label: "复苏", workMultiplier: 0.8 }
];

const getPhaseIndex = (phaseId) => PHASES.findIndex((phase) => phase.id === phaseId);

const getCurrentPhase = (economy) => {
  const idx = getPhaseIndex(economy.phase);
  return PHASES[idx >= 0 ? idx : 0];
};

const updateEconomy = (state) => {
  const economy = state.economy;
  if (!economy) {
    return;
  }
  economy.phaseTurn += 1;
  if (economy.phaseTurn < economy.phaseDuration) {
    return;
  }
  economy.phaseTurn = 0;
  const currentIndex = getPhaseIndex(economy.phase);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % PHASES.length : 1;
  economy.phase = PHASES[nextIndex].id;
};

const getWorkMultiplier = (state) => {
  const economy = state.economy;
  if (!economy) {
    return 1;
  }
  return getCurrentPhase(economy).workMultiplier;
};

const getEconomyLabel = (state) => {
  const economy = state.economy;
  if (!economy) {
    return "未知";
  }
  return getCurrentPhase(economy).label;
};

export { updateEconomy, getWorkMultiplier, getEconomyLabel };
