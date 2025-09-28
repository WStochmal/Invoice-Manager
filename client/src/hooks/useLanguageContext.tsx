// --- lib ---
import { useContext } from "react";

// --- context ---
import { LanguageContext } from "@/context/LanguageContext";

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguageContext must be used within a LanguageProvider"
    );
  }
  return context;
};
