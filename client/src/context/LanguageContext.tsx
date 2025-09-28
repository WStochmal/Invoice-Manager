// --- lib ---
import React, { createContext, useState, ReactNode } from "react";

// --- types ---
type Language = "pl" | "en";

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
};
// --- context ---
export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  setLang: () => {},
});

// ### Provider ###
export const LanguageContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const savedLang = (localStorage.getItem("lang") as Language) || "pl";
  const [lang, setLangState] = useState<Language>(savedLang);

  const setLang = (newLang: Language) => {
    localStorage.setItem("lang", newLang);
    setLangState(newLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
};
