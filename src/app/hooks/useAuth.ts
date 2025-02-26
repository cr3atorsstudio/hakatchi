import { usePrivy, useUser } from "@privy-io/react-auth";

export const useAuth = () => {
  const { user } = useUser();
  const { authenticated } = usePrivy();

  return {
    user,
    isAuthenticated: authenticated,
    walletAddress: user?.wallet?.address,
    email: user?.email?.address,
    socialAccounts: user?.linkedAccounts || [],
  };
};
