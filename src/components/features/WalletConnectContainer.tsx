import { usePrivy, useUser } from "@privy-io/react-auth";
import { Button, Text, Flex } from "@chakra-ui/react";

export const WalletConnectContainer = () => {
  const { login, logout, authenticated } = usePrivy();
  const { user } = useUser();

  return (
    <Flex align="center" gap={4}>
      {authenticated ? (
        <>
          <Text fontSize="sm" maxW="120px">
            {user?.wallet?.address || user?.email?.address}
          </Text>
          <Button
            colorScheme="brand"
            variant="outline"
            size="sm"
            onClick={logout}
          >
            Logout
          </Button>
        </>
      ) : (
        <Button colorScheme="brand" size="lg" onClick={login}>
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
};
