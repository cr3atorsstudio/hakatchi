import { GhostAction, GhostType, HakaType } from "@/types/ghost";
import { Container, Image, Flex } from "@chakra-ui/react";

interface GhostImageProps {
  hakaType: HakaType;
  ghostType: GhostType;
  action: GhostAction
}

export const GhostImage = ({
  hakaType,
  ghostType,
  action,
}: GhostImageProps) => {
  
  return (
    <Container>
      <Flex w="100%" alignItems="center" flexDir="column">
        <Image position="relative" w="100%" src={"/heya/" + hakaType + "/room.png"} alt="" />
        <Image position="absolute" w="100%" src={"/heya/" + hakaType + "/grave.png"} alt="" />
        <Image position="absolute" w="100%" src={"/heya/" + hakaType + "/table.png"} alt="" />
        <Image position="absolute" w="100%" src={"/hakatch/" + ghostType + "/" + action + ".gif"} alt="" />
      </Flex>
    </Container>
  );
};
