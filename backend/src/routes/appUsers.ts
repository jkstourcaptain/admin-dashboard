import { Router } from "express";
import * as appUserController from "../controllers/appUserController";

const router = Router();

// 사용자 관리
router.post("/register", appUserController.registerUser);
router.get("/profile/:userId", appUserController.getUserProfile);
router.put("/profile/:userId", appUserController.updateUserProfile);

export default router;