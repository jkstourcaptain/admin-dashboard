import React from "react";
import {
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface DailyStats {
  date: string;
  android_users: number;
  ios_users: number;
  total_users: number;
}

interface UserStatsChartProps {
  data: DailyStats[];
}

const UserStatsChart: React.FC<UserStatsChartProps> = ({ data }) => {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-green-600 mb-4">✅ 실시간 업데이트 성공! 막대그래프 제거됨</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={[]}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" strokeOpacity={0.2} horizontal={true} vertical={false} />
          <XAxis dataKey="date" type="category" domain={['07/02', '07/03', '07/04', '07/05', '07/06', '07/07', '07/08']} />
          <YAxis axisLine={false} tickLine={false} domain={[0, 2000]} ticks={[0, 500, 1000, 1500, 2000]} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStatsChart;
