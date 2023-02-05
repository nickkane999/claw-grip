import express from "express";
import controller from "../controllers/Script";

const router = express.Router();

router.post("/create", controller.createScript);
router.get("/get", controller.readAllScripts);
router.get("/get/:scriptId", controller.readScript);
router.patch("/update/:scriptId", controller.updateScript);
router.delete("/delete/:scriptId", controller.deleteScript);

export default router;
