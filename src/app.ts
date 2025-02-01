import express from "express";
import cors from "cors";
import faqRoutes from "./routes/faqRoutes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/hello", (_req, res) => {
    res.json({ message: "Hello World" });
});

app.use("/api", faqRoutes);

export default app;
