import { Grave } from "@/types";
import { GhostType, HakatchInfo, HakaType } from "@/types/ghost";

/**
 * Converts a grave object to HakatchInfo format
 * @param grave The grave data from the database
 * @returns HakatchInfo object formatted for the UI
 */
export function convertGraveToHakatchInfo(grave: Grave): HakatchInfo {
  return {
    hakaType: grave.location as HakaType,
    ghostType: grave.ghost_type as GhostType,
    name: grave.name,
    age: grave.age,
    state: {
      energy: 100 - grave.hunger, // Convert hunger to energy (inverse)
      cleanliness: 100 - grave.dirtiness, // Convert dirtiness to cleanliness (inverse)
      mood: grave.mood,
    },
  };
}
