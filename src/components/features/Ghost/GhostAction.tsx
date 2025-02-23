import { HStack, Button, VStack, Image } from "@chakra-ui/react";
import { GhostActionFeedButton } from "./GhostActionFeedButton";
import { GhostActionCleanButton } from "./GhostActionCleanButton";
import { GhostActionItemButton } from "./GhostActionItemButton";
import { GhostActionUnderConstructionButton } from "./GhostActionUnderConstructionButton";

export const GhostAction = () => {
  return (
    <VStack w="100%" mt={-4} gap="0.15rem">
      <HStack w="100%" justifyContent="center" gap="0.25rem">
        <GhostActionFeedButton />
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
