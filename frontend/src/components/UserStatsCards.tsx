import React from "react";
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from "@heroicons/react/24/solid";

interface UserStatsCardsProps {
  androidSignups: number;
  androidChange: number;
  todaySignups: number;
  iosSignups: number;
  iosChange: number;
  weeklyAverage: number;
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({
  androidSignups,
  androidChange,
  todaySignups,
  iosSignups,
  iosChange,
  weeklyAverage,
}) => {
  const StatCard: React.FC<{
    title: string;
    value: number;
    change?: number;
    changeLabel?: string;
  }> = ({ title, value, change, changeLabel }) => (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-600 mb-2">{title}</h4>
      <div className="text-2xl font-bold text-gray-900 mb-2">
        {value.toLocaleString()}
      </div>
      {change !== undefined && (
        <div
          className={`flex items-center text-sm ${
            change >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {change >= 0 ? (
            <ArrowTrendingUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowTrendingDownIcon className="w-4 h-4 mr-1" />
          )}
          {change >= 0 ? "+" : ""}
          {change} {changeLabel}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <StatCard
        title="실시간 Android 가입"
        value={androidSignups}
        change={androidChange}
        changeLabel="지난주 평균 대비"
      />
      <StatCard title="오늘 가입" value={todaySignups} />
      <StatCard
        title="실시간 iOS 가입"
        value={iosSignups}
        change={iosChange}
        changeLabel="지난주 평균 대비"
      />
      <StatCard title="지난주 평균 가입" value={weeklyAverage} />
    </div>
  );
};

export default UserStatsCards;
