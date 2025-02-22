import { Container } from "@chakra-ui/react";
import React, { ReactNode } from "react";

type HomeContainerProps = {
  children: ReactNode;
};

export const HomeContainer = ({ children }: HomeContainerProps) => {
  return (
    <Container
      backgroundImage="url(background-image.png)"
      bgRepeat="no-repeat"
      bgPos="top"
      bgSize="cover"
      minH="100vh"
      minW="100vw"
    >
      {children}
    </Container>
  );
};
