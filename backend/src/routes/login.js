import { Router } from "express";
import { loginController } from "../controllers/login.js";

const router = Router();

router.post("/", loginController.loginUser);

export default router;
