"use client";

import { VStack } from "@chakra-ui/react";
import { GhostSummary } from "./Ghost/GhostSummary";
import { GhostImage } from "./Ghost/GhostImage";
import { GhostAction } from "./Ghost/GhostAction";
import { GhostOverview } from "./Ghost/GhostOverview";
import { WalletConnectContainer } from "./WalletConnectContainer";
import { Header } from "../assets/Header";
import { HakatchInfo, GhostAction as GhostActionType } from "@/types/ghost";
import { useState } from "react";

export const HomeMain = () => {
  const [charaAction, setCharaAction] = useState<GhostActionType>("default");

  const hakatch_info: HakatchInfo = {
    hakaType: "romanian",
    ghostType: "purple",
    name: "Hakanyan",
    age: 10,
    state: {
      energy: 100,
      cleanliness: 50,
      mood: 50,
    },
  };

  return (
    <VStack h="100vh" alignItems="center">
      <VStack
        maxW="25rem"
        w="100%"
        h="100%"
        bgColor="#5C7E5E"
        borderRight={"1px solid #000"}
        borderLeft={"1px solid #000"}
        color="#352B2B"
      >
        <Header />
        <VStack gap={0} w="100%">
          <GhostSummary age={hakatch_info.age} name={hakatch_info.name} />
          <GhostImage
            hakaType={hakatch_info.hakaType}
            action={charaAction}
            ghostType={hakatch_info.ghostType}
          />
          <GhostAction />
          <GhostOverview
            energy={hakatch_info.state.energy}
            cleanliness={hakatch_info.state.cleanliness}
            mood={hakatch_info.state.mood}
          />
        </VStack>
        <WalletConnectContainer />
      </VStack>
    </VStack>
  );
};
