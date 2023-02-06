import express from "express";
import controller from "../controllers/puppeteer/ClawGrip";
const router = express.Router();

router.get("/process", controller.process);

export default router;
