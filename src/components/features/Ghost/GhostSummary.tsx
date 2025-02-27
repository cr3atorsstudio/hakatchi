import { useGetGrave } from "@/hooks/useGetGrave";
import { Container, HStack, Text } from "@chakra-ui/react";

interface GhostSummaryProps {
  name: string | null;
  age: number;
}

export const GhostSummary = ({ name, age }: GhostSummaryProps) => {
  const { grave, error } = useGetGrave();

  return error ? (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>please reload</Text>
      </HStack>
    </Container>
  ) : (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>{grave ? grave.name : "--"}</Text>
        <Text>{grave ? grave.age : "--"} days</Text>
      </HStack>
    </Container>
  );
};
