import { useGetGrave } from "@/hooks/useGetGrave";
import { Center, HStack, Text, Box } from "@chakra-ui/react";

export const GhostOverview = () => {
  const { grave, error } = useGetGrave();
  const energy: number = grave ? 100 - grave.hunger : 0;
  const cleanliness = grave ? 100 - grave.dirtiness : 0;
  const mood = grave ? 100 - grave.mood : 0;

  const params = [
    {
      name: "Energy",
      value: energy,
      icon: {
        blank: "♡",
        full: "♥",
      },
    },
    {
      name: "Cleanliness",
      value: cleanliness,
      icon: {
        blank: "☆",
        full: "★",
      },
    },
    {
      name: "Mood",
      value: mood,
      icon: {
        blank: "◇",
        full: "◆",
      },
    },
  ];

  const getIcons = ({
    value,
    icon: { blank, full },
  }: {
    value: number;
    icon: {
      blank: string;
      full: string;
    };
  }) => {
    const max = 100;
    const heartCount = Math.round((value / max) * 5);
    return full.repeat(heartCount) + blank.repeat(5 - heartCount);
  };

  return (
    <Center w="100%" p={8}>
      <Box
        w="100%"
        bgColor="#FFFCEC"
        borderRadius="xl"
        p={4}
        gridTemplateColumns={"repeat(auto-fit, 9.25rem)"}
        gridTemplateRows="repeat(1)"
      >
        {params.map((item, index) => {
          return (
            <HStack key={index}>
              <Text>{item.name}</Text>
              <Box flex={1} borderTop="1px dotted #352B2B"></Box>
              <Text>
                {getIcons({
                  value: item.value,
                  icon: item.icon,
                })}
              </Text>
            </HStack>
          );
        })}
      </Box>
    </Center>
  );
};
