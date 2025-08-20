import { Router } from "express";
import * as appContentController from "../controllers/appContentController";

const router = Router();

// 퀴즈 관련
router.get("/quizzes", appContentController.getActiveQuizzes);
router.post("/quizzes/:quizId/complete", appContentController.completeQuiz);

// 광고/매장 관련
router.get("/advertisements", appContentController.getActiveAds);
router.post("/advertisements/:adId/visit", appContentController.recordAdVisit);

// 상품 관련
router.get("/products", appContentController.getActiveProducts);
router.post("/purchases", appContentController.createPurchase);

// 공지사항
router.get("/notices", appContentController.getActiveNotices);

export default router;