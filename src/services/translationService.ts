import translate from "@vitalets/google-translate-api";
import { cacheGet, cacheSet } from "./cacheService";

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  const cacheKey = `translation:${targetLang}:${text}`;
  const cachedTranslation = await cacheGet(cacheKey);
  if (cachedTranslation) {
    return cachedTranslation;
  }

  try {
    const res = await translate(text, { to: targetLang });
    const translated = res.text;
    await cacheSet(cacheKey, translated, 3600);
    return translated;
  } catch (err) {
    console.error("Translation error:", err);
    throw new Error("Translation failed");
  }
}
