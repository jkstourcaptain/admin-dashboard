import { Router } from "express";
import * as appSupportController from "../controllers/appSupportController";

const router = Router();

// 문의사항
router.post("/inquiries", appSupportController.createInquiry);
router.get("/inquiries/:userId", appSupportController.getUserInquiries);

// 영수증 관리
router.post("/receipts", appSupportController.uploadReceipt);
router.get("/receipts/:userId", appSupportController.getUserReceipts);

export default router;