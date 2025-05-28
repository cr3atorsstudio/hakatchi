import { celestiaClient } from "@/lib/celestia-client";
import { Grave } from "../entities/Grave";
import { World } from "../world";

export class FeedSystem {
  private world: World;

  // 増減量の設定
  private readonly ENERGY_INCREASE = 20;
  private readonly CLEANLINESS_DECREASE = 5;
  private readonly MOOD_INCREASE = 3;

  constructor(world: World) {
    this.world = world;
  }

  feedGrave(graveId: string): Grave | null {
    const grave = this.world.getGraveById(graveId);

    if (!grave) {
      console.error(`Grave with ID ${graveId} not found`);
      return null;
    }

    const { grave: graveComponent } = grave.components;

    // ステータスを更新
    const updatedGrave = this.updateGraveStatus(
      grave,
      graveComponent.energy + this.ENERGY_INCREASE,
      graveComponent.cleanliness - this.CLEANLINESS_DECREASE,
      graveComponent.mood + this.MOOD_INCREASE
    );

    // 変更をブロックチェーンに記録
    this.recordStatusChange(updatedGrave, {
      energy: this.ENERGY_INCREASE,
      cleanliness: -this.CLEANLINESS_DECREASE,
      mood: this.MOOD_INCREASE,
    });

    return updatedGrave;
  }

  private updateGraveStatus(
    grave: Grave,
    energy: number,
    cleanliness: number,
    mood: number
  ): Grave {
    const updatedGrave = { ...grave };
    updatedGrave.components.grave = {
      ...grave.components.grave,
      energy: Math.max(0, Math.min(100, energy)),
      cleanliness: Math.max(0, Math.min(100, cleanliness)),
      mood: Math.max(0, Math.min(100, mood)),
      lastUpdated: Date.now(),
    };

    // ワールドの状態を更新
    this.world.updateGrave(updatedGrave);

    return updatedGrave;
  }

  private recordStatusChange(
    grave: Grave,
    changes: { energy: number; cleanliness: number; mood: number }
  ): void {
    celestiaClient.submitBlob({
      action: "feed",
      tokenId: grave.tokenId,
      timestamp: Date.now(),
      changes,
    });
  }
}
