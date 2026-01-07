export const player = {
  x: 160,
  y: 160,
  size: 18,
  speed: 160
};

const getStartX = () => (window.innerWidth - 800) / 2;
const startY = 140;

export const getZones = () => {
  const startX = getStartX();
  return [
    { id: "study", name: "学习区", x: startX + 50, y: startY, w: 120, h: 140, img: "assets/loc_study.png" },
    { id: "exercise", name: "运动区", x: startX + 250, y: startY - 20, w: 120, h: 140, img: "assets/loc_exercise.png" },
    { id: "social", name: "社交区", x: startX + 450, y: startY + 10, w: 120, h: 140, img: "assets/loc_social.png" },

    { id: "work", name: "工作区", x: startX + 80, y: startY + 200, w: 120, h: 140, img: "assets/loc_work.png" },
    { id: "create", name: "创作区", x: startX + 280, y: startY + 220, w: 120, h: 140, img: "assets/loc_create.png" },

    { id: "active_leisure", name: "主动娱乐", x: startX + 480, y: startY + 160, w: 100, h: 80, color: "#a78bfa" },
    { id: "passive_ent", name: "被动娱乐", x: startX + 480, y: startY + 250, w: 100, h: 80, color: "#f472b6" },
    { id: "rest", name: "休息区", x: startX + 600, y: startY + 200, w: 80, h: 100, img: "assets/loc_rest.png" },

    { id: "arena", name: "挑战场", x: startX + 650, y: startY + 100, w: 140, h: 160, img: "assets/loc_arena.png" },

    { id: "end", name: "结束回合", x: startX + 700, y: startY + 320, w: 120, h: 60, color: "#fbbf24" }
  ];
};
