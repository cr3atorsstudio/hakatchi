import { GhostAction, GhostType, HakaType } from "@/types/ghost";
import { Container, Image, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface GhostImageProps {
  hakaType: HakaType;
  ghostType: GhostType;
  action: GhostAction;
  setCharaAction: Dispatch<SetStateAction<GhostAction>>;
}

export const GhostImage = ({
  hakaType,
  ghostType,
  action,
  setCharaAction,
}: GhostImageProps) => {
  useEffect(() => {
    if (action === "eatingApple") {
      switch (ghostType) {
        case "white":
          setTimeout(() => {
            setCharaAction("default");
          }, 3000);
          break;
        case "purple":
          setTimeout(() => {
            setCharaAction("default");
          }, 3200);
          break;
        case "blue":
          setTimeout(() => {
            setCharaAction("default");
          }, 3400);
          break;
        case "green":
          setTimeout(() => {
            setCharaAction("default");
          }, 4000);
          break;
      }
    }
  }, [action]);

  return (
    <Container>
      <Flex w="100%" alignItems="center" flexDir="column">
        <Image
          position="relative"
          w="100%"
          src={"/heya/" + hakaType + "/room.png"}
          alt=""
        />
        <Image
          position="absolute"
          w="100%"
          src={"/heya/" + hakaType + "/grave.png"}
          alt=""
        />
        <Image
          position="absolute"
          w="100%"
          src={"/heya/" + hakaType + "/table.png"}
          alt=""
        />
        {action === "eatingApple" && (
          <Image
            position="absolute"
            w="100%"
            src={"/heya/" + hakaType + "/apple.png"}
            alt=""
          />
        )}
        <Image
          position="absolute"
          w="100%"
          src={"/hakatch/" + ghostType + "/" + action + ".gif"}
          alt=""
        />
      </Flex>
    </Container>
  );
};
