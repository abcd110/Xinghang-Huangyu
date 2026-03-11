// 共享工具函数

export interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}

export function generateStars(count: number = 50): Star[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 3,
  }));
}
