export type HakaType = "japanese" | "egyptian" | "romanian";

export type GhostType = "white" | "purple" | "blue" | "green";

export type GhostAction = "feedFreeFood" | "clean" | "default";

export interface HakatchInfo {
  hakaType: HakaType;
  ghostType: GhostType;
  name: string | null;
  age: number;
  state: {
    energy: number;
    cleanliness: number;
    mood: number;
  };
}
