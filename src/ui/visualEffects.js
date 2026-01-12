/**
 * 视觉特效增强模块 - Visual Effects
 *
 * 为游戏添加情感冲击的视觉反馈:
 * - 压力爆发特效
 * - 升华特效
 * - 章节切换动画
 * - 剧情触发特效
 */

/**
 * 压力爆发特效 (屏幕震动 + 红色闪烁)
 */
export const playStressExplosionEffect = () => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  // 添加震动class
  gameContainer.classList.add('screen-shake');

  // 红色脉冲覆盖层
  const overlay = document.createElement('div');
  overlay.className = 'stress-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0) 70%);
    pointer-events: none;
    z-index: 9999;
    animation: stressPulse 1s ease-out;
  `;

  document.body.appendChild(overlay);

  // 清理
  setTimeout(() => {
    gameContainer.classList.remove('screen-shake');
  }, 500);

  setTimeout(() => {
    overlay.remove();
  }, 1000);
};

/**
 * 升华特效 (金色粒子爆发)
 */
export const playVirtueEffect = () => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  // 金色光效覆盖层
  const overlay = document.createElement('div');
  overlay.className = 'virtue-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 191, 36, 0) 70%);
    pointer-events: none;
    z-index: 9999;
    animation: virtueBurst 1.5s ease-out;
  `;

  document.body.appendChild(overlay);

  // 粒子效果
  for (let i = 0; i < 30; i++) {
    createVirtueParticle();
  }

  setTimeout(() => {
    overlay.remove();
  }, 1500);
};

/**
 * 创建升华粒子
 */
const createVirtueParticle = () => {
  const particle = document.createElement('div');
  particle.className = 'virtue-particle';

  const startX = Math.random() * window.innerWidth;
  const startY = Math.random() * window.innerHeight;
  const angle = Math.random() * Math.PI * 2;
  const distance = 100 + Math.random() * 200;
  const endX = startX + Math.cos(angle) * distance;
  const endY = startY + Math.sin(angle) * distance;

  particle.style.cssText = `
    position: fixed;
    left: ${startX}px;
    top: ${startY}px;
    width: 8px;
    height: 8px;
    background: radial-gradient(circle, #fbbf24, transparent);
    border-radius: 50%;
    pointer-events: none;
    z-index: 10000;
    animation: particleFade 1.5s ease-out forwards;
  `;

  document.body.appendChild(particle);

  // 动画移动
  particle.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1 },
      { transform: `translate(${endX - startX}px, ${endY - startY}px) scale(0)`, opacity: 0 },
    ],
    {
      duration: 1500,
      easing: 'ease-out',
    }
  );

  setTimeout(() => {
    particle.remove();
  }, 1500);
};

/**
 * 章节切换动画 (岁月流逝效果)
 */
export const playChapterTransition = (fromChapter, toChapter, callback) => {
  const overlay = document.createElement('div');
  overlay.className = 'chapter-transition';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.95) 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 10001;
    animation: fadeIn 0.5s ease-out;
  `;

  const content = document.createElement('div');
  content.style.cssText = `
    text-align: center;
    color: #fff;
    animation: fadeInScale 0.8s ease-out;
  `;

  content.innerHTML = `
    <div style="font-size: 18px; opacity: 0.7; margin-bottom: 20px; animation: fadeOut 1s 2s forwards;">
      ${fromChapter}
    </div>
    <div style="font-size: 60px; font-weight: bold; margin: 30px 0; background: linear-gradient(45deg, #fbbf24, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; animation: glow 2s ease-in-out infinite;">
      ${toChapter}
    </div>
    <div style="font-size: 16px; opacity: 0.8; margin-top: 20px;">
      时光流转，人生进入新的篇章
    </div>
  `;

  overlay.appendChild(content);
  document.body.appendChild(overlay);

  // 3秒后淡出
  setTimeout(() => {
    overlay.style.animation = 'fadeOut 1s ease-out';
    setTimeout(() => {
      overlay.remove();
      if (callback) callback();
    }, 1000);
  }, 3000);
};

/**
 * 剧情触发特效 (金色边框闪烁)
 */
export const playStoryTriggerEffect = () => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  gameContainer.classList.add('story-glow');

  setTimeout(() => {
    gameContainer.classList.remove('story-glow');
  }, 2000);
};

/**
 * 回响事件特效 (紫色波纹)
 */
export const playEchoEffect = () => {
  const overlay = document.createElement('div');
  overlay.className = 'echo-ripple';
  overlay.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100px;
    height: 100px;
    border: 3px solid #a855f7;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 9999;
    animation: rippleExpand 2s ease-out;
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 2000);
};

/**
 * 压力状态视觉反馈 (持续效果)
 */
export const updateStressVisual = (stressLevel) => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  // 移除所有压力class
  gameContainer.classList.remove('stress-low', 'stress-medium', 'stress-high', 'stress-critical');

  // 根据压力等级添加对应class
  if (stressLevel < 40) {
    // 低压力,无特效
  } else if (stressLevel < 60) {
    gameContainer.classList.add('stress-medium'); // 轻微红色边缘
  } else if (stressLevel < 80) {
    gameContainer.classList.add('stress-high'); // 明显红色脉动
  } else {
    gameContainer.classList.add('stress-critical'); // 强烈红色警告
  }
};

/**
 * 心流状态视觉反馈
 */
export const updateFlowVisual = (isInFlow) => {
  const gameContainer = document.getElementById('game-container');
  if (!gameContainer) return;

  if (isInFlow) {
    gameContainer.classList.add('flow-state');
  } else {
    gameContainer.classList.remove('flow-state');
  }
};

/**
 * 健康警告特效 (健康值过低)
 */
export const playHealthWarningEffect = () => {
  const overlay = document.createElement('div');
  overlay.className = 'health-warning';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 5px solid #ef4444;
    pointer-events: none;
    z-index: 9998;
    animation: healthPulse 1.5s ease-in-out 3;
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 4500);
};

/**
 * 成就解锁特效
 */
export const playAchievementUnlockEffect = (achievementName) => {
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: -400px;
    width: 350px;
    padding: 20px;
    background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    border-left: 4px solid #fbbf24;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    z-index: 10000;
    animation: slideInRight 0.5s ease-out forwards, slideOutRight 0.5s 3s ease-in forwards;
  `;

  notification.innerHTML = `
    <div style="font-size: 14px; color: #fbbf24; font-weight: bold; margin-bottom: 5px;">🏆 成就解锁</div>
    <div style="font-size: 18px; color: #fff; font-weight: bold;">${achievementName}</div>
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3500);
};

/**
 * 黑天鹅事件特效
 */
export const playBlackSwanEffect = (isPositive) => {
  const color = isPositive ? '#10b981' : '#ef4444';
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, ${color}33 0%, transparent 70%);
    pointer-events: none;
    z-index: 9999;
    animation: blackSwanFlash 2s ease-out;
  `;

  document.body.appendChild(overlay);

  setTimeout(() => {
    overlay.remove();
  }, 2000);
};
