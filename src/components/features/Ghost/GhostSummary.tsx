import { useGetGrave } from "@/hooks/useGetGrave";
import { Container, HStack, Link, Text } from "@chakra-ui/react";

export const GhostSummary = () => {
  const { grave, error } = useGetGrave();
  const url =
    "https://opensea.io/assets/arbitrum/0x09f480718ed735f8a1a6a7b3fea186f54e40b2ac/";

  return error ? (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        <Text>please reload</Text>
      </HStack>
    </Container>
  ) : (
    <Container bgColor="white">
      <HStack justifyContent="space-between" px={8} py={2}>
        {grave && grave.token_id ? (
          <Link href={url + grave.token_id}>{grave.name}</Link>
        ) : grave.name ? (
          <Text>{grave.name}</Text>
        ) : (
          <Text>--</Text>
        )}
        <Text>{grave ? grave.age : "--"} days</Text>
      </HStack>
    </Container>
  );
};
