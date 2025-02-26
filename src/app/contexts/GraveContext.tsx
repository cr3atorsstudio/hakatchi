"use client";

import React, { createContext, ReactNode, useContext, useState } from "react";

interface GraveContextType {
  userId: string | null;
  setUserId: (id: string) => void;
  graveId: string | null;
  setGraveId: (id: string) => void;
}

const GraveContext = createContext<GraveContextType | undefined>(undefined);

export const GraveProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [graveId, setGraveId] = useState<string | null>(null);

  return (
    <GraveContext.Provider value={{ userId, setUserId, graveId, setGraveId }}>
      {children}
    </GraveContext.Provider>
  );
};

export const useGrave = (): GraveContextType => {
  const context = useContext(GraveContext);
  if (context === undefined) {
    throw new Error("useGrave must be used within a GraveProvider");
  }
  return context;
};
