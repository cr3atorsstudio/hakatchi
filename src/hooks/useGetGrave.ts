import { useGrave } from "@/app/contexts/GraveContext";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect, useState } from "react";

export function useGetGrave() {
  const { walletAddress } = useAuth();
  const { graveId } = useGrave();
  const [grave, setGrave] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGraveData = async () => {
    if (!walletAddress || !graveId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/graves/${graveId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": walletAddress,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch grave: ${response.status}`);
      }

      const data = await response.json();
      console.log("Fetched grave data:", data);

      setGrave(data.graves[0] || "");
    } catch (error) {
      console.error("Failed to fetch grave data:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress && graveId) {
      fetchGraveData();
    }
  }, [walletAddress, graveId]);

  return { grave, loading, error };
}
