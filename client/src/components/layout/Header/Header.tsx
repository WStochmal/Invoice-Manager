// --- lib ---
import React from "react";

// --- style ---
import style from "./Header.module.css";

// --- hooks ---
import { useLanguageContext } from "@/hooks/useLanguageContext";

const Header = () => {
  const { lang, setLang } = useLanguageContext();
  return (
    <div className={style["header"]}>
      <h1>
        <a>Invoice</a> <a>Manager</a>
      </h1>
      <div className={style["header-language"]}>
        <span
          onClick={() => setLang("en")}
          className={lang === "en" ? style["active"] : ""}
        >
          EN
        </span>{" "}
        |{" "}
        <span
          onClick={() => setLang("pl")}
          className={lang === "pl" ? style["active"] : ""}
        >
          PL
        </span>
      </div>
    </div>
  );
};

export default Header;
