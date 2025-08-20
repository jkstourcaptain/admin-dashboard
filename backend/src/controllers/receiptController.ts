import { Request, Response } from "express";
import { db } from "../config/database";

export const getReceipts = async (req: Request, res: Response) => {
  try {
    db.all(`
      SELECT 
        r.id, r.store_name as storeName, r.purchase_amount as amount,
        r.purchase_date, r.receipt_image_url as receiptImage,
        CASE 
          WHEN r.status = 'pending' THEN '승인대기'
          WHEN r.status = 'approved' THEN '승인완료'
          WHEN r.status = 'rejected' THEN '반려'
          ELSE r.status
        END as status,
        r.points_awarded as points, r.admin_response as rejectReason,
        datetime(r.created_at) as uploadDate,
        datetime(r.updated_at) as approvalDate,
        u.user_id as userId, u.name as userName
      FROM receipts r
      LEFT JOIN users u ON r.user_id = u.id
      ORDER BY r.created_at DESC
    `, (err, receipts) => {
      if (err) {
        console.error("Error fetching receipts:", err);
        return res.status(500).json({
          success: false,
          message: "영수증 목록 조회 중 오류가 발생했습니다."
        });
      }

      res.json({
        success: true,
        data: receipts,
        total: receipts.length
      });
    });
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({
      success: false,
      message: "영수증 목록 조회 중 오류가 발생했습니다."
    });
  }
};

export const getReceiptDetail = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    db.get(`
      SELECT 
        r.id, r.store_name as storeName, r.purchase_amount as amount,
        r.purchase_date, r.receipt_image_url as receiptImage, r.description,
        CASE 
          WHEN r.status = 'pending' THEN '승인대기'
          WHEN r.status = 'approved' THEN '승인완료'
          WHEN r.status = 'rejected' THEN '반려'
          ELSE r.status
        END as status,
        r.points_awarded as points, r.admin_response as rejectReason,
        datetime(r.created_at) as uploadDate,
        datetime(r.updated_at) as approvalDate,
        u.user_id as userId, u.name as userName, u.email, u.phone, 
        u.level, u.points as totalPoints
      FROM receipts r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.id = ?
    `, [id], (err, receipt: any) => {
      if (err) {
        console.error("Error fetching receipt detail:", err);
        return res.status(500).json({
          success: false,
          message: "영수증 상세 조회 중 오류가 발생했습니다."
        });
      }

      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: "영수증을 찾을 수 없습니다."
        });
      }

      // userInfo 객체 추가
      const receiptWithUserInfo = {
        ...receipt,
        userInfo: {
          email: receipt.email,
          phone: receipt.phone,
          level: receipt.level,
          totalPoints: receipt.totalPoints
        }
      };
      
      // 원본 데이터에서 중복 제거
      delete receiptWithUserInfo.email;
      delete receiptWithUserInfo.phone;
      delete receiptWithUserInfo.level;
      delete receiptWithUserInfo.totalPoints;

      res.json({
        success: true,
        data: receiptWithUserInfo
      });
    });
  } catch (error) {
    console.error("Error fetching receipt detail:", error);
    res.status(500).json({
      success: false,
      message: "영수증 상세 조회 중 오류가 발생했습니다."
    });
  }
};

export const approveReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { points } = req.body;
    
    if (!points || points <= 0) {
      return res.status(400).json({
        success: false,
        message: "유효한 포인트를 입력해주세요."
      });
    }

    // 영수증 정보 조회
    db.get(`SELECT user_id FROM receipts WHERE id = ? AND status = 'pending'`, [id], (err, receipt: any) => {
      if (err) {
        console.error("Error finding receipt:", err);
        return res.status(500).json({
          success: false,
          message: "영수증 승인 중 오류가 발생했습니다."
        });
      }

      if (!receipt) {
        return res.status(404).json({
          success: false,
          message: "승인 대기 상태의 영수증을 찾을 수 없습니다."
        });
      }

      // 영수증 승인 처리
      db.run(`
        UPDATE receipts 
        SET status = 'approved', points_awarded = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [parseInt(points), id], function(updateErr) {
        if (updateErr) {
          console.error("Error updating receipt:", updateErr);
          return res.status(500).json({
            success: false,
            message: "영수증 승인 중 오류가 발생했습니다."
          });
        }

        // 사용자 포인트 지급
        db.run(`
          UPDATE users SET points = points + ? WHERE id = ?
        `, [parseInt(points), receipt.user_id], (pointsErr) => {
          if (pointsErr) {
            console.error("Error updating user points:", pointsErr);
          }

          res.json({
            success: true,
            message: "영수증이 승인되고 포인트가 지급되었습니다.",
            data: {
              id: parseInt(id),
              status: "승인완료",
              points: parseInt(points),
              approvalDate: new Date().toISOString()
            }
          });
        });
      });
    });
  } catch (error) {
    console.error("Error approving receipt:", error);
    res.status(500).json({
      success: false,
      message: "영수증 승인 중 오류가 발생했습니다."
    });
  }
};

export const rejectReceipt = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "반려 사유를 입력해주세요."
      });
    }

    db.run(`
      UPDATE receipts 
      SET status = 'rejected', admin_response = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND status = 'pending'
    `, [reason, id], function(err) {
      if (err) {
        console.error("Error rejecting receipt:", err);
        return res.status(500).json({
          success: false,
          message: "영수증 반려 중 오류가 발생했습니다."
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: "반려 가능한 영수증을 찾을 수 없습니다."
        });
      }

      res.json({
        success: true,
        message: "영수증이 반려되었습니다.",
        data: {
          id: parseInt(id),
          status: "반려",
          rejectReason: reason,
          rejectDate: new Date().toISOString()
        }
      });
    });
  } catch (error) {
    console.error("Error rejecting receipt:", error);
    res.status(500).json({
      success: false,
      message: "영수증 반려 중 오류가 발생했습니다."
    });
  }
};