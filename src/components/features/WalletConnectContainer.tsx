import { useLogin, usePrivy, useUser } from "@privy-io/react-auth";
import { Button, Text, Flex, Center, VStack, HStack } from "@chakra-ui/react";
import { useCallback } from "react";

export const WalletConnectContainer = () => {
  const { ready, logout, authenticated } = usePrivy();
  const { user } = useUser();
  const { login } = useLogin({
    onComplete: ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod }) => {
      console.log(user, isNewUser, wasAlreadyAuthenticated, loginMethod);
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounted
    },
    onError: (error) => {
      console.log(error);
      // Any logic you'd like to execute after a user exits the login flow or there is an error
    },
  });

  return (
    <Flex alignItems={"center"} justifyContent={"center"} width={"100%"}>
      {authenticated ? (
        <HStack
          h={6}
          justifyContent={"space-between"}
          bg="white"
          w={"100%"}
          px={10}
        >
          <Text fontSize="sm">
            {user?.email?.address ||
              user?.wallet?.address.slice(0, 6) +
                "..." +
                user?.wallet?.address.slice(-5, -1)}
          </Text>
          <Text
            color={"#5C7E5E"}
            colorScheme="brand"
            textDecoration={"underline"}
            cursor={"pointer"}
            onClick={logout}
          >
            Logout
          </Text>
        </HStack>
      ) : (
        <Button px={4} colorScheme="brand" size="lg" onClick={login}>
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
