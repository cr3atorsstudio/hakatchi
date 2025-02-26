import { Grave } from "./entities/Grave";

export class World {
  private graves: Map<string, Grave> = new Map();

  constructor() {}

  addGrave(grave: Grave): void {
    this.graves.set(grave.id, grave);
  }

  getGraveById(id: string): Grave | undefined {
    return this.graves.get(id);
  }

  getGraveByTokenId(tokenId: number): Grave | undefined {
    for (const grave of this.graves.values()) {
      if (grave.tokenId === tokenId) {
        return grave;
      }
    }
    return undefined;
  }

  getGraves(): Grave[] {
    return Array.from(this.graves.values());
  }

  updateGrave(grave: Grave): void {
    if (this.graves.has(grave.id)) {
      this.graves.set(grave.id, grave);
    }
  }

  removeGrave(id: string): boolean {
    return this.graves.delete(id);
  }
}
