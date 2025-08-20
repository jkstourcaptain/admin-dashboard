import React, { useEffect } from "react";
import { useDashboardStore } from "../store/dashboardStore";
import KPICard from "../components/KPICard";
import UserStatsChart from "../components/UserStatsChart";
import UserStatsCards from "../components/UserStatsCards";
import RewardStatsChart from "../components/RewardStatsChart";
import WeeklyRewardChart from "../components/WeeklyRewardChart";

const Dashboard: React.FC = () => {
  const { stats, loading, error, fetchStats } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 text-center">
          <p className="text-lg font-semibold">오류가 발생했습니다</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // 지난주 평균 계산 (Android, iOS 가입자)
  const weeklyAverage = Math.round(
    stats.daily_stats
      .slice(0, 7)
      .reduce((sum, day) => sum + day.total_users, 0) / 7
  );

  // Android, iOS 실시간 가입자 수 (가장 최근 데이터)
  const latestStats = stats.daily_stats[stats.daily_stats.length - 1];
  const androidSignups = latestStats?.android_users || 0;
  const iosSignups = latestStats?.ios_users || 0;

  // 지난주 평균 대비 변화량
  const androidChange = androidSignups - Math.round(weeklyAverage * 0.33); // Android 비율 추정
  const iosChange = iosSignups - Math.round(weeklyAverage * 0.67); // iOS 비율 추정

  return (
    <div className="p-6 space-y-6">
      <div className="text-green-500 font-bold mb-4 text-2xl">✅ 웹사이트가 성공적으로 업데이트되었습니다! (시간: {new Date().toLocaleTimeString()})</div>
      {/* KPI Cards - HMR 테스트 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="오늘 신규회원가입"
          mainValue={`${stats.today_signups}명`}
          subtitle={`총 회원 수: ${stats.total_members.toLocaleString()}명`}
          color="orange"
        />
        <KPICard
          title="승인이 필요한 영수증"
          mainValue={`${stats.pending_receipts}건`}
          color="light-orange"
        />
        <KPICard
          title="현재 답변이 필요한 문의"
          mainValue={`${stats.pending_inquiries}건`}
          color="beige"
        />
      </div>

      {/* User Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserStatsChart data={stats.daily_stats} />
        </div>
        <div>
          <UserStatsCards
            androidSignups={androidSignups}
            androidChange={androidChange}
            todaySignups={stats.today_signups}
            iosSignups={iosSignups}
            iosChange={iosChange}
            weeklyAverage={weeklyAverage}
          />
        </div>
      </div>

      {/* Second User Statistics Section (복제) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <UserStatsChart data={stats.daily_stats} />
        </div>
        <div>
          <UserStatsCards
            androidSignups={androidSignups}
            androidChange={androidChange}
            todaySignups={stats.today_signups}
            iosSignups={iosSignups}
            iosChange={iosChange}
            weeklyAverage={weeklyAverage}
          />
        </div>
      </div>

      {/* Reward Statistics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RewardStatsChart data={stats.reward_stats} />
        <WeeklyRewardChart data={stats.weekly_reward_stats} />
      </div>
    </div>
  );
};

export default Dashboard;
