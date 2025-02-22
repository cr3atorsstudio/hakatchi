import { Container, HStack, Text } from "@chakra-ui/react";

interface GhostSummaryProps {
  name: string;
  age: number;
}

export const GhostSummary = ({
  name,
  age,
}: GhostSummaryProps) => {
  return (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>{name}</Text>
        <Text>{age} days</Text>
      </HStack>
    </Container>
  );
};
