// --- hooks
import { TRANSLATION } from "@/localization/language";
import { useLanguageContext } from "./useLanguageContext";

export const useTranslation = () => {
  const { lang } = useLanguageContext();
  const getText = (key: string): string => {
    return TRANSLATION[lang][key] || key;
  };

  return { getText };
};
