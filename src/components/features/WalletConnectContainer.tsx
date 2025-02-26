import { Button, Flex, HStack, Text } from "@chakra-ui/react";
import { useLogin, usePrivy, useUser } from "@privy-io/react-auth";

export const WalletConnectContainer = () => {
  const { ready, logout, authenticated } = usePrivy();
  const { user } = useUser();
  const { login } = useLogin();

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
