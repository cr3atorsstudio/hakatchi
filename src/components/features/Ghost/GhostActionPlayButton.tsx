import { Button } from "@chakra-ui/react";

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
import { Radio, RadioGroup } from "@/components/ui/radio";
import GhostGame from "./GhostGame";

export const GhostActionPlayButton = () => {
  return (
    <>
      <DialogRoot size={"lg"}>
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
            PLAY
          </Button>
        </DialogTrigger>
        <DialogContent py={4}>
          <DialogBody color={"#000"}>
            <GhostGame />
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
