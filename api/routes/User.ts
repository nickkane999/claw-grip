import express from "express";
import controller from "../controllers/User";

const router = express.Router();

router.post("/create", controller.createUser);
router.get("/get", controller.readAllUsers);
router.get("/get/:userId", controller.readUser);
router.patch("/update/:userId", controller.updateUser);
router.delete("/delete/:userId", controller.deleteUser);

export default router;
