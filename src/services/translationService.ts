import { translate } from "@vitalets/google-translate-api";
import { prisma } from "./prismaService";

export const translateText = async (
  text: string,
  lang: string,
  faqId?: number
): Promise<string> => {
  try {
    if (!text || !lang) {
      throw new Error("Text and language are required");
    }

    // Perform translation
    const translated = await translate(text, { to: lang });
    if (!translated || !translated.text) {
      throw new Error("Translation failed");
    }

    return translated.text;
  } catch (error: any) {
    console.error("Translation error:", error);
    throw new Error(`Translation failed: ${error.message}`);
  }
};

// Helper function to translate both question and answer
export const translateFAQ = async (
  faqId: number,
  question: string,
  answer: string,
  lang: string
): Promise<{ question: string; answer: string }> => {
  const translatedQuestion = await translateText(question, lang);
  const translatedAnswer = await translateText(answer, lang);

  await prisma.fAQTranslation.create({
    data: {
      faqId,
      language: lang,
      question: translatedQuestion,
      answer: translatedAnswer,
    },
  });

  return {
    question: translatedQuestion,
    answer: translatedAnswer,
  };
};
