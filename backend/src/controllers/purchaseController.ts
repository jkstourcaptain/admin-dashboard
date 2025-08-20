import { Request, Response } from "express";
import { db } from "../config/database";

export const getPurchases = async (req: Request, res: Response) => {
  try {
    db.all(`
      SELECT 
        p.id, p.quantity, p.total_points as points, p.transaction_id,
        datetime(p.created_at) as purchaseDate,
        '완료' as status,
        '포인트' as paymentMethod,
        '즉시 지급' as deliveryInfo,
        u.name as buyer, u.user_id, u.email, u.phone,
        pr.name as product, pr.category, pr.description
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id  
      LEFT JOIN products pr ON p.product_id = pr.id
      ORDER BY p.created_at DESC
    `, (err, purchases: any[]) => {
      if (err) {
        console.error("Error fetching purchases:", err);
        return res.status(500).json({
          success: false,
          message: "구매 내역 조회 중 오류가 발생했습니다."
        });
      }

      // 데이터 형식 정리
      const formattedPurchases = purchases.map(purchase => ({
        id: purchase.id,
        buyer: purchase.buyer,
        product: purchase.product,
        quantity: purchase.quantity,
        points: purchase.points,
        status: purchase.status,
        purchaseDate: purchase.purchaseDate,
        paymentMethod: purchase.paymentMethod,
        deliveryInfo: purchase.deliveryInfo,
        buyerInfo: {
          userId: purchase.user_id,
          email: purchase.email,
          phone: purchase.phone
        },
        productInfo: {
          category: purchase.category,
          description: purchase.description
        }
      }));

      res.json({
        success: true,
        data: formattedPurchases,
        total: formattedPurchases.length
      });
    });
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({
      success: false,
      message: "구매 내역 조회 중 오류가 발생했습니다."
    });
  }
};

export const getPurchaseDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.get(`
      SELECT 
        p.id, p.quantity, p.total_points as points, p.transaction_id,
        datetime(p.created_at) as purchaseDate,
        '완료' as status,
        '포인트' as paymentMethod,
        '즉시 지급' as deliveryInfo,
        datetime(p.created_at) as deliveryDate,
        u.name as buyer, u.user_id, u.email, u.phone, u.level,
        pr.name as product, pr.category, pr.description, pr.effect_type,
        pr.effect_duration, pr.rarity
      FROM purchases p
      LEFT JOIN users u ON p.user_id = u.id  
      LEFT JOIN products pr ON p.product_id = pr.id
      WHERE p.id = ?
    `, [id], (err, purchase: any) => {
      if (err) {
        console.error("Error fetching purchase detail:", err);
        return res.status(500).json({
          success: false,
          message: "구매 상세 조회 중 오류가 발생했습니다."
        });
      }

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "구매 내역을 찾을 수 없습니다."
        });
      }

      // 사용자의 총 구매 횟수 조회
      db.get(`
        SELECT COUNT(*) as totalPurchases
        FROM purchases 
        WHERE user_id = (SELECT user_id FROM purchases WHERE id = ?)
      `, [id], (countErr, purchaseCount: any) => {
        if (countErr) {
          console.error("Error fetching purchase count:", countErr);
        }

        const formattedPurchase = {
          id: purchase.id,
          buyer: purchase.buyer,
          product: purchase.product,
          quantity: purchase.quantity,
          points: purchase.points,
          status: purchase.status,
          purchaseDate: purchase.purchaseDate,
          paymentMethod: purchase.paymentMethod,
          deliveryInfo: purchase.deliveryInfo,
          deliveryDate: purchase.deliveryDate,
          buyerInfo: {
            userId: purchase.user_id,
            userName: purchase.buyer,
            email: purchase.email,
            phone: purchase.phone,
            level: purchase.level,
            totalPurchases: purchaseCount ? purchaseCount.totalPurchases : 0
          },
          productInfo: {
            productId: `P${purchase.id.toString().padStart(3, '0')}`,
            category: purchase.category,
            description: purchase.description,
            effectDuration: purchase.effect_duration || '즉시',
            rarity: purchase.rarity || '일반'
          },
          transactionInfo: {
            transactionId: purchase.transaction_id,
            beforePoints: 0, // 이런 정보는 새로운 트랜잭션 로그를 만들어야 함
            afterPoints: 0,
            usedPoints: purchase.points
          }
        };

        res.json({
          success: true,
          data: formattedPurchase
        });
      });
    });
  } catch (error) {
    console.error("Error fetching purchase detail:", error);
    res.status(500).json({
      success: false,
      message: "구매 상세 조회 중 오류가 발생했습니다."
    });
  }
};

export const cancelPurchase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "취소 사유를 입력해주세요."
      });
    }

    // 구매 정보 조회
    db.get(`
      SELECT user_id, total_points 
      FROM purchases 
      WHERE id = ?
    `, [id], (err, purchase: any) => {
      if (err) {
        console.error("Error finding purchase:", err);
        return res.status(500).json({
          success: false,
          message: "구매 취소 중 오류가 발생했습니다."
        });
      }

      if (!purchase) {
        return res.status(404).json({
          success: false,
          message: "구매 내역을 찾을 수 없습니다."
        });
      }

      // 구매 취소 처리 (삭제 대신 상태 업데이트를 위해 status 컷럼 추가가 필요하지만 임시로 삭제)
      db.run(`DELETE FROM purchases WHERE id = ?`, [id], function(deleteErr) {
        if (deleteErr) {
          console.error("Error canceling purchase:", deleteErr);
          return res.status(500).json({
            success: false,
            message: "구매 취소 중 오류가 발생했습니다."
          });
        }

        // 포인트 환불
        db.run(`
          UPDATE users SET points = points + ? WHERE id = ?
        `, [purchase.total_points, purchase.user_id], (pointsErr) => {
          if (pointsErr) {
            console.error("Error refunding points:", pointsErr);
          }

          res.json({
            success: true,
            message: "구매가 성공적으로 취소되고 포인트가 환불되었습니다.",
            data: {
              id: parseInt(id),
              status: "취소",
              cancelReason: reason,
              cancelDate: new Date().toISOString(),
              refundedPoints: purchase.total_points
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Error canceling purchase:", error);
    res.status(500).json({
      success: false,
      message: "구매 취소 중 오류가 발생했습니다."
    });
  }
};