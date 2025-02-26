import { useLogin, usePrivy, useUser } from "@privy-io/react-auth";
import { Button, Text, Flex, Center, VStack, HStack } from "@chakra-ui/react";
import { useCallback } from "react";

export const WalletConnectContainer = () => {
  const { ready, logout, authenticated } = usePrivy();
  const { user } = useUser();
  const { login } = useLogin({
    onComplete: async ({ user, isNewUser, wasAlreadyAuthenticated, loginMethod }) => {
      try {
        const response = await fetch("/api/users/me", {
          method: "GET",
          headers: {
            "wallet-address": user.wallet?.address || "",
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const userData = await response.json();
        console.log('User data:', userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    },
    onError: (error) => {
      console.error('Login error:', error);
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
