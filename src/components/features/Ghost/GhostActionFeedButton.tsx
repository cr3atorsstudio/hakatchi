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

export const GhostActionFeedButton = () => {
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
            FEED
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select an offering</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RadioGroup>
              <Radio value="apple">apple</Radio>
              <Radio value="locked1" disabled>
                locked key
              </Radio>
              <Radio value="locked2" disabled>
                locked key
              </Radio>
            </RadioGroup>
          </DialogBody>
          <DialogFooter>
            <Button>OK</Button>
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
