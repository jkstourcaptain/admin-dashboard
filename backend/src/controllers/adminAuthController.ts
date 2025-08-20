import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../config/database";
import { generateToken } from "../middleware/auth";

export const adminLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }

    // 어드민 사용자 조회
    db.get(
      "SELECT * FROM admin_users WHERE username = ? AND is_active = 1",
      [username],
      async (err, adminUser: any) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!adminUser) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // 비밀번호 검증
        const isValidPassword = await bcrypt.compare(
          password,
          adminUser.password_hash
        );
        if (!isValidPassword) {
          return res.status(401).json({ error: "Invalid credentials" });
        }

        // 마지막 로그인 시간 업데이트
        db.run(
          "UPDATE admin_users SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
          [adminUser.id]
        );

        // JWT 토큰 생성
        const token = generateToken(adminUser.id, adminUser.role);

        res.json({
          message: "Login successful",
          admin: {
            id: adminUser.id,
            username: adminUser.username,
            email: adminUser.email,
            role: adminUser.role,
          },
          token,
        });
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAdminProfile = async (req: any, res: Response) => {
  try {
    const adminUserId = req.adminUserId;

    db.get(
      "SELECT id, username, email, role, is_active, last_login, created_at FROM admin_users WHERE id = ?",
      [adminUserId],
      (err, adminUser: any) => {
        if (err) {
          console.error("Database error:", err);
          return res.status(500).json({ error: "Internal server error" });
        }

        if (!adminUser) {
          return res.status(404).json({ error: "Admin user not found" });
        }

        res.json({ admin: adminUser });
      }
    );
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
