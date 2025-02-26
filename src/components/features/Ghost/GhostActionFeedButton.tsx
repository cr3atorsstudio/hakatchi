import { Button, DialogActionTrigger, Image } from "@chakra-ui/react";

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
import { Dispatch, SetStateAction, useState } from "react";
import { GhostAction } from "@/types/ghost";

interface GhostActionFeedButtonProps {
  setCharaAction: Dispatch<SetStateAction<GhostAction>>;
}

export const GhostActionFeedButton = ({
  setCharaAction,
}: GhostActionFeedButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<undefined | string>(
    undefined
  );
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
            FEED
          </Button>
        </DialogTrigger>
        <DialogContent color={"#000"}>
          <DialogHeader p="4">
            <DialogTitle fontWeight={"normal"} textAlign={"center"}>
              Select an offering
            </DialogTitle>
          </DialogHeader>
          <DialogBody>
            <RadioGroup
              value={selectedValue}
              onChange={(value) => {
                setSelectedValue((value.target as HTMLInputElement).value);
              }}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
              gap={2}
              pb={1}
            >
              <Radio value="apple">
                <Image src="/apple.png" width={"28px"} height={"28px"} />
              </Radio>
              <Radio value="locked1" disabled>
                <Image src="/lock.png" width={"32px"} height={"32px"} />
              </Radio>
              <Radio value="locked2" disabled>
                <Image src="/lock.png" width={"32px"} height={"32px"} />
              </Radio>
            </RadioGroup>
          </DialogBody>
          <DialogFooter
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            px={4}
            pb={4}
          >
            {selectedValue !== undefined && (
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
                  onClick={() => {
                    console.log("feed", selectedValue);
                    setSelectedValue(undefined);
                    if (selectedValue === "apple") {
                      setCharaAction("eatingApple");
                      // TODO: ここでapiを叩く
                    }
                  }}
                >
                  OK
                </Button>
              </DialogActionTrigger>
            )}
          </DialogFooter>
          <DialogCloseTrigger />
        </DialogContent>
      </DialogRoot>
    </>
  );
};
