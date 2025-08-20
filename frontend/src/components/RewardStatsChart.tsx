import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface RewardStats {
  date: string;
  actual_visits: number;
  mission_completion: number;
}

interface RewardStatsChartProps {
  data: RewardStats[];
}

const RewardStatsChart: React.FC<RewardStatsChartProps> = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">리워드 통계</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number, name: string) => [
              value.toLocaleString(),
              name === "actual_visits" ? "실제 방문" : "미션 수행",
            ]}
          />
          <Legend
            formatter={(value) =>
              value === "actual_visits" ? "실제 방문" : "미션 수행"
            }
          />
          <Line
            type="monotone"
            dataKey="actual_visits"
            stroke="#f97316"
            strokeWidth={2}
            dot={{ fill: "#f97316", strokeWidth: 2, r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="mission_completion"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={{ fill: "#fbbf24", strokeWidth: 2, r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RewardStatsChart;
