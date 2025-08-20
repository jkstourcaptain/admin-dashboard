import { Request, Response } from "express";
import { db } from "../config/database";

// 활성 퀴즈 목록 조회
export const getActiveQuizzes = async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT id, title, category, difficulty, question, 
             option1, option2, option3, option4, reward_points
      FROM quizzes 
      WHERE status = 'active'
    `;
    const params: any[] = [];
    
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, quizzes) => {
      if (err) {
        console.error("Get quizzes error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ quizzes });
    });
  } catch (error) {
    console.error("Get active quizzes error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 퀴즈 완료 처리
export const completeQuiz = async (req: Request, res: Response) => {
  try {
    const { quizId } = req.params;
    const { user_id, selected_answer } = req.body;

    if (!user_id || !selected_answer) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // 퀴즈 정보 조회
    db.get(`
      SELECT id, correct_answer, reward_points
      FROM quizzes WHERE id = ? AND status = 'active'
    `, [quizId], (err, quiz: any) => {
      if (err) {
        console.error("Get quiz error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!quiz) {
        return res.status(404).json({ error: "Quiz not found" });
      }

      const isCorrect = quiz.correct_answer === Number(selected_answer);
      const pointsEarned = isCorrect ? quiz.reward_points : 0;

      // 사용자 ID 조회
      db.get(`SELECT id FROM users WHERE user_id = ?`, [user_id], (userErr, user: any) => {
        if (userErr || !user) {
          return res.status(404).json({ error: "User not found" });
        }

        // 퀴즈 완료 기록
        db.run(`
          INSERT OR REPLACE INTO quiz_completions 
          (user_id, quiz_id, selected_answer, is_correct, points_earned)
          VALUES (?, ?, ?, ?, ?)
        `, [user.id, quizId, selected_answer, isCorrect ? 1 : 0, pointsEarned], function(completionErr) {
          if (completionErr) {
            console.error("Quiz completion error:", completionErr);
            return res.status(500).json({ error: "Failed to record completion" });
          }

          // 사용자 포인트 업데이트
          if (pointsEarned > 0) {
            db.run(`
              UPDATE users SET points = points + ? WHERE id = ?
            `, [pointsEarned, user.id]);

            // 일별 리워드 통계 업데이트
            const today = new Date().toISOString().split('T')[0];
            db.run(`
              INSERT OR REPLACE INTO rewards_daily (date, reward_type, total_rewards, total_points, unique_users)
              VALUES (?, 'quiz', 
                COALESCE((SELECT total_rewards FROM rewards_daily WHERE date = ? AND reward_type = 'quiz'), 0) + 1,
                COALESCE((SELECT total_points FROM rewards_daily WHERE date = ? AND reward_type = 'quiz'), 0) + ?,
                COALESCE((SELECT unique_users FROM rewards_daily WHERE date = ? AND reward_type = 'quiz'), 0) + 1
              )
            `, [today, today, today, pointsEarned, today]);
          }

          res.json({
            message: "Quiz completed",
            is_correct: isCorrect,
            points_earned: pointsEarned
          });
        });
      });
    });
  } catch (error) {
    console.error("Complete quiz error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 활성 광고 목록 조회
export const getActiveAds = async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT id, name, address, category, ad_type, position, 
             reward_points, target_url
      FROM advertisements 
      WHERE status = 'active' AND (end_date IS NULL OR end_date >= date('now'))
    `;
    const params: any[] = [];
    
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, ads) => {
      if (err) {
        console.error("Get ads error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ advertisements: ads });
    });
  } catch (error) {
    console.error("Get active ads error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 매장 방문 기록
export const recordAdVisit = async (req: Request, res: Response) => {
  try {
    const { adId } = req.params;
    const { user_id, visit_type = 'actual', location_verified = false } = req.body;

    if (!user_id) {
      return res.status(400).json({ error: "User ID required" });
    }

    // 광고 정보 조회
    db.get(`
      SELECT id, reward_points, daily_visit_limit
      FROM advertisements WHERE id = ? AND status = 'active'
    `, [adId], (err, ad: any) => {
      if (err) {
        console.error("Get ad error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!ad) {
        return res.status(404).json({ error: "Advertisement not found" });
      }

      // 사용자 ID 조회
      db.get(`SELECT id FROM users WHERE user_id = ?`, [user_id], (userErr, user: any) => {
        if (userErr || !user) {
          return res.status(404).json({ error: "User not found" });
        }

        // 오늘 방문 횟수 확인
        const today = new Date().toISOString().split('T')[0];
        db.get(`
          SELECT COUNT(*) as visit_count
          FROM ad_visits 
          WHERE user_id = ? AND ad_id = ? AND date(visited_at) = ?
        `, [user.id, adId, today], (visitErr, visitCount: any) => {
          if (visitErr) {
            return res.status(500).json({ error: "Failed to check visit count" });
          }

          if (visitCount.visit_count >= ad.daily_visit_limit) {
            return res.status(429).json({ error: "Daily visit limit exceeded" });
          }

          // 방문 기록 및 리워드 지급
          const pointsEarned = ad.reward_points;
          
          db.run(`
            INSERT INTO ad_visits (user_id, ad_id, visit_type, points_earned, location_verified)
            VALUES (?, ?, ?, ?, ?)
          `, [user.id, adId, visit_type, pointsEarned, location_verified ? 1 : 0], function(visitInsertErr) {
            if (visitInsertErr) {
              console.error("Ad visit insert error:", visitInsertErr);
              return res.status(500).json({ error: "Failed to record visit" });
            }

            // 사용자 포인트 업데이트
            db.run(`UPDATE users SET points = points + ? WHERE id = ?`, [pointsEarned, user.id]);

            // 광고 방문 수 업데이트
            db.run(`
              UPDATE advertisements 
              SET today_visits = today_visits + 1, total_visits = total_visits + 1
              WHERE id = ?
            `, [adId]);

            // 일별 리워드 통계 업데이트
            db.run(`
              INSERT OR REPLACE INTO rewards_daily (date, reward_type, total_rewards, total_points, unique_users)
              VALUES (?, 'visit', 
                COALESCE((SELECT total_rewards FROM rewards_daily WHERE date = ? AND reward_type = 'visit'), 0) + 1,
                COALESCE((SELECT total_points FROM rewards_daily WHERE date = ? AND reward_type = 'visit'), 0) + ?,
                COALESCE((SELECT unique_users FROM rewards_daily WHERE date = ? AND reward_type = 'visit'), 0) + 1
              )
            `, [today, today, today, pointsEarned, today]);

            res.json({
              message: "Visit recorded successfully",
              points_earned: pointsEarned
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Record ad visit error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 활성 상품 목록 조회
export const getActiveProducts = async (req: Request, res: Response) => {
  try {
    const { category, limit = 20, offset = 0 } = req.query;
    
    let query = `
      SELECT id, name, category, description, price_points, stock_quantity,
             effect_type, effect_duration, rarity, image_url
      FROM products 
      WHERE status = 'active' AND stock_quantity > 0
    `;
    const params: any[] = [];
    
    if (category) {
      query += ` AND category = ?`;
      params.push(category);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    params.push(Number(limit), Number(offset));

    db.all(query, params, (err, products) => {
      if (err) {
        console.error("Get products error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ products });
    });
  } catch (error) {
    console.error("Get active products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 상품 구매
export const createPurchase = async (req: Request, res: Response) => {
  try {
    const { user_id, product_id, quantity = 1 } = req.body;

    if (!user_id || !product_id) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    // 상품 정보 조회
    db.get(`
      SELECT id, name, price_points, stock_quantity
      FROM products WHERE id = ? AND status = 'active'
    `, [product_id], (err, product: any) => {
      if (err) {
        console.error("Get product error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }

      if (product.stock_quantity < quantity) {
        return res.status(400).json({ error: "Insufficient stock" });
      }

      const totalPoints = product.price_points * quantity;

      // 사용자 정보 조회
      db.get(`
        SELECT id, points FROM users WHERE user_id = ?
      `, [user_id], (userErr, user: any) => {
        if (userErr || !user) {
          return res.status(404).json({ error: "User not found" });
        }

        if (user.points < totalPoints) {
          return res.status(400).json({ error: "Insufficient points" });
        }

        // 구매 처리
        const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        db.run(`
          INSERT INTO purchases (user_id, product_id, quantity, total_points, transaction_id)
          VALUES (?, ?, ?, ?, ?)
        `, [user.id, product_id, quantity, totalPoints, transactionId], function(purchaseErr) {
          if (purchaseErr) {
            console.error("Purchase error:", purchaseErr);
            return res.status(500).json({ error: "Purchase failed" });
          }

          // 사용자 포인트 차감
          db.run(`UPDATE users SET points = points - ? WHERE id = ?`, [totalPoints, user.id]);

          // 상품 재고 감소
          db.run(`UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?`, [quantity, product_id]);

          res.status(201).json({
            message: "Purchase completed",
            purchase_id: this.lastID,
            transaction_id: transactionId,
            total_points: totalPoints
          });
        });
      });
    });
  } catch (error) {
    console.error("Create purchase error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 활성 공지사항 조회
export const getActiveNotices = async (req: Request, res: Response) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    db.all(`
      SELECT id, title, content, category, priority, is_pinned, view_count, created_at
      FROM notices 
      WHERE status = 'active'
      ORDER BY is_pinned DESC, priority DESC, created_at DESC
      LIMIT ? OFFSET ?
    `, [Number(limit), Number(offset)], (err, notices) => {
      if (err) {
        console.error("Get notices error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      res.json({ notices });
    });
  } catch (error) {
    console.error("Get active notices error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};