"use client";

import { useGrave } from "@/app/contexts/GraveContext";
import { useAuth } from "@/app/hooks/useAuth";
import { GhostAction as GhostActionType, HakatchInfo } from "@/types/ghost";
import { convertGraveToHakatchInfo } from "@/utils/graveConverter";
import { VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Header } from "../assets/Header";
import { FirstStep } from "./FirstStep";
import { GhostAction } from "./Ghost/GhostAction";
import { GhostImage } from "./Ghost/GhostImage";
import { GhostOverview } from "./Ghost/GhostOverview";
import { GhostSummary } from "./Ghost/GhostSummary";
import { WalletConnectContainer } from "./WalletConnectContainer";

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
    useState<HakatchInfo>(INITIAL_HAKATCH_INFO);

  const [first, setFirst] = useState(false);
  const [loading, setLoading] = useState(true);

  const [charaAction, setCharaAction] = useState<GhostActionType>("default");
  const { isAuthenticated, walletAddress } = useAuth();
  const { setUserId, setGraveId } = useGrave();

  const fetchUserData = async () => {
    if (!isAuthenticated || !walletAddress) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/users/me", {
        headers: {
          "wallet-address": walletAddress,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        // Store user ID in context
        if (userData.id) {
          setUserId(userData.id);
        }

        // Set first to true if user has no graves
        console.log("walletAddress:", walletAddress);
        console.log("userData.graves.length:", userData.graves.length);
        setFirst(userData.graves.length === 0);

        // If user has graves, load the first grave's data
        if (userData.graves.length > 0) {
          const grave = userData.graves[0]; // Get the first grave

          // Store grave ID in context
          if (grave.id) {
            setGraveId(grave.id);
          }

          setHakatchInfo(convertGraveToHakatchInfo(grave));
        }
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [isAuthenticated, walletAddress, first]);

  // Create a custom FirstStep component that will refresh data after completion
  const CustomFirstStep = () => (
    <FirstStep
      setHakatchInfo={setHakatchInfo}
      setFirst={(value) => {
        setFirst(value);
        // If FirstStep is completed (value is false), refresh the data
        if (value === false) {
          fetchUserData();
        }
      }}
    />
  );

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
          {isAuthenticated && (
            <GhostSummary age={hakatchInfo.age} name={hakatchInfo.name} />
          )}
          <GhostImage
            hakaType={hakatchInfo.hakaType}
            action={charaAction}
            ghostType={hakatchInfo.ghostType}
            cleanliness={hakatchInfo.state.cleanliness}
            setCharaAction={setCharaAction}
          />
          {isAuthenticated && (
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
        {isAuthenticated && first && <CustomFirstStep />}
      </VStack>
    </VStack>
  );
};
