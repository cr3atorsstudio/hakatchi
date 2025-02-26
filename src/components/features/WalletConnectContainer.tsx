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
    <Flex align="center" gap={4} bg="white">
      {authenticated ? (
        <HStack h={6}>
          <Text fontSize="sm">
            {user?.email?.address ||
              user?.wallet?.address.slice(0, 6) +
                "..." +
                user?.wallet?.address.slice(-5, -1)}
          </Text>
          <Button colorScheme="brand" size="sm" onClick={logout}>
            Logout
          </Button>
        </HStack>
      ) : (
        <Button colorScheme="brand" size="lg" onClick={login}>
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
