export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard 
          title="Users" 
          count={254} 
          icon="👤" 
          color="bg-blue-500" 
        />
        <DashboardCard 
          title="Content" 
          count={124} 
          icon="📄" 
          color="bg-green-500" 
        />
        <DashboardCard 
          title="Events" 
          count={12} 
          icon="🗓️" 
          color="bg-purple-500" 
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow p-4">
          <p>No recent activity to show.</p>
        </div>
      </div>
    </div>
  );
}

// Dashboard card component
function DashboardCard({ 
  title, 
  count, 
  icon, 
  color 
}: { 
  title: string; 
  count: number; 
  icon: string; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <div className={`${color} text-white p-3 rounded-full mr-4`}>
          <span className="text-xl">{icon}</span>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <p className="text-3xl font-bold">{count}</p>
    </div>
  );
} 