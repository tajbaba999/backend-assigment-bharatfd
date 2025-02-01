import { Request, Response } from "express";
import prisma from "../prismaClient";
import { translateText } from "../services/translationService";
import { faqSchema } from "../validations/faqValidation";
import indianLanguages from "../constants/indianLanguages";
import { error } from "console";

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const lang = (req.params.lang as string) || "en";

    const faq = await prisma.fAQ.findUnique({ where: { id: Number(id) } });
    if (!faq) return res.status(404).json({ error: "FAQ not found" });

    if (lang === "en") return res.json(faq);

    if (!indianLanguages.includes(lang)) {
      return res.status(400).json({ error: "Unsupported language" });
    }

    const translatedQuestion = await translateText(faq.question, lang);
    const translatedAnswer = await translateText(faq.answer, lang);

    res.json({
      id: faq.id,
      question: translatedQuestion,
      answer: translatedAnswer,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  try {
    const validation = faqSchema.safeParse(req.body);
    if (!validation.success)
      return res.status(400).json({ error: validation.error });

    const { question, answer } = req.body;

    const faq = await prisma.fAQ.create({ data: { question, answer } });

    res.status(201).json(faq);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
