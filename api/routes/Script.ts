import express from "express";
import controller from "../controllers/Script";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

//router.post("/create", ValidateSchema(Schemas.script.create), controller.createScript);
//router.patch("/update/:scriptId", ValidateSchema(Schemas.script.update), controller.updateScript);

const router = express.Router();

router.post("/create", controller.createScript);
router.get("/get", controller.readAllScripts);
router.get("/get/script/:scriptId", controller.readScript);
router.get("/get/user/:userId", controller.readScriptsByUser);
router.patch("/update/:scriptId", controller.updateScript);
router.delete("/delete/:scriptId", controller.deleteScript);

export default router;
