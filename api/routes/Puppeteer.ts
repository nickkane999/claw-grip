import express from "express";
import process from "../controllers/puppeteer/ClawGripClass";

const router = express.Router();

router.get("/process", process);

export default router;
