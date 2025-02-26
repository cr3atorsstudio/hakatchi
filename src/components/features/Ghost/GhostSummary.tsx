import { Container, HStack, Text } from "@chakra-ui/react";

interface GhostSummaryProps {
  name: string | null;
  age: number;
}

export const GhostSummary = ({ name, age }: GhostSummaryProps) => {
  // const hoge = await useUser();

  console.log({ name });

  return (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>{name}</Text>
        <Text>{age} days</Text>
      </HStack>
    </Container>
  );
};
