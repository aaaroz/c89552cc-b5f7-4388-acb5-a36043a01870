"use client";
import * as React from "react";

type CommonContextProviderProps = {
  children: React.ReactNode;
};

type CommonContext = {
  shouldFetchNewData: boolean;
  toggleShouldFetchNewData: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CommonContext = React.createContext<CommonContext | null>(null);
export default function CommonContextProvider({
  children,
}: CommonContextProviderProps) {
  const [shouldFetchNewData, toggleShouldFetchNewData] = React.useState(true);

  return (
    <CommonContext.Provider
      value={{ shouldFetchNewData, toggleShouldFetchNewData }}
    >
      {children}
    </CommonContext.Provider>
  );
}
