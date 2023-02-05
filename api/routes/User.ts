import express from "express";
import controller from "../controllers/User";
import { Schemas, ValidateSchema } from "../middleware/ValidateSchema";

//router.post("/create", ValidateSchema(Schemas.user.create), controller.createUser);
//router.patch("/update/:userId", ValidateSchema(Schemas.user.update), controller.updateUser);

const router = express.Router();

router.post("/create", controller.createUser);
router.get("/get", controller.readAllUsers);
router.get("/get/:userId", controller.readUser);
router.patch("/update/:userId", controller.updateUser);
router.delete("/delete/:userId", controller.deleteUser);

export default router;
