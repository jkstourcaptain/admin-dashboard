import { Request, Response } from "express";
import { db } from "../config/database";

// 사용자 회원가입
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { user_id, name, email, phone, platform, marketing_consent } = req.body;

    if (!user_id || !name || !platform) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    if (!['AOS', 'iOS'].includes(platform)) {
      return res.status(400).json({ error: "Invalid platform" });
    }

    // 사용자 등록
    db.run(`
      INSERT INTO users (user_id, name, email, phone, platform, marketing_consent)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [user_id, name, email, phone, platform, marketing_consent || 0], function(err) {
      if (err) {
        console.error("User registration error:", err);
        if (err.message.includes("UNIQUE constraint failed")) {
          return res.status(409).json({ error: "User already exists" });
        }
        return res.status(500).json({ error: "Registration failed" });
      }

      // 일별 가입자 수 업데이트
      const today = new Date().toISOString().split('T')[0];
      db.run(`
        INSERT OR REPLACE INTO user_signups_daily (date, platform, signup_count)
        VALUES (?, ?, COALESCE((
          SELECT signup_count FROM user_signups_daily 
          WHERE date = ? AND platform = ?
        ), 0) + 1)
      `, [today, platform, today, platform], (statsErr) => {
        if (statsErr) {
          console.error("Failed to update signup stats:", statsErr);
        }
      });

      res.status(201).json({
        message: "User registered successfully",
        user_id: user_id,
        id: this.lastID
      });
    });
  } catch (error) {
    console.error("Register user error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 사용자 프로필 조회
export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    db.get(`
      SELECT id, user_id, name, email, phone, platform, level, points, 
             marketing_consent, status, created_at, last_login
      FROM users WHERE user_id = ?
    `, [userId], (err, user) => {
      if (err) {
        console.error("Get user profile error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 사용자 프로필 업데이트
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { name, email, phone, marketing_consent } = req.body;

    db.run(`
      UPDATE users 
      SET name = ?, email = ?, phone = ?, marketing_consent = ?, 
          updated_at = CURRENT_TIMESTAMP, last_login = CURRENT_TIMESTAMP
      WHERE user_id = ?
    `, [name, email, phone, marketing_consent, userId], function(err) {
      if (err) {
        console.error("Update user profile error:", err);
        return res.status(500).json({ error: "Update failed" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};