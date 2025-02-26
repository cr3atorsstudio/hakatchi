import { useGrave } from "@/app/contexts/GraveContext";
import { useAuth } from "@/app/hooks/useAuth";
import { GhostType, HakatchInfo, HakaType } from "@/types/ghost";
import {
  Box,
  Button,
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogRoot,
  DialogTrigger,
  For,
  HStack,
  Image,
  Input,
  Text,
} from "@chakra-ui/react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import Spotlight from "./Intro/SpotLight";

interface FirstStepProps {
  setHakatchInfo: Dispatch<SetStateAction<HakatchInfo>>;
  setFirst: Dispatch<SetStateAction<boolean>>;
}

export const FirstStep = ({ setHakatchInfo, setFirst }: FirstStepProps) => {
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState<HakaType>("romanian");
  const { walletAddress, isAuthenticated } = useAuth();
  const { setGraveId } = useGrave();

  const [isFollowing, setIsFollowing] = useState(true);

  const [cleanCount, setCleanCount] = useState(0);
  const cleanProgress = () => {
    switch (cleanCount) {
      case 0:
        return "100";
      case 1:
        return "70";
      case 2:
        return "30";
      case 3:
        return "0";
    }
  };

  const [name, setName] = useState("");

  const getRandomGhostType = (): GhostType => {
    const ghostTypes: GhostType[] = ["white", "purple", "blue", "green"];
    return ghostTypes[Math.floor(Math.random() * ghostTypes.length)];
  };
  const ghost = useMemo(() => getRandomGhostType(), []);

  const onComfirmClick = useCallback(() => {
    setHakatchInfo((v) => ({
      ...v,
      name: name,
      hakaType: target,
      ghostType: ghost,
    }));
    fetch("/api/graves", {
      method: "POST",
      headers: {
        wallet_address: walletAddress || "",
      },
    });
    //TODO: ↑ この情報を保存する
    // setFirst(false);
  }, [setHakatchInfo]);

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg="#2E3130"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backgroundImage={step === 3 ? "url(/intro/tada.gif)" : undefined}
      backgroundRepeat={"no-repeat"}
      backgroundSize={"cover"}
      backgroundPosition={"center"}
    >
      {step === 0 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          color="#fff"
        >
          <Box fontSize="1rem" textAlign="center">
            <Box as="button" onClick={() => setStep(1)} cursor={"pointer"}>
              <Image
                src="/intro/glass1.gif"
                alt="SearchGlass"
                width={200}
                height={200}
              />
            </Box>
            <Button
              marginTop={-8}
              type="button"
              color="#fff"
              w="50%"
              h="3.8rem"
              pb="0.75rem"
              pl="0.3rem"
              letterSpacing="0.3rem"
              backgroundColor="transparent"
              backgroundImage={"url(/button/button1.png)"}
              backgroundSize="contain"
              backgroundRepeat="no-repeat"
              backgroundPosition={"center"}
              onClick={() => setStep(1)}
            >
              Search
            </Button>
          </Box>
        </Box>
      )}
      {step === 1 && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          color="#fff"
        >
          <HStack width={"80%"} justifyContent="space-between">
            <For each={["romanian", "egyptian", "japanese"] as HakaType[]}>
              {(haka) => (
                <DialogRoot
                  key={haka}
                  size={"xs"}
                  motionPreset="slide-in-bottom"
                  closeOnEscape={false}
                  closeOnInteractOutside={false}
                >
                  <DialogTrigger asChild>
                    <Button
                      position={"relative"}
                      width={"30%"}
                      height={"auto"}
                      bg={"transparent"}
                      style={{
                        cursor: "none",
                      }}
                      onClick={() => {
                        setIsFollowing(false);
                      }}
                    >
                      <Image src={"/intro/" + haka + ".png"} alt="" />
                      <Image
                        src={"/intro/" + haka + "-dust.png"}
                        alt=""
                        position={"absolute"}
                        top={"0"}
                        left={"0"}
                      />
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    position="fixed"
                    bottom="10vh"
                    left="50%"
                    transform="translateX(-50%)"
                  >
                    <DialogBody px={4} paddingTop={4}>
                      <p style={{ textAlign: "center", color: "#000" }}>
                        Do you want to clean this grave?
                      </p>
                    </DialogBody>
                    <DialogFooter
                      p={4}
                      display={"flex"}
                      justifyContent={"center"}
                    >
                      <DialogActionTrigger asChild>
                        <Button
                          variant="outline"
                          width={"30%"}
                          onClick={() => {
                            setIsFollowing(true);
                          }}
                        >
                          No
                        </Button>
                      </DialogActionTrigger>
                      <Button
                        width={"30%"}
                        onClick={() => {
                          setStep(2);
                          setTarget(haka);
                        }}
                      >
                        Yes
                      </Button>
                    </DialogFooter>
                    <DialogCloseTrigger />
                  </DialogContent>
                </DialogRoot>
              )}
            </For>
          </HStack>
          <Spotlight isFollowing={isFollowing} />
        </Box>
      )}
      {step === 2 && (
        <Box maxW={"480px"} textAlign="center">
          <Text color="#fff" paddingBottom={4}>
            ▼ Click to clean ▼
          </Text>
          <Button
            height={"auto"}
            bg={"transparent"}
            onClick={() => {
              if (cleanCount === 3) {
                setStep(3);
              } else {
                setCleanCount((v) => v + 1);
              }
            }}
          >
            <Image
              src={"/intro/" + target + "-" + cleanProgress() + ".png"}
              alt=""
            />
          </Button>
        </Box>
      )}
      {step === 3 && (
        <Box position="relative">
          <Image
            src="/intro/tada-bg.png"
            alt=""
            width={"60vw"}
            minW="530px"
            maxW="760px"
            height={"60vw"}
            minH="530px"
            maxH="760px"
          />
          <Image
            position="absolute"
            top="50%"
            left="50%"
            transform={"translate(-50%, -50%)"}
            src={"/intro/" + target + "-tada.png"}
            alt=""
            width={"30vw"}
            minW={"320px"}
            height={"30vw"}
            minH={"320px"}
          />
          <Button
            position={"absolute"}
            left={"50%"}
            bottom={"10%"}
            transform={"translateX(-50%)"}
            type="button"
            color="#fff"
            w="24%"
            h="3.8rem"
            pb="0.75rem"
            pl="0.3rem"
            letterSpacing="0.3rem"
            backgroundColor="transparent"
            backgroundImage={"url(/button/button1.png)"}
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            backgroundPosition={"center"}
            onClick={() => {
              setStep(4);
            }}
          >
            Yay!
          </Button>
        </Box>
      )}
      {step === 4 && (
        <Box
          position="relative"
          maxW={"480px"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          flexDirection={"column"}
          textAlign="center"
          px={4}
        >
          <Text as={"h2"} color={"#fff"} fontSize={"1.2rem"}>
            Hmm? Something's there!
          </Text>
          <Image width={"40%"} src={"/intro/" + ghost + ".png"} alt="" />
          <Text textAlign="center" color="white" py={4}>
            A ghost has appeared!
            <br />
            It's looking at you with curiosity. Give it a name and become
            friends!
          </Text>
          <Input
            backgroundColor={"#fff"}
            paddingLeft={"1rem"}
            onChange={(v) => {
              setName(v.target.value);
            }}
            placeholder="Enter your ghost name"
            marginBottom={4}
          />
          <Button
            type="button"
            color="#fff"
            w="40%"
            h="3.8rem"
            pb="0.75rem"
            pl="0.3rem"
            letterSpacing="0.3rem"
            backgroundColor="transparent"
            backgroundImage={"url(/button/button1.png)"}
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
            backgroundPosition={"center"}
            // onClick={onComfirmClick}
            onClick={async () => {
              try {
                if (!walletAddress) {
                  console.error("Wallet address not found");
                  return;
                }

                // Create grave via API
                const response = await fetch("/api/graves", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "wallet-address": walletAddress,
                  },
                  body: JSON.stringify({
                    name: name,
                    ghostType: ghost,
                    hakaType: target,
                  }),
                });

                if (!response.ok) {
                  throw new Error("Failed to create grave");
                }

                // Get the created grave data
                const graveData = await response.json();

                // Set the grave ID in the context
                if (graveData.id) {
                  setGraveId(graveData.id);
                }

                // Close first step
                setFirst(false);
              } catch (error) {
                console.error("Error creating grave:", error);
              }
            }}
          >
            OK
          </Button>
        </Box>
      )}
    </Box>
  );
};
