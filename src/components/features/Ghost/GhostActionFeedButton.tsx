import { Button, DialogActionTrigger, Image } from "@chakra-ui/react";

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
import { Radio, RadioGroup } from "@/components/ui/radio";
import { GhostAction } from "@/types/ghost";
import { Dispatch, SetStateAction, useState } from "react";

interface GhostActionFeedButtonProps {
  setCharaAction: Dispatch<SetStateAction<GhostAction>>;
}

// 食べ物の定義
interface Food {
  name: string;
  food_quality: number;
}

// 食べ物のマッピング
const FOODS: Record<string, Food> = {
  apple: { name: "Apple", food_quality: 5 },
  // 他の食べ物を追加できます
};

export const GhostActionFeedButton = ({
  setCharaAction,
}: GhostActionFeedButtonProps) => {
  const [selectedValue, setSelectedValue] = useState<undefined | string>(
    undefined
  );
  const { graveId, userId } = useGrave();

  const handleFeed = async () => {
    if (!selectedValue || !graveId) return;

    const food = FOODS[selectedValue];
    if (!food) return;

    try {
      console.log("Feeding with", food);
      setCharaAction("eatingApple");

      const response = await fetch("/api/feed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          grave_id: graveId,
          name: food.name,
          food_quality: food.food_quality,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to feed");
      }

      const data = await response.json();
      console.log("Feed response:", data);

      // 選択をリセット
      setSelectedValue(undefined);
    } catch (error) {
      console.error("Error feeding:", error);
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
            FEED
          </Button>
        </DialogTrigger>
        <DialogContent color={"#000"}>
          <DialogHeader p="4">
            <DialogTitle
              color="#325634"
              fontWeight={"normal"}
              textAlign={"center"}
            >
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
                  onClick={handleFeed}
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
