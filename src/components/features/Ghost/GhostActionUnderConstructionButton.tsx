import { Button, Text } from "@chakra-ui/react";

import {
  DialogActionTrigger,
  DialogBody,
  DialogCloseTrigger,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type GhostActionUnderConstructionButtonProps = {
  label: string;
};

export const GhostActionUnderConstructionButton = ({
  label,
}: GhostActionUnderConstructionButtonProps) => {
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
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent p={4} color={"#000"}>
          <DialogHeader>
            <DialogTitle
              color="#325634"
              fontWeight={"normal"}
              textAlign={"center"}
            >
              Oops!
            </DialogTitle>
          </DialogHeader>
          <DialogBody p={2}>
            <Text>
              This area is under construction.
              <br />
              You'll be able to play with your ghost soon!
            </Text>
          </DialogBody>
          <DialogFooter display={"flex"} justifyContent={"center"}>
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
              >
                OK
              </Button>
            </DialogActionTrigger>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};
