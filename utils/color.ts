
const COLORS = [
  '#F87171', // red-400
  '#FB923C', // orange-400
  '#FBBF24', // amber-400
  '#A3E635', // lime-400
  '#4ADE80', // green-400
  '#34D399', // emerald-400
  '#2DD4BF', // teal-400
  '#67E8F9', // cyan-300
  '#60A5FA', // blue-400
  '#A78BFA', // violet-400
  '#F472B6', // pink-400
  '#EC4899', // fuchsia-500
];

export const getRandomColor = (existingColors: string[]): string => {
  const availableColors = COLORS.filter(c => !existingColors.includes(c));
  if (availableColors.length === 0) {
    // Fallback if all colors are used, just pick a random one
    return COLORS[Math.floor(Math.random() * COLORS.length)];
  }
  return availableColors[Math.floor(Math.random() * availableColors.length)];
};
