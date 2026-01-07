export const INDUSTRY_PHASES = {
  EMERGING: "emerging",
  GROWTH: "growth",
  MATURE: "mature",
  DECLINE: "decline",
  COLLAPSE: "collapse",
  DISRUPTED: "disrupted",
};

export const INDUSTRY_DEFINITIONS = {
  tech: {
    id: "tech",
    name: "科技互联网",
    phases: [
      INDUSTRY_PHASES.EMERGING,
      INDUSTRY_PHASES.GROWTH,
      INDUSTRY_PHASES.MATURE,
      INDUSTRY_PHASES.DISRUPTED,
    ],
    volatility: 0.8,
    requiredSkills: ["programming", "logic", "creativity"],
    salaryMultiplier: { emerging: 0.8, growth: 1.5, mature: 1.2, disrupted: 0.5 },
    description: "高风险高回报，技术迭代极快",
  },
  finance: {
    id: "finance",
    name: "金融投资",
    phases: [
      INDUSTRY_PHASES.GROWTH,
      INDUSTRY_PHASES.MATURE,
      INDUSTRY_PHASES.DECLINE,
      INDUSTRY_PHASES.COLLAPSE,
    ],
    volatility: 0.6,
    requiredSkills: ["financial", "dataAnalysis", "riskManagement"],
    salaryMultiplier: { growth: 1.4, mature: 1.3, decline: 0.8, collapse: 0.2 },
    description: "周期性强，受宏观经济影响大",
  },
  architecture: {
    id: "architecture",
    name: "建筑设计",
    phases: [
      INDUSTRY_PHASES.MATURE,
      INDUSTRY_PHASES.DECLINE,
      INDUSTRY_PHASES.COLLAPSE,
      INDUSTRY_PHASES.EMERGING,
    ],
    volatility: 0.4,
    requiredSkills: ["spatialThinking", "aesthetics", "regulations"],
    salaryMultiplier: { mature: 1.1, decline: 0.7, collapse: 0.3, emerging: 0.9 },
    description: "受政策影响大，可能面临结构性崩塌",
  },
  creative: {
    id: "creative",
    name: "文化创意",
    phases: [
      INDUSTRY_PHASES.EMERGING,
      INDUSTRY_PHASES.GROWTH,
      INDUSTRY_PHASES.MATURE,
      INDUSTRY_PHASES.DISRUPTED,
    ],
    volatility: 0.7,
    requiredSkills: ["story", "aesthetic", "craft"],
    salaryMultiplier: { emerging: 0.6, growth: 1.2, mature: 1.0, disrupted: 0.4 },
    description: "依赖灵感与版权，收入不稳定",
  },
  healthcare: {
    id: "healthcare",
    name: "医疗健康",
    phases: [INDUSTRY_PHASES.GROWTH, INDUSTRY_PHASES.MATURE],
    volatility: 0.2,
    requiredSkills: ["foundation", "care", "resilience"],
    salaryMultiplier: { growth: 1.2, mature: 1.2 },
    description: "需求稳定，抗周期性强",
  },
};

/**
 * 更新所有行业状态（每回合调用）
 */
export const updateIndustries = (state) => {
  const industries = { ...state.economy.industries };
  let collapseEvent = null;

  for (const [id, data] of Object.entries(industries)) {
    const def = INDUSTRY_DEFINITIONS[id];
    if (!def) continue;

    // 随机波动健康度
    const change = (Math.random() - 0.5) * def.volatility * 5;
    data.health = Math.max(0, Math.min(100, data.health + change));

    // 检查生命周期推进
    if (Math.random() < def.volatility * 0.05) {
      const currentIdx = def.phases.indexOf(data.phase);
      if (currentIdx < def.phases.length - 1) {
        // 5% 概率进入下一阶段
        data.phase = def.phases[currentIdx + 1];
        data.health = Math.max(20, data.health - 20); // 换阶段初期健康度下降

        // 检测崩溃事件
        if (
          data.phase === INDUSTRY_PHASES.COLLAPSE ||
          data.phase === INDUSTRY_PHASES.DISRUPTED
        ) {
          collapseEvent = {
            industry: id,
            type: "industry_collapse",
            severity: "major",
            text: `【行业预警】${def.name}进入了${data.phase}阶段，大量职位正在消失...`,
          };
        }
      } else if (
        data.phase === INDUSTRY_PHASES.COLLAPSE ||
        data.phase === INDUSTRY_PHASES.DISRUPTED
      ) {
        // 崩溃后有概率重生
        if (Math.random() < 0.1) {
          data.phase = def.phases[0];
          data.health = 50;
        }
      }
    }
  }

  return { industries, collapseEvent };
};

/**
 * 获取当前行业薪资倍率
 */
export const getSalaryMultiplier = (industryId, state) => {
  const industry = state.economy.industries[industryId];
  const def = INDUSTRY_DEFINITIONS[industryId];

  if (!industry || !def) return 1.0;

  let multiplier = def.salaryMultiplier[industry.phase] || 1.0;

  // 加上行业健康度修正
  const healthMod = industry.health / 100;
  return multiplier * (0.5 + healthMod);
};
