import { createInitialState } from "./core/enhancedState.js";
import { executeAction, advanceTurn } from "./core/gameLoop.js";
import { logger } from "./utils/logger.js";

/**
 * 自动平衡测试脚本
 * 模拟 1000 次游戏运行，检查数值分布
 */
const runSimulation = (iterations = 100) => {
  console.log(`Starting simulation: ${iterations} iterations`);
  
  const results = {
    endAge: [],
    finalMoney: [],
    finalStress: [],
    skillsLearned: [],
    blackSwansTriggered: 0,
    dilemmasTriggered: 0,
    virtueTriggered: 0,
    meltdownTriggered: 0,
  };

  for (let i = 0; i < iterations; i++) {
    const state = createInitialState();
    
    // 模拟直到游戏结束
    while (!state.gameOver && state.totalTurns < 105) {
      // 随机选择行动
      // 简单策略：优先学习，其次工作，压力大休息
      let actionId = "rest_sleep";
      
      if (state.stats.stress > 80) {
        actionId = "rest_sleep";
      } else if (state.energy > 5) {
        actionId = Math.random() > 0.5 ? "study_deep" : "work_routine";
      } else {
        actionId = "leisure_game";
      }
      
      executeAction(actionId);
      advanceTurn();
      
      // 统计事件
      if (state.events.pending.some(e => e.eventType === "blackSwan")) results.blackSwansTriggered++;
      if (state.events.pending.some(e => e.eventType === "dilemma")) results.dilemmasTriggered++;
    }
    
    // 记录结果
    results.endAge.push(state.age);
    results.finalMoney.push(state.stats.money);
    results.finalStress.push(state.stats.stress);
    results.skillsLearned.push(Object.keys(state.skills).length);
  }
  
  // 输出统计
  const avg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
  
  console.log("=== Simulation Results ===");
  console.log(`Avg End Age: ${avg(results.endAge)}`);
  console.log(`Avg Final Money: ${avg(results.finalMoney)}`);
  console.log(`Avg Skills Learned: ${avg(results.skillsLearned)}`);
  console.log(`Black Swans per Game: ${results.blackSwansTriggered / iterations}`);
  console.log(`Dilemmas per Game: ${results.dilemmasTriggered / iterations}`);
};

// 导出供手动运行
export { runSimulation };
