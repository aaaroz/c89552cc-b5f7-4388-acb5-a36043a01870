import * as React from "react";
import { CommonContext } from "../context/common";

export default function useCommonContext() {
  const context = React.useContext(CommonContext);
  if (!context) {
    throw new Error(
      "useCommonContext must be used within a CommonContextProvider"
    );
  }
  return context;
}
