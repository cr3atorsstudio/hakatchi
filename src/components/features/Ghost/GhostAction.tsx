import { HStack, Button, VStack } from "@chakra-ui/react";

export const GhostAction = () => {
  return (
    <VStack mt={4}>
      <HStack>
        <Button>FEED</Button>
        <Button>CLEAN</Button>
        <Button>ITEM</Button>
      </HStack>
      <HStack>
        <Button>PLAY</Button>
        <Button>BLEED</Button>
      </HStack>
    </VStack>
  );
};
