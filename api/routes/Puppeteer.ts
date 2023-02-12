import express from "express";
import { process, processClient } from "../controllers/puppeteer/Process";

const router = express.Router();

router.post("/process-server", process);
router.post("/process", processClient);

export default router;
