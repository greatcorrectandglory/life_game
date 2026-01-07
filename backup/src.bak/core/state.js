const createInitialState = () => ({
  chapterIndex: 0,
  turn: 1,
  chapterTurn: 1,
  energyMax: 6,
  energy: 6,
  stats: {
    health: 8,
    mood: 6,
    knowledge: 6,
    skill: 4,
    creativity: 4,
    social: 4,
    money: 2,
    stress: 0
  },
  stressType: "Eustress",
  resilience: 5,
  entropyPool: 0,
  lastActionGroup: null,
  skipTurn: 0,
  talents: { rational: 0, empathic: 0, grit: 0 },
  talentMode: null,
  talentPoints: 5,
  talentDraft: { rational: 0, empathic: 0, grit: 0 },
  skillPoints: 0,
  skills: {},
  actionCounts: {},
  quests: { main: null, side: [], completed: [] },
  chain: { title: null, index: 0, steps: [] },
  log: [],
  storyQueue: [],
  storyText: "",
  storyTimer: 0,
  storyHold: 0,
  title: "新人",
  achievements: {},
  questCounts: { main: 0, side: 0, chain: 0 },
  lastSwanTurn: -99,
  gameOver: false,
  modalLock: false,
  economy: { phase: "boom", phaseTurn: 0, phaseDuration: 4 },
  combat: null,
  skillSelectMode: false
});

const state = createInitialState();
const listeners = new Set();

const getState = () => state;

const notify = () => {
  listeners.forEach((listener) => listener(state));
};

const resetState = () => {
  const next = createInitialState();
  Object.keys(state).forEach((key) => delete state[key]);
  Object.assign(state, next);
  notify();
};

const patchState = (partial) => {
  if (!partial || typeof partial !== "object") {
    return;
  }
  Object.assign(state, partial);
  notify();
};

const subscribe = (listener) => {
  if (typeof listener !== "function") {
    return () => {};
  }
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export { createInitialState, state, getState, patchState, resetState, subscribe };
