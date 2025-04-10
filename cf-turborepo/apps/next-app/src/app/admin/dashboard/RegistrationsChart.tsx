import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartCard } from './ChartCard';

interface RegistrationData {
  month: string;
  count: number;
}

interface RegistrationsChartProps {
  registrationsData: RegistrationData[];
}

export function RegistrationsChart({ registrationsData }: RegistrationsChartProps) {
  return (
    <ChartCard
      title="User Registrations"
      description="New user sign-ups over time"
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={registrationsData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Area 
            type="monotone" 
            dataKey="count" 
            name="New Registrations"
            stroke="#8884d8" 
            fill="#8884d8" 
            fillOpacity={0.3} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 