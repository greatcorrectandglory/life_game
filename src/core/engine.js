import { applyEffects, meetsConditions } from "./state.js";

export const loadGameData = async () => {
  const response = await fetch("./src/data/scenes.json");
  if (!response.ok) {
    throw new Error("Failed to load scenes.json");
  }
  return response.json();
};

export const getSceneById = (data, id) =>
  data.scenes.find((scene) => scene.id === id);

export const getAvailableChoices = (state, scene) =>
  scene.choices.filter((choice) => meetsConditions(state, choice.conditions));

export const applyChoice = (state, choice) => {
  applyEffects(state, choice.effects);
  if (choice.next === "__return__") {
    const resume = state.props.returnScene;
    state.props.returnScene = null;
    return resume || null;
  }
  return choice.next || null;
};
