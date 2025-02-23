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
      <DialogRoot>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Oops!</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <Text>
              This area is under construction.
              <br />
              You'll be able to play with your ghost soon!
            </Text>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button>OK</Button>
            </DialogActionTrigger>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
