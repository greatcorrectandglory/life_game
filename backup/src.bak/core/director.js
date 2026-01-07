const shouldTrigger = (state, minGap) => {
  const last = state.props.lastSwanTurn ?? -99;
  const turn = state.props.turn ?? 0;
  return turn - last >= minGap;
};

export const applyDirector = (state, nextSceneId) => {
  if (!nextSceneId) {
    return null;
  }

  const stress = state.stats.stress || 0;
  const money = state.stats.money || 0;
  const social = state.stats.social || 0;
  const turn = state.props.turn || 0;

  if (!shouldTrigger(state, 3)) {
    return nextSceneId;
  }

  const safeAndRich = stress < 20 && money > 3000;
  const highPressure = stress > 75;
  const hasOptionality = state.tags.has("optionality") || state.tags.has("cross_domain");

  if (highPressure && Math.random() < 0.4) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_negative_major";
  }

  if (safeAndRich && Math.random() < 0.35) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_negative_minor";
  }

  if (hasOptionality && social >= 2 && Math.random() < 0.25) {
    state.props.returnScene = nextSceneId;
    state.props.lastSwanTurn = turn;
    return "black_swan_positive_opportunity";
  }

  return nextSceneId;
};
