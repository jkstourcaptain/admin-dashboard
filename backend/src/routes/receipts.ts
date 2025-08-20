import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getReceipts,
  getReceiptDetail,
  approveReceipt,
  rejectReceipt
} from "../controllers/receiptController";

const router = express.Router();

// 모든 영수증 관련 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// GET /api/admin/receipts - 영수증 목록 조회
router.get("/", getReceipts);

// GET /api/admin/receipts/:id - 특정 영수증 상세 조회
router.get("/:id", getReceiptDetail);

// PUT /api/admin/receipts/:id/approve - 영수증 승인 및 포인트 지급
router.put("/:id/approve", approveReceipt);

// PUT /api/admin/receipts/:id/reject - 영수증 반려
router.put("/:id/reject", rejectReceipt);

export default router;