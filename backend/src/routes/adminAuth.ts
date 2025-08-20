import express from "express";
import {
  adminLogin,
  getAdminProfile,
} from "../controllers/adminAuthController";
import { authenticateToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/profile", authenticateToken, getAdminProfile);

export default router;
