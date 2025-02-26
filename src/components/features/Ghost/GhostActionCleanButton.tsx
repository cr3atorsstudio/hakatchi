import { Button, DialogActionTrigger } from "@chakra-ui/react";

import { useGrave } from "@/app/contexts/GraveContext";
import {
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GhostAction } from "@/types/ghost";
import { Dispatch, SetStateAction } from "react";

interface GhostActionCleanButtonProps {
  setCharaAction: Dispatch<SetStateAction<GhostAction>>;
}

export const GhostActionCleanButton = ({
  setCharaAction,
}: GhostActionCleanButtonProps) => {
  const { graveId } = useGrave();

  const handleClean = async () => {
    if (!graveId) {
      console.error("Grave ID not found");
      return;
    }

    try {
      console.log("Cleaning grave");
      setCharaAction("clean");

      // APIを呼び出して墓を掃除する
      const response = await fetch("/api/clean", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grave_id: graveId,
          effort_level: 5, // デフォルトの努力レベル
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to clean");
      }

      const data = await response.json();
      console.log("Clean response:", data);
    } catch (error) {
      console.error("Error cleaning:", error);
    }
  };

  return (
    <>
      <DialogRoot size={"xs"}>
        <DialogTrigger asChild>
          <Button
            color="#193459"
            w="30%"
            h="2.875rem"
            maxW="7.5rem"
            pb="0.75rem"
            pl="0.3rem"
            letterSpacing="0.3rem"
            backgroundColor="transparent"
            backgroundImage={"url(/button/button2.png)"}
            backgroundSize="contain"
            backgroundRepeat="no-repeat"
          >
            CLEAN
          </Button>
        </DialogTrigger>
        <DialogContent color={"#000"}>
          <DialogHeader p="4">
            <DialogTitle
              color="#325634"
              fontWeight={"normal"}
              textAlign={"center"}
            >
              Cleaning the Room
            </DialogTitle>
          </DialogHeader>
          <DialogBody textAlign={"center"} pb={4}>
            Do you want to clean the room?
          </DialogBody>
          <DialogFooter
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            px={4}
            pb={4}
          >
            <DialogActionTrigger asChild>
              <Button
                type="button"
                color="#fff"
                w="30%"
                h="3.8rem"
                pb="0.75rem"
                pl="0.3rem"
                letterSpacing="0.3rem"
                backgroundColor="transparent"
                backgroundImage={"url(/button/button1.png)"}
                backgroundSize="contain"
                backgroundRepeat="no-repeat"
                backgroundPosition={"center"}
                onClick={handleClean}
              >
                OK
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
