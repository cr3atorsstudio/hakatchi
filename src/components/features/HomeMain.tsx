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
import { useAppKitAccount } from "@reown/appkit/react";
import { FirstStep } from "./FirstStep";

const INITIAL_HAKATCH_INFO: HakatchInfo = {
  hakaType: "romanian",
  ghostType: "blue",
  name: null,
  age: 0,
  state: {
    energy: 100,
    cleanliness: 50,
    mood: 50,
  },
};

export const HomeMain = () => {
  const [hakatchInfo, setHakatchInfo] =
    useState<HakatchInfo>(INITIAL_HAKATCH_INFO); //TODO: Fetch from server

  const [first, setFirst] = useState(false); // TODO: Fetch from server

  const [charaAction, setCharaAction] = useState<GhostActionType>("default");
  const { address, isConnected, caipAddress, status, embeddedWalletInfo } =
    useAppKitAccount();

  return (
    <VStack h="100vh" alignItems="center">
      <VStack
        position="relative"
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
          {address && (
            <GhostSummary age={hakatchInfo.age} name={hakatchInfo.name} />
          )}
          <GhostImage
            hakaType={hakatchInfo.hakaType}
            action={charaAction}
            ghostType={hakatchInfo.ghostType}
            setCharaAction={setCharaAction}
          />
          {address && (
            <>
              <GhostAction setCharaAction={setCharaAction} />
              <GhostOverview
                energy={hakatchInfo.state.energy}
                cleanliness={hakatchInfo.state.cleanliness}
                mood={hakatchInfo.state.mood}
              />
            </>
          )}
        </VStack>
        <WalletConnectContainer />
        {isConnected && first && (
          <FirstStep setHakatchInfo={setHakatchInfo} setFirst={setFirst} />
        )}
      </VStack>
    </VStack>
  );
};
