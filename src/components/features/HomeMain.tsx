import { Flex, VStack, Box } from "@chakra-ui/react";
import { GhostSummary } from "./Ghost/GhostSummary";
import { GhostImage } from "./Ghost/GhostImage";
import { GhostAction } from "./Ghost/GhostAction";
import { GhostOverview } from "./Ghost/GhostOverview";
import { WalletConnectContainer } from "./WalletConnectContainer";

export const HomeMain = () => {
  return (
    <VStack alignItems="center">
      <VStack maxW="48rem" w="100%" bgColor="#5C7E5E">
        <VStack gap={0} w="100%">
          <GhostSummary />
          <GhostImage />
          <GhostAction />
          <GhostOverview />
        </VStack>
        <WalletConnectContainer />
      </VStack>
    </VStack>
  );
};
