"use client";

import { Header } from "@/components/assets/Header";
import { VStack, Text, Center, Box, Image } from "@chakra-ui/react";

export const HistoryPageContainer = () => {
  return (
    <VStack h="100vh" alignItems="center">
      <VStack
        position="relative"
        maxW="25rem"
        w="100%"
        h="100%"
        bgColor="rgba(92, 126, 94, 0.4)"
        borderRight={"1px solid #6f6c6c"}
        borderLeft={"1px solid #6f6c6c"}
        color="#352B2B"
      >
        <Header />
        <VStack>
          <VStack
            mt="232px"
            opacity={1}
            bg="rgba(248, 248, 248, 1)"
            p={3}
            py={5}
            borderRadius={5}
          >
            <Text>This page is under construction.</Text>
            <Text>You can search your logs when it comes🪽</Text>
            <Text>Stay tune!</Text>
          </VStack>
          <Box pos="absolute" bottom="200px">
            <Image src="hakatch/white/default.gif" />
          </Box>
        </VStack>
      </VStack>
    </VStack>
  );
};
