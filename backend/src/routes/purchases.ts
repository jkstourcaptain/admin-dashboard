import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getPurchases,
  getPurchaseDetail,
  cancelPurchase
} from "../controllers/purchaseController";

const router = express.Router();

// 모든 구매 관련 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// GET /api/admin/purchases - 구매 내역 목록 조회
router.get("/", getPurchases);

// GET /api/admin/purchases/:id - 특정 구매 내역 상세 조회
router.get("/:id", getPurchaseDetail);

// PUT /api/admin/purchases/:id/cancel - 구매 취소
router.put("/:id/cancel", cancelPurchase);

export default router;