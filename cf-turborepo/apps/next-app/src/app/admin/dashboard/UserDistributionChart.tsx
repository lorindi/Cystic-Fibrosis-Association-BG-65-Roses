import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';
import { RoleData } from '@/graphql/types';

interface UserDistributionChartProps {
  usersByRole: RoleData[];
  colors: string[];
}

export function UserDistributionChart({ usersByRole, colors }: UserDistributionChartProps) {
  return (
    <ChartCard
      title="User Distribution"
      description="Breakdown of users by role"
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={usersByRole}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label={({ name, percent }: { name: string, percent: number }) => 
              `${name}: ${(percent * 100).toFixed(0)}%`
            }
          >
            {usersByRole.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => [`${value} users`, 'Count']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 