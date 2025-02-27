import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import { User } from "@/types";

export const useIsSignUpUser = async () => {
  const { walletAddress } = useAuth();
  const { data: user } = await supabase
    .from<User>("users")
    .select("*")
    .eq("wallet_address", walletAddress)
    .single();

  console.log({ user });

  return !!user;
};
