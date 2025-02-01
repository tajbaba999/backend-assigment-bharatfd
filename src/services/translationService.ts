import { translate } from "@vitalets/google-translate-api";
import { cacheService } from "./cacheService";

export const translateText = async (text: string, lang: string) => {
  const cacheKey = `translation:${lang}:${text}`;

  // Check cache first
  const cachedTranslation = await cacheService.getCache(cacheKey);
  if (cachedTranslation) return cachedTranslation;

  // Perform translation
  const translated = await translate(text, { to: lang });
  await cacheService.setCache(cacheKey, translated.text);

  return translated.text;
};
