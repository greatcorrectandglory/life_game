import { meetsConditions } from "./state.js";

const isEligible = (state, event) => {
  const turn = state.props.turn || 0;
  if (event.minTurn !== undefined && turn < event.minTurn) {
    return false;
  }
  if (event.maxTurn !== undefined && turn > event.maxTurn) {
    return false;
  }
  return meetsConditions(state, event.conditions);
};

export const pickRandomEvent = (data, state) => {
  const events = data.randomEvents || [];
  const pool = events.filter((event) => isEligible(state, event));
  if (pool.length === 0) {
    return null;
  }
  const totalWeight = pool.reduce((sum, event) => sum + (event.weight || 1), 0);
  let roll = Math.random() * totalWeight;
  for (const event of pool) {
    roll -= event.weight || 1;
    if (roll <= 0) {
      return event.id;
    }
  }
  return pool[pool.length - 1].id;
};
