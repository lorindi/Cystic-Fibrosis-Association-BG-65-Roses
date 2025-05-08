import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';
import { MonthlyDonation } from '@/graphql/types';

interface DonationsChartProps {
  monthlyDonations: MonthlyDonation[];
  months?: number;
}

export function DonationsChart({ monthlyDonations, months = 6 }: DonationsChartProps) {
  const recentDonations = monthlyDonations.slice(-months);
  
  return (
    <ChartCard
      title="Donations Overview"
      description="Monthly donation amounts"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={recentDonations}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(value: number) => [`$${value}`, 'Amount']} />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" name="Donations" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 