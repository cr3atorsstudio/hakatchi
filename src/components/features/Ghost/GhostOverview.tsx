import { Center, HStack, Text, Grid } from "@chakra-ui/react";

export const GhostOverview = () => {
  return (
    <Center bgColor="#FFFCEC" p={4} borderRadius="xl" mt={5}>
      <Grid
        gridTemplateColumns={"repeat(auto-fit, 9.25rem)"}
        gridTemplateRows="repeat(1)"
      >
        {[
          "Energy",
          "Cleanliness",
          "Mood",
          "Affection",
          "Satiety",
          "Stress",
        ].map((item, index) => {
          return (
            <HStack>
              <Text>{item}</Text>
              <Text>.....</Text>
              <Text>{(index + 1) * 100}</Text>
            </HStack>
          );
        })}
      </Grid>
    </Center>
  );
};
