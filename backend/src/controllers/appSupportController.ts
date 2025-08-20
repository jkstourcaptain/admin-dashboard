import { Request, Response } from "express";
import { db } from "../config/database";

// 문의사항 생성
export const createInquiry = async (req: Request, res: Response) => {
  try {
    const { user_id, category, title, content, contact_email } = req.body;

    if (!user_id || !category || !title || !content) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // 사용자 ID 조회
    db.get(`SELECT id FROM users WHERE user_id = ?`, [user_id], (userErr, user: any) => {
      if (userErr || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 문의사항 생성
      db.run(`
        INSERT INTO inquiries (user_id, category, title, content, contact_email)
        VALUES (?, ?, ?, ?, ?)
      `, [user.id, category, title, content, contact_email], function(err) {
        if (err) {
          console.error("Create inquiry error:", err);
          return res.status(500).json({ error: "Failed to create inquiry" });
        }

        res.status(201).json({
          message: "Inquiry created successfully",
          inquiry_id: this.lastID
        });
      });
    });
  } catch (error) {
    console.error("Create inquiry error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 사용자별 문의사항 목록 조회
export const getUserInquiries = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    // 사용자 ID 조회
    db.get(`SELECT id FROM users WHERE user_id = ?`, [userId], (userErr, user: any) => {
      if (userErr || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      db.all(`
        SELECT id, category, title, content, contact_email, status, 
               admin_response, created_at, updated_at
        FROM inquiries 
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `, [user.id, Number(limit), Number(offset)], (err, inquiries) => {
        if (err) {
          console.error("Get user inquiries error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.json({ inquiries });
      });
    });
  } catch (error) {
    console.error("Get user inquiries error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 영수증 업로드
export const uploadReceipt = async (req: Request, res: Response) => {
  try {
    const { 
      user_id, 
      store_name, 
      purchase_amount, 
      purchase_date, 
      receipt_image_url,
      description 
    } = req.body;

    if (!user_id || !store_name || !purchase_amount || !purchase_date || !receipt_image_url) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // 사용자 ID 조회
    db.get(`SELECT id FROM users WHERE user_id = ?`, [user_id], (userErr, user: any) => {
      if (userErr || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      // 영수증 업로드
      db.run(`
        INSERT INTO receipts (user_id, store_name, purchase_amount, purchase_date, 
                            receipt_image_url, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [user.id, store_name, purchase_amount, purchase_date, receipt_image_url, description], function(err) {
        if (err) {
          console.error("Upload receipt error:", err);
          return res.status(500).json({ error: "Failed to upload receipt" });
        }

        res.status(201).json({
          message: "Receipt uploaded successfully",
          receipt_id: this.lastID,
          status: "pending"
        });
      });
    });
  } catch (error) {
    console.error("Upload receipt error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 사용자별 영수증 목록 조회
export const getUserReceipts = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 20, offset = 0, status } = req.query;

    // 사용자 ID 조회
    db.get(`SELECT id FROM users WHERE user_id = ?`, [userId], (userErr, user: any) => {
      if (userErr || !user) {
        return res.status(404).json({ error: "User not found" });
      }

      let query = `
        SELECT id, store_name, purchase_amount, purchase_date, receipt_image_url,
               description, status, admin_response, points_awarded, created_at, updated_at
        FROM receipts 
        WHERE user_id = ?
      `;
      const params: any[] = [user.id];

      if (status) {
        query += ` AND status = ?`;
        params.push(status);
      }

      query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
      params.push(Number(limit), Number(offset));

      db.all(query, params, (err, receipts) => {
        if (err) {
          console.error("Get user receipts error:", err);
          return res.status(500).json({ error: "Database error" });
        }

        res.json({ receipts });
      });
    });
  } catch (error) {
    console.error("Get user receipts error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};