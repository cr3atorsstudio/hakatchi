import { HStack, Button, VStack, Image } from "@chakra-ui/react";
import { GhostActionFeedButton } from "./GhostActionFeedButton";
import { GhostActionCleanButton } from "./GhostActionCleanButton";
import { GhostActionItemButton } from "./GhostActionItemButton";
import { GhostActionUnderConstructionButton } from "./GhostActionUnderConstructionButton";
import { Dispatch, SetStateAction } from "react";
import { GhostAction as GhostActionType } from "@/types/ghost";

interface GhostActionProps {
  setCharaAction: Dispatch<SetStateAction<GhostActionType>>;
}

export const GhostAction = ({
  setCharaAction,
}: GhostActionProps) => {
  return (
    <VStack w="100%" mt={-4} gap="0.15rem">
      <HStack w="100%" justifyContent="center" gap="0.25rem">
        <GhostActionFeedButton setCharaAction={setCharaAction} />
        <GhostActionCleanButton />
        <GhostActionItemButton />
      </HStack>
      <HStack w="100%" justifyContent="center" gap="0.25rem">
        <GhostActionUnderConstructionButton label="PLAY" />
        <GhostActionUnderConstructionButton label="BREED" />
        <GhostActionUnderConstructionButton label="SHOP" />
      </HStack>
    </VStack>
  );
};
