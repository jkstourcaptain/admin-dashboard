import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface WeeklyRewardStats {
  week: string;
  total_rewards: number;
}

interface WeeklyRewardChartProps {
  data: WeeklyRewardStats[];
}

const WeeklyRewardChart: React.FC<WeeklyRewardChartProps> = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        주간 리워드 통계
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [
              value.toLocaleString(),
              "통합 리워드 획득",
            ]}
          />
          <Bar dataKey="total_rewards" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WeeklyRewardChart;
