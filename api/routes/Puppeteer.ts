import express from "express";
import controller from "../controllers/puppeteer/Basic";
const router = express.Router();

router.get("/basic", controller.basicLoad);

export default router;
