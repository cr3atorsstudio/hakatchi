import { Flex, VStack, Box } from "@chakra-ui/react";
import { GhostSummary } from "./Ghost/GhostSummary";
import { GhostImage } from "./Ghost/GhostImage";
import { GhostAction } from "./Ghost/GhostAction";
import { GhostOverview } from "./Ghost/GhostOverview";
import { WalletConnectContainer } from "./WalletConnectContainer";

export const HomeMain = () => {
  return (
    <VStack alignItems="center">
      <VStack maxW="48rem" w="100%">
        <Box>
          <GhostSummary />
          <GhostImage />
          <GhostAction />
          <GhostOverview />
        </Box>
        <WalletConnectContainer />
      </VStack>
    </VStack>
  );
};
