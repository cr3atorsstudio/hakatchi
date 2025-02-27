import { useGetGrave } from "@/hooks/useGetGrave";
import { Grave } from "@/types";
import { GhostAction, GhostType, HakaType } from "@/types/ghost";
import { Container, Image, Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";

interface GhostImageProps {
  action: GhostAction;
  setCharaAction: Dispatch<SetStateAction<GhostAction>>;
}

export const GhostImage = ({ action, setCharaAction }: GhostImageProps) => {
  const { grave, error } = useGetGrave();
  const hakaType = grave ? grave.location : "romanian";
  const ghostType = grave ? grave.ghost_type : "romanian";
  /** when dirtiness is 100, the background image is totally blackout */
  const cleanliness = grave ? grave.dirtiness - 20 : 50;

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
    if (action === "clean") {
      setTimeout(() => {
        setCharaAction("default");
      }, 2000);
    }
  }, [action]);

  return (
    <Container>
      <Flex
        position={"relative"}
        w="100%"
        alignItems="center"
        flexDir="column"
        _after={{
          content: '""',
          display: "block",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: `rgba(0,0,0,${cleanliness / 100})`,
        }}
      >
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
        {action === "clean" && (
          <Image position="absolute" w="100%" src={"/heya/clean.png"} alt="" />
        )}
      </Flex>
    </Container>
  );
};
