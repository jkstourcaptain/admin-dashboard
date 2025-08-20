import express from "express";
import { authenticateToken } from "../middleware/auth";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/productController";

const router = express.Router();

// 모든 상품 관련 라우트에 인증 미들웨어 적용
router.use(authenticateToken);

// GET /api/admin/products - 상품 목록 조회
router.get("/", getProducts);

// GET /api/admin/products/:id - 특정 상품 조회
router.get("/:id", getProduct);

// POST /api/admin/products - 상품 등록
router.post("/", createProduct);

// PUT /api/admin/products/:id - 상품 수정
router.put("/:id", updateProduct);

// DELETE /api/admin/products/:id - 상품 삭제
router.delete("/:id", deleteProduct);

export default router;