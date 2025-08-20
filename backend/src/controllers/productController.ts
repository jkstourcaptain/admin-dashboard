import { Request, Response } from "express";
import { db } from "../config/database";

export const getProducts = async (req: Request, res: Response) => {
  try {
    db.all(`
      SELECT 
        id, name, category, description, price_points as price, 
        stock_quantity as stock, total_sales as sales,
        CASE 
          WHEN status = 'active' AND stock_quantity > 0 THEN '판매중'
          WHEN status = 'active' AND stock_quantity = 0 THEN '품절'
          ELSE '비활성'
        END as status,
        date(created_at) as registerDate,
        image_url as image
      FROM products
      ORDER BY created_at DESC
    `, (err, products) => {
      if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({
          success: false,
          message: "상품 목록 조회 중 오류가 발생했습니다."
        });
      }

      res.json({
        success: true,
        data: products,
        total: products.length
      });
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "상품 목록 조회 중 오류가 발생했습니다."
    });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.get(`
      SELECT 
        id, name, category, description, price_points as price, 
        stock_quantity as stock, total_sales as sales,
        CASE 
          WHEN status = 'active' AND stock_quantity > 0 THEN '판매중'
          WHEN status = 'active' AND stock_quantity = 0 THEN '품절'
          ELSE '비활성'
        END as status,
        date(created_at) as registerDate,
        image_url as image
      FROM products
      WHERE id = ?
    `, [id], (err, product) => {
      if (err) {
        console.error("Error fetching product:", err);
        return res.status(500).json({
          success: false,
          message: "상품 조회 중 오류가 발생했습니다."
        });
      }

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "상품을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        data: product
      });
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "상품 조회 중 오류가 발생했습니다."
    });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, category, price, stock, description, image_url } = req.body;
    
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "필수 필드가 누락되었습니다."
      });
    }

    db.run(`
      INSERT INTO products (name, category, description, price_points, stock_quantity, image_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [name, category, description || "", parseInt(price), parseInt(stock), image_url || ""], function(err) {
      if (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({
          success: false,
          message: "상품 등록 중 오류가 발생했습니다."
        });
      }

      const newProduct = {
        id: this.lastID,
        name,
        category,
        price: parseInt(price),
        stock: parseInt(stock),
        sales: 0,
        status: "판매중",
        registerDate: new Date().toISOString().split('T')[0],
        description: description || "",
        image: image_url || ""
      };

      res.status(201).json({
        success: true,
        data: newProduct,
        message: "상품이 성공적으로 등록되었습니다."
      });
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "상품 등록 중 오류가 발생했습니다."
    });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, status, description, image_url } = req.body;
    
    if (!name || !category || !price || stock === undefined) {
      return res.status(400).json({
        success: false,
        message: "필수 필드가 누락되었습니다."
      });
    }

    const dbStatus = status === '판매중' ? 'active' : status === '비활성' ? 'inactive' : 'active';
    
    db.run(`
      UPDATE products 
      SET name = ?, category = ?, description = ?, price_points = ?, 
          stock_quantity = ?, status = ?, image_url = ?
      WHERE id = ?
    `, [name, category, description || "", parseInt(price), parseInt(stock), dbStatus, image_url || "", id], function(err) {
      if (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({
          success: false,
          message: "상품 수정 중 오류가 발생했습니다."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "상품을 찾을 수 없습니다."
        });
      }

      const updatedProduct = {
        id: parseInt(id),
        name,
        category,
        price: parseInt(price),
        stock: parseInt(stock),
        status: status || "판매중",
        description: description || "",
        image: image_url || ""
      };

      res.json({
        success: true,
        data: updatedProduct,
        message: "상품이 성공적으로 수정되었습니다."
      });
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "상품 수정 중 오류가 발생했습니다."
    });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.run(`DELETE FROM products WHERE id = ?`, [id], function(err) {
      if (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({
          success: false,
          message: "상품 삭제 중 오류가 발생했습니다."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "상품을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        message: "상품이 성공적으로 삭제되었습니다."
      });
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "상품 삭제 중 오류가 발생했습니다."
    });
  }
};