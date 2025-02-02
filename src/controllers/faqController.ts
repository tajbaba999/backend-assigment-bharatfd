import { Request, Response } from "express";
import { prisma } from "../services/prismaService";
import { faqSchema } from "../validations/faqValidation";
import indianLanguages from "../constants/indianLanguages";
import { cacheService } from "../services/cacheService";
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  key: process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY,
});

// console.log(process.env.GOOGLE_CLOUD_TRANSLATE_API_KEY);

async function translateText(text: string, targetLang: string) {
  const [translation] = await translate.translate(text, targetLang);
  return translation;
}

export const getFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = (req.query.lang as string) || "en";

    if (!id || isNaN(Number(id))) {
      return res.status(400).json({ error: "Invalid FAQ ID" });
    }

    const faqId = Number(id);
    const cacheKey = `faq-${faqId}-${lang}`;

    const cachedFAQ = await cacheService.getCache(cacheKey);
    if (cachedFAQ) {
      return res.json(JSON.parse(cachedFAQ));
    }

    const faq = await prisma.fAQ.findUnique({
      where: { id: faqId },
      include: {
        translations: true,
      },
    });

    if (!faq) {
      return res.status(404).json({ error: "FAQ not found" });
    }

    let result;

    if (lang === "en") {
      result = faq;
    } else {
      const translation = faq.translations.find((t) => t.language === lang);
      if (translation) {
        result = {
          id: faq.id,
          question: translation.question,
          answer: translation.answer,
        };
      } else {
        const translatedQuestion = await translateText(faq.question, lang);
        const translatedAnswer = await translateText(faq.answer, lang);

        await prisma.fAQTranslation.create({
          data: {
            faqId: faq.id,
            language: lang,
            question: translatedQuestion,
            answer: translatedAnswer,
          },
        });

        result = {
          id: faq.id,
          question: translatedQuestion,
          answer: translatedAnswer,
        };
      }
    }

    await cacheService.setCache(cacheKey, JSON.stringify(result));
    res.json(result);
  } catch (error) {
    console.error("Error fetching FAQ:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const lang = (req.query.lang as string) || "en";

    const cacheKey = `all-faqs-${lang}`;
    const cachedFAQs = await cacheService.getCache(cacheKey);
    if (cachedFAQs) {
      return res.json(JSON.parse(cachedFAQs));
    }

    const faqs = await prisma.fAQ.findMany({
      include: {
        translations: true,
      },
    });

    if (!faqs || faqs.length === 0) {
      return res.status(404).json({ error: "No FAQs found" });
    }

    const translatedFAQs = await Promise.all(
      faqs.map(async (faq) => {
        if (lang === "en") {
          return faq;
        }

        const translation = faq.translations.find((t) => t.language === lang);
        if (translation) {
          return {
            id: faq.id,
            question: translation.question,
            answer: translation.answer,
          };
        }

        const translatedQuestion = await translateText(faq.question, lang);
        const translatedAnswer = await translateText(faq.answer, lang);

        await prisma.fAQTranslation.create({
          data: {
            faqId: faq.id,
            language: lang,
            question: translatedQuestion,
            answer: translatedAnswer,
          },
        });

        return {
          id: faq.id,
          question: translatedQuestion,
          answer: translatedAnswer,
        };
      })
    );

    await cacheService.setCache(cacheKey, JSON.stringify(translatedFAQs));

    res.json(translatedFAQs);
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
      },
    });

    const translations = await Promise.all(
      indianLanguages.map(async (lang) => {
        const translatedQuestion = await translateText(question, lang);
        const translatedAnswer = await translateText(answer, lang);
        return prisma.fAQTranslation.create({
          data: {
            faqId: faq.id,
            language: lang,
            question: translatedQuestion,
            answer: translatedAnswer,
          },
        });
      })
    );

    const faqWithTranslations = await prisma.fAQ.findUnique({
      where: { id: faq.id },
      include: {
        translations: true,
      },
    });

    res.status(201).json(faqWithTranslations);
  } catch (error) {
    console.error("Error creating FAQ:", error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};
