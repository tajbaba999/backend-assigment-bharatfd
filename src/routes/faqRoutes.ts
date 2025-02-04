import { Router, RequestHandler } from "express";
import { getFAQ, createFAQ, getAllFAQs } from "../controllers/faqController";

const router = Router();

router.get("/faqs", getAllFAQs as RequestHandler);
router.get("/faqs/:id", getFAQ as RequestHandler);
router.post("/faqs", createFAQ as RequestHandler);

export default router;
