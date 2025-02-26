import { GraveComponent } from "../components/GraveComponent";

export interface Grave {
  id: string;
  tokenId: number;
  owner: string;
  components: {
    grave: GraveComponent;
  };
  createdAt: number;
}

export function createGrave(
  id: string,
  tokenId: number,
  owner: string,
  graveComponent: GraveComponent
): Grave {
  return {
    id,
    tokenId,
    owner,
    components: {
      grave: graveComponent,
    },
    createdAt: Date.now(),
  };
}
