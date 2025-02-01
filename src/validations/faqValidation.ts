import { z } from "zod";

export const faqSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

export type FaqInput = z.infer<typeof faqSchema>;
