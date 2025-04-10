import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';

interface CampaignData {
  id: string;
  name: string;
  donors: number;
  progress: number;
  currentAmount: number;
  goal: number;
}

interface CampaignPerformanceChartProps {
  campaigns: CampaignData[];
}

export function CampaignPerformanceChart({ campaigns }: CampaignPerformanceChartProps) {
  return (
    <ChartCard
      title="Campaign Performance"
      description="Progress towards fundraising goals"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart 
          layout="vertical" 
          data={campaigns}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[0, 100]} />
          <YAxis dataKey="name" type="category" width={100} />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Progress']}
            labelFormatter={(name) => `Campaign: ${name}`}
          />
          <Legend />
          <Bar 
            dataKey="progress" 
            fill="#82ca9d" 
            name="Progress (%)" 
            label={{ position: 'right', formatter: (value: number) => `${value}%` }}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 