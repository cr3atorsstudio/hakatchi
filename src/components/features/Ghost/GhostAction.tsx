import { HStack, Button, VStack, Image } from "@chakra-ui/react";
import { GhostActionFeedButton } from "./GhostActionFeedButton";
import { GhostActionCleanButton } from "./GhostActionCleanButton";
import { GhostActionItemButton } from "./GhostActionItemButton";

export const GhostAction = () => {
  return (
    <VStack w="100%" mt={-4} gap="0.15rem">
      <HStack w="100%" justifyContent="center" gap="0.25rem">
        <GhostActionFeedButton />
        <GhostActionCleanButton />
        <GhostActionItemButton />
      </HStack>
      <HStack w="100%" justifyContent="center" gap="0.25rem">
        <Button
          color="#193459"
          w="30%"
          h="2.875rem"
          maxW="7.5rem"
          pb="0.75rem"
          pl="0.3rem"
          letterSpacing="0.3rem"
          backgroundColor="transparent"
          backgroundImage={"url(/button/button2.png)"}
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
        >
          PLAY
        </Button>
        <Button
          color="#193459"
          w="30%"
          h="2.875rem"
          maxW="7.5rem"
          pb="0.75rem"
          pl="0.3rem"
          letterSpacing="0.3rem"
          backgroundColor="transparent"
          backgroundImage={"url(/button/button2.png)"}
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
        >
          BREED
        </Button>
        <Button
          color="#193459"
          w="30%"
          h="2.875rem"
          maxW="7.5rem"
          pb="0.75rem"
          pl="0.3rem"
          letterSpacing="0.3rem"
          backgroundColor="transparent"
          backgroundImage={"url(/button/button2.png)"}
          backgroundSize="contain"
          backgroundRepeat="no-repeat"
        >
          SHOP
        </Button>
      </HStack>
    </VStack>
  );
};
