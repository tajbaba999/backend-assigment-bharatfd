import translate from "@vitalets/google-translate-api";

export async function translateText(
  text: String,
  tragetLang: String
): Promise<String> {
  // const cacheKey = `translation:${tragetLang}:${text}`
  // const cachedTranslation = await

  try {
    const res = await translate(text, { to: tragetLang });
    const translated = res.text;
    return translated;
  } catch (error) {
    console.error("Translation error :", error);
    throw new Error("Tranlation failed");
  }
}
