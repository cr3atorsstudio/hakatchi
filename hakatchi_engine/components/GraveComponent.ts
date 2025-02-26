export interface GraveComponent {
  energy: number; // 0-100（ゼロで空腹）
  cleanliness: number; // 0-100（ゼロで真っ暗）
  mood: number; // 0-100（ゼロで遊んでくれない）
  lastUpdated: number; // 最終更新タイムスタンプ
}

export function createGraveComponent(
  energy = 100,
  cleanliness = 100,
  mood = 100
): GraveComponent {
  return {
    energy,
    cleanliness,
    mood,
    lastUpdated: Date.now(),
  };
}
