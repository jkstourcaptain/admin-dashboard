import { Request, Response } from "express";
import { db } from "../config/database";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // 오늘 가입자 수 조회
    db.get(`
      SELECT COALESCE(SUM(signup_count), 0) as today_signups
      FROM user_signups_daily 
      WHERE date = ?
    `, [today], (err, todaySignups: any) => {
      if (err) {
        console.error("Today signups query error:", err);
        return res.status(500).json({ error: "Database error" });
      }

      // 전체 회원 수 조회
      db.get(`SELECT COUNT(*) as total_members FROM users`, (membersErr, totalMembers: any) => {
        if (membersErr) {
          console.error("Total members query error:", membersErr);
          return res.status(500).json({ error: "Database error" });
        }

        // 승인 대기 영수증 수 조회
        db.get(`
          SELECT COUNT(*) as pending_receipts 
          FROM receipts 
          WHERE status = 'pending'
        `, (receiptsErr, pendingReceipts: any) => {
          if (receiptsErr) {
            console.error("Pending receipts query error:", receiptsErr);
            return res.status(500).json({ error: "Database error" });
          }

          // 답변 대기 문의사항 수 조회
          db.get(`
            SELECT COUNT(*) as pending_inquiries 
            FROM inquiries 
            WHERE status = 'pending'
          `, (inquiriesErr, pendingInquiries: any) => {
            if (inquiriesErr) {
              console.error("Pending inquiries query error:", inquiriesErr);
              return res.status(500).json({ error: "Database error" });
            }

            // 최근 7일 일별 가입자 통계
            db.all(`
              SELECT 
                date,
                COALESCE(SUM(CASE WHEN platform = 'AOS' THEN signup_count ELSE 0 END), 0) as android_users,
                COALESCE(SUM(CASE WHEN platform = 'iOS' THEN signup_count ELSE 0 END), 0) as ios_users,
                COALESCE(SUM(signup_count), 0) as total_users
              FROM user_signups_daily
              WHERE date >= date('now', '-7 days')
              GROUP BY date
              ORDER BY date DESC
              LIMIT 7
            `, (dailyErr, dailyStats: any[]) => {
              if (dailyErr) {
                console.error("Daily stats query error:", dailyErr);
                return res.status(500).json({ error: "Database error" });
              }

              // 최근 7일 리워드 통계
              db.all(`
                SELECT 
                  date,
                  COALESCE(SUM(CASE WHEN reward_type = 'visit' THEN total_rewards ELSE 0 END), 0) as actual_visits,
                  COALESCE(SUM(CASE WHEN reward_type = 'quiz' THEN total_rewards ELSE 0 END), 0) as mission_completion
                FROM rewards_daily
                WHERE date >= date('now', '-7 days')
                GROUP BY date
                ORDER BY date DESC
                LIMIT 7
              `, (rewardErr, rewardStats: any[]) => {
                if (rewardErr) {
                  console.error("Reward stats query error:", rewardErr);
                  return res.status(500).json({ error: "Database error" });
                }

                // 주별 리워드 통계 (최근 4주)
                db.all(`
                  SELECT 
                    CASE 
                      WHEN strftime('%W', date) = strftime('%W', 'now') THEN strftime('%m월 %d주', 'now')
                      WHEN strftime('%W', date) = strftime('%W', 'now', '-7 days') THEN strftime('%m월 %d주', 'now', '-7 days')
                      WHEN strftime('%W', date) = strftime('%W', 'now', '-14 days') THEN strftime('%m월 %d주', 'now', '-14 days')
                      WHEN strftime('%W', date) = strftime('%W', 'now', '-21 days') THEN strftime('%m월 %d주', 'now', '-21 days')
                      ELSE strftime('%m월 %d주', date)
                    END as week,
                    COALESCE(SUM(total_rewards), 0) as total_rewards
                  FROM rewards_daily
                  WHERE date >= date('now', '-28 days')
                  GROUP BY strftime('%W', date)
                  ORDER BY date DESC
                  LIMIT 4
                `, (weeklyErr, weeklyStats: any[]) => {
                  if (weeklyErr) {
                    console.error("Weekly stats query error:", weeklyErr);
                    return res.status(500).json({ error: "Database error" });
                  }

                  // 날짜 포맷 변경 (MM/DD)
                  const formattedDailyStats = dailyStats.map(stat => ({
                    ...stat,
                    date: new Date(stat.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('.', '/').slice(0, -1)
                  }));

                  const formattedRewardStats = rewardStats.map(stat => ({
                    ...stat,
                    date: new Date(stat.date).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' }).replace('.', '/').slice(0, -1)
                  }));

                  const dashboardStats = {
                    today_signups: todaySignups.today_signups,
                    total_members: totalMembers.total_members,
                    pending_receipts: pendingReceipts.pending_receipts,
                    pending_inquiries: pendingInquiries.pending_inquiries,
                    daily_stats: formattedDailyStats,
                    reward_stats: formattedRewardStats,
                    weekly_reward_stats: weeklyStats
                  };

                  res.json(dashboardStats);
                });
              });
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
