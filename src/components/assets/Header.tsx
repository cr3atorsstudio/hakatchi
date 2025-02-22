import { Box, Center, Image } from "@chakra-ui/react";
import React from "react";

export const Header = () => {
  return (
    <Center bgColor="#5C7E5E" w="100%" minH={14}>
      <h1>
        <Image w="100%" maxW="148px" src="logo.png" alt="HAKATCHI" />
      </h1>
    </Center>
  );
};
