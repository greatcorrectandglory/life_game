import { snapshotState } from "../core/state.js";

const STAT_LABELS = {
  money: "金钱",
  social: "社交",
  energy: "精力",
  energy_max: "精力上限",
  stress: "压力",
  stress_max: "压力上限"
};

const TALENT_LABELS = {
  rational: "理性",
  empathic: "感性",
  grit: "坚韧"
};

const FLAG_LABELS = {
  stage_teen: "阶段: 少年期",
  stage_college: "阶段: 大学期",
  stage_career: "阶段: 职场期",
  stage_crisis: "阶段: 冲击期",
  industry_arch: "行业: 建筑",
  industry_uncertain: "行业: 不确定路线"
};

const mapList = (items, labels) =>
  items.map((item) => labels[item] || item);

const formatStats = (stats) => {
  const energy = stats.energy ?? 0;
  const energyMax = stats.energy_max ?? 0;
  const stress = stats.stress ?? 0;
  const stressMax = stats.stress_max ?? 0;
  const parts = [
    `${STAT_LABELS.money}: ${stats.money ?? 0}`,
    `${STAT_LABELS.social}: ${stats.social ?? 0}`,
    `${STAT_LABELS.energy}: ${energy}/${energyMax}`,
    `${STAT_LABELS.stress}: ${stress}/${stressMax}`
  ];
  return parts.join(" | ");
};

export const renderScene = (sceneEl, scene) => {
  sceneEl.textContent = scene.text;
};

export const renderChoices = (choicesEl, choices, onPick) => {
  choicesEl.innerHTML = "";
  choices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "choice";
    button.type = "button";
    button.textContent = choice.text;
    button.addEventListener("click", () => onPick(choice));
    choicesEl.appendChild(button);
  });
};

export const renderStatus = (statusEl, state) => {
  const view = snapshotState(state);
  const stats = formatStats(view.stats);
  const talent = TALENT_LABELS[view.props.talent] || "未定";
  statusEl.textContent = `${stats} | 天赋: ${talent}`;
};

export const renderRecap = (sceneEl, state) => {
  const view = snapshotState(state);
  const stats = formatStats(view.stats);
  const tags = view.tags.length ? mapList(view.tags, {}).join("、") : "无";
  const traits = view.traits.length ? mapList(view.traits, {}).join("、") : "无";
  const flags = view.flags.length ? mapList(view.flags, FLAG_LABELS).join("、") : "无";
  const recap = document.createElement("div");
  recap.className = "scene__recap";
  recap.innerHTML = `\n    <div><strong>属性</strong>：${stats}</div>\n    <div><strong>标签</strong>：${tags}</div>\n    <div><strong>特质</strong>：${traits}</div>\n    <div><strong>旗标</strong>：${flags}</div>\n  `;
  sceneEl.appendChild(recap);
};
