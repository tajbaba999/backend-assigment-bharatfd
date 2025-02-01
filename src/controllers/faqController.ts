import { Request, Response } from "express";
import { prisma } from "../services/prismaService";
import { translateText, translateFAQ } from "../services/translationService";
import { faqSchema } from "../validations/faqValidation";
import indianLanguages from "../constants/indianLanguages";

// Get FAQ by ID with translation
export const getFAQ = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = (req.params.lang as string) || "en";

    // Fetch FAQ with translations
    const faq = await prisma.fAQ.findUnique({
      where: { id: Number(id) },
      include: {
        translations: {
          where: { language: lang }
        }
      }
    });

    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    // If language is English, return FAQ in English
    if (lang === "en") return res.json(faq);

    // If translation exists, return it
    if (faq.translations && faq.translations.length > 0) {
      return res.json({
        id: faq.id,
        question: faq.translations[0].question,
        answer: faq.translations[0].answer,
      });
    }

    // If no translation exists, create one
    const translatedQuestion = await translateText(faq.question, lang);
    const translatedAnswer = await translateText(faq.answer, lang);

    const translation = await prisma.fAQTranslation.create({
      data: {
        faqId: faq.id,
        language: lang,
        question: translatedQuestion,
        answer: translatedAnswer,
      },
    });

    res.json({
      id: faq.id,
      question: translation.question,
      answer: translation.answer,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Get all FAQs with translation for a specific language
export const getAllFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      include: {
        translations: true
      }
    });

    if (!faqs || faqs.length === 0) {
      return res.status(404).json({ error: "No FAQs found" });
    }

    res.json(faqs);
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({ error: "Failed to fetch FAQs" });
  }
};

// Create FAQ with all translations immediately
export const createFAQ = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body;

    // First create the FAQ in English
    const faq = await prisma.fAQ.create({
      data: {
        question,
        answer,
      },
    });

    // Create translations for all Indian languages
    const translations = await Promise.all(
      indianLanguages.map(async (lang) => {
        return translateFAQ(faq.id, question, answer, lang);
      })
    );

    // Fetch the complete FAQ with all translations
    const faqWithTranslations = await prisma.fAQ.findUnique({
      where: { id: faq.id },
      include: {
        translations: true,
      },
    });

    res.status(201).json(faqWithTranslations);
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({ error: "Failed to create FAQ" });
  }
};
