import { Center, Image } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";

export const Header = () => {
  const router = useRouter();

  return (
    <Center
      bgColor="#5C7E5E"
      w="100%"
      minH={14}
      cursor="pointer"
      onClick={() => router.push("/")}
    >
      <h1>
        <Image w="100%" maxW="148px" src="logo.png" alt="HAKATCHI" />
      </h1>
    </Center>
  );
};
