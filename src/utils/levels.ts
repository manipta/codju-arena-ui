export interface Level {
  level: number;
  name: string;
  minXP: number;
  maxXP: number | null;
  school: string;
  emoji: string;
  color: string;
}

export const LEVELS: Level[] = [
  {
    level: 1,
    name: "Seed",
    minXP: 0,
    maxXP: 200,
    school: "Home",
    emoji: "🌱",
    color: "#5DCAA5",
  },
  {
    level: 2,
    name: "Scout",
    minXP: 200,
    maxXP: 700,
    school: "Pre-Primary",
    emoji: "📘",
    color: "#378ADD",
  },
  {
    level: 3,
    name: "Spark",
    minXP: 700,
    maxXP: 2000,
    school: "Primary",
    emoji: "⚡",
    color: "#EF9F27",
  },
  {
    level: 4,
    name: "Blaze",
    minXP: 2000,
    maxXP: 5000,
    school: "Secondary",
    emoji: "👑",
    color: "#7F77DD",
  },
  {
    level: 5,
    name: "Nova",
    minXP: 5000,
    maxXP: null,
    school: "Sr. Secondary",
    emoji: "🌟",
    color: "#D85A30",
  },
];

export const getLevelFromXP = (xp: number): Level => {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i];
  }
  return LEVELS[0];
};

export const getXPProgress = (xp: number): number => {
  const level = getLevelFromXP(xp);
  if (!level.maxXP) return 100;
  return Math.round(((xp - level.minXP) / (level.maxXP - level.minXP)) * 100);
};

export const getXPToNext = (xp: number): number => {
  const level = getLevelFromXP(xp);
  if (!level.maxXP) return 0;
  return level.maxXP - xp;
};
