import { Container, Image, Flex } from "@chakra-ui/react";

export const GhostImage = () => {
  return (
    <Container>
      <Flex w="100%" alignItems="center" flexDir="column">
        <Image src="main-image.png" alt="main image" />
      </Flex>
    </Container>
  );
};
