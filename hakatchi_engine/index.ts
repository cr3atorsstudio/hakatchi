import { createGraveComponent } from "./components/GraveComponent";
import { createGrave } from "./entities/Grave";
import { DecaySystem } from "./systems/DecaySystem";
import { FeedSystem } from "./systems/FeedSystem";
import { World } from "./world";

// ワールドの初期化
const world = new World();

// システムの初期化
const decaySystem = new DecaySystem(world);
const feedSystem = new FeedSystem(world);

// システムの開始
decaySystem.start();

// APIエンドポイント用の関数
export function createNewGrave(tokenId: number, owner: string): any {
  const graveId = `grave_${tokenId}`;
  const graveComponent = createGraveComponent();
  const grave = createGrave(graveId, tokenId, owner, graveComponent);

  world.addGrave(grave);

  return {
    id: grave.id,
    tokenId: grave.tokenId,
    owner: grave.owner,
    status: {
      energy: grave.components.grave.energy,
      cleanliness: grave.components.grave.cleanliness,
      mood: grave.components.grave.mood,
    },
  };
}

export function feedGrave(graveId: string): any {
  const updatedGrave = feedSystem.feedGrave(graveId);

  if (!updatedGrave) {
    return { success: false, error: "Grave not found" };
  }

  return {
    success: true,
    id: updatedGrave.id,
    tokenId: updatedGrave.tokenId,
    status: {
      energy: updatedGrave.components.grave.energy,
      cleanliness: updatedGrave.components.grave.cleanliness,
      mood: updatedGrave.components.grave.mood,
    },
  };
}

export function getGraveStatus(graveId: string): any {
  const grave = world.getGraveById(graveId);

  if (!grave) {
    return { success: false, error: "Grave not found" };
  }

  return {
    success: true,
    id: grave.id,
    tokenId: grave.tokenId,
    status: {
      energy: grave.components.grave.energy,
      cleanliness: grave.components.grave.cleanliness,
      mood: grave.components.grave.mood,
    },
  };
}

// 型定義のエクスポート
export * from "./components/GraveComponent";
export * from "./entities/Grave";
export * from "./types";
