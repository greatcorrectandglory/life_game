/**
 * 战斗UI渲染模块 (DOM版)
 * 负责更新 HTML Overlay 内容
 */

/**
 * 更新战斗主界面
 */
export const updateCombatUI = (combatState, onAction) => {
    const overlay = document.getElementById("combat-overlay");
    if (!combatState) {
        overlay.classList.add("hidden");
        return;
    }
    overlay.classList.remove("hidden");

    // 1. 更新敌人信息
    const enemy = combatState.enemy;
    const enemyArea = document.getElementById("combat-enemy-area");

    // 使用图片而不是纯CSSdiv
    enemyArea.innerHTML = `
    <img src="assets/enemy.png" class="enemy-avatar-img" alt="${enemy.name}" onerror="this.style.display='none'">
    <div class="enemy-info">
      <div id="enemy-name">${enemy.name}</div>
      <div class="enemy-hp-container"><div id="enemy-hp-bar" class="bar-fill red" style="width: 100%"></div></div>
      <p id="enemy-status" style="color:#94a3b8;margin-top:8px">${enemy.desc || ""}</p>
    </div>
  `;

    const enemyHpPercent = (enemy.currentHp / enemy.hp) * 100;
    document.getElementById("enemy-hp-bar").style.width = `${enemyHpPercent}%`;

    // 2. 更新玩家信息
    const p = combatState.player;
    const playerHpPercent = (p.hp / p.maxHp) * 100;
    const playerMpPercent = (p.mp / p.maxMp) * 100;

    const playerArea = document.getElementById("combat-player-area");
    // 保留原有结构但增加头像
    const playerControlsHTML = `<div id="combat-actions"></div>`; // 占位，后面会填充

    playerArea.innerHTML = `
    <div class="player-info-group">
      <img src="assets/player.png" class="player-avatar-img" alt="Player">
      <div class="player-stats-text">
        <div>HP <span style="color:var(--danger)">${p.hp}/${p.maxHp}</span></div>
        <div class="bar-bg sm"><div class="bar-fill red" style="width:${playerHpPercent}%"></div></div>
        
        <div style="margin-top:4px">MP <span style="color:var(--accent-cyan)">${p.mp}/${p.maxMp}</span></div>
        <div class="bar-bg sm"><div class="bar-fill blue" style="width:${playerMpPercent}%"></div></div>
      </div>
    </div>
    ${playerControlsHTML}
  `;

    // 3. 更新日志
    const logArea = document.getElementById("combat-log-area");
    logArea.innerHTML = combatState.log
        .slice(-6)
        .map(text => `<div>> ${text}</div>`)
        .join("");
    logArea.scrollTop = logArea.scrollHeight;

    // 4. 更新行动按钮 (注意：因为上面重设了 innerHTML，需要重新获取 container)
    const actionsContainer = document.getElementById("combat-actions");
    actionsContainer.innerHTML = ""; // 清空旧按钮

    const attachAction = (btn, handler) => {
        let fired = false;
        const fireOnce = (event) => {
            if (fired) return;
            fired = true;
            event.preventDefault();
            handler();
            window.setTimeout(() => { fired = false; }, 250);
        };
        btn.addEventListener("pointerdown", fireOnce);
        btn.addEventListener("click", fireOnce);
    };

    // 辅助函数：创建按钮
    const createBtn = (id, label, danger = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        if (danger) btn.classList.add("btn-danger");
        attachAction(btn, () => onAction(id));
        return btn;
    };

    if (combatState.phase === 'player') {
        actionsContainer.appendChild(createBtn('attack', '普通攻击'));
        actionsContainer.appendChild(createBtn('skill', '使用技能'));
        actionsContainer.appendChild(createBtn('defend', '防御姿态'));
        actionsContainer.appendChild(createBtn('escape', '尝试逃跑', true));
    } else if (['victory', 'defeat', 'escape'].includes(combatState.phase)) {
        const endBtn = createBtn('end_combat', '结束战斗');
        endBtn.style.gridColumn = "span 2";
        actionsContainer.appendChild(endBtn);
    } else {
        // 敌人回合
        const nextBtn = createBtn('next_step', '敌方行动...');
        nextBtn.style.gridColumn = "span 2";
        nextBtn.disabled = false; // 允许点击推进
        actionsContainer.appendChild(nextBtn);
    }
};

/**
 * 显示/更新技能选择弹窗
 * 注意：这里我们简单复用 combat-actions 区域或者创建一个新的临时遮罩
 * 为了简化，我们直接覆盖 combat-actions 区域显示技能列表
 */
export const showSkillSelect = (skills, onSelect, onCancel) => {
    const actionsContainer = document.getElementById("combat-actions");
    actionsContainer.innerHTML = "";

    // 临时改变 grid 布局以适应列表
    const originalStyle = actionsContainer.style.cssText;
    actionsContainer.style.display = "flex";
    actionsContainer.style.flexDirection = "column";
    actionsContainer.style.gap = "5px";
    actionsContainer.style.maxHeight = "150px";
    actionsContainer.style.overflowY = "auto";

    const attachAction = (btn, handler) => {
        let fired = false;
        const fireOnce = (event) => {
            if (fired) return;
            fired = true;
            event.preventDefault();
            handler();
            window.setTimeout(() => { fired = false; }, 250);
        };
        btn.addEventListener("pointerdown", fireOnce);
        btn.addEventListener("click", fireOnce);
    };

    skills.forEach(skill => {
        const btn = document.createElement("button");
        btn.innerHTML = `<b>${skill.name}</b> <small>(MP ${skill.cost})</small> - ${skill.desc}`;
        btn.style.textAlign = "left";
        attachAction(btn, () => {
            actionsContainer.style.cssText = originalStyle; // 恢复布局
            onSelect(skill);
        });
        actionsContainer.appendChild(btn);
    });

    const cancelBtn = document.createElement("button");
    cancelBtn.textContent = "返回";
    cancelBtn.className = "btn-danger";
    attachAction(cancelBtn, () => {
        actionsContainer.style.cssText = originalStyle;
        onCancel();
    });
    actionsContainer.appendChild(cancelBtn);
};
