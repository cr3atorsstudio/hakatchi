import { Container, HStack, Text } from "@chakra-ui/react";

export const GhostSummary = () => {
  return (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>HAKANYAN</Text>
        <Text>10 days</Text>
      </HStack>
    </Container>
  );
};
