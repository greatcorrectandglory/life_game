import { getState } from '../core/enhancedState.js';

/**
 * Synchronize start game modal display
 * Handles talent selection UI
 */
export const syncStartModal = (callbacks = {}) => {
    const state = getState();
    const guide = document.getElementById("guide-overlay");
    const modal = document.getElementById("start-modal");

    if (state.talentMode === "ready") {
        if (modal) modal.remove();
        return;
    }

    if (state.talentMode === "manual") {
        if (modal) modal.remove();
        if (guide) {
            guide.textContent = "手动分配天赋：Q/W/E +1，A/S/D -1，Enter确认";
        }
        return;
    }

    if (!modal) {
        const nextModal = document.createElement("div");
        nextModal.id = "start-modal";
        nextModal.className = "overlay";
        nextModal.innerHTML = `
       <div class="glass-panel" style="padding:40px;text-align:center">
         <h1 style="color:var(--accent-cyan);margin-bottom:20px">反脆弱人生</h1>
         <p style="color:#ccc;margin-bottom:30px">在这个赛博世界中，你的每一个决定都至关重要。</p>
         <button id="btn-start-game" style="font-size:18px;padding:12px 40px">随机天赋并开始</button>
       </div>
     `;
        document.body.appendChild(nextModal);

        const startBtn = document.getElementById("btn-start-game");
        if (startBtn) {
            startBtn.onclick = () => {
                if (callbacks.onStart) {
                    callbacks.onStart();
                }

                nextModal.remove();
                if (guide) {
                    guide.textContent = "点击场景进行互动 | 目标：完成左侧任务";
                }
            };
        }
    }

    if (guide) {
        guide.textContent = "请初始化您的天赋...";
    }
};
