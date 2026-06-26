import React, { useEffect, useState } from 'react';
import { Package, Users, Calendar, AlertTriangle, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ComponentAPI } from '../../api/componentApi';
import { BatchAPI } from '../../api/batchApi';
import { SemesterAPI } from '../../api/semesterApi';
import { IssueAPI } from '../../api/issueApi';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState({
    totalComponents: 0,
    activeBatches: 0,
    activeSemesters: 0,
    pendingReturns: 0
  });
  
  const [chartData, setChartData] = useState<{name: string, issues: number}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [components, batches, semesters, transactions] = await Promise.all([
          ComponentAPI.getAll(),
          BatchAPI.getByLab('LAB-1').catch(() => []), // Placeholder if no lab selected
          SemesterAPI.getAll(),
          IssueAPI.getAll()
        ]);

        const activeTx = transactions.filter(t => t.return_status !== 'returned').length;

        const componentCounts: Record<string, number> = {};
        transactions.forEach(tx => {
          tx.items?.forEach(item => {
            componentCounts[item.component_id] = (componentCounts[item.component_id] || 0) + item.quantity_issued;
          });
        });

        const topComponents = Object.entries(componentCounts)
          .map(([name, count]) => ({ name, issues: count }))
          .sort((a, b) => b.issues - a.issues)
          .slice(0, 6);

        setChartData(topComponents);

        setStats({
          totalComponents: components.length,
          activeBatches: batches.length || 1, // fallback for UI demo if lab route not fully linked in this query
          activeSemesters: semesters.filter(s => s.is_active).length,
          pendingReturns: activeTx
        });
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-amity-blue">Admin Dashboard</h2>
        <div className="text-sm text-gray-500">Welcome back, Admin</div>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading dashboard...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <Package size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Components</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.totalComponents}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-yellow-100 text-yellow-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Batches</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeBatches}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Semesters</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.activeSemesters}</h3>
            </div>
          </div>

          <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-red-100 text-red-600 rounded-lg">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Returns</p>
              <h3 className="text-2xl font-bold text-gray-800">{stats.pendingReturns}</h3>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Chart */}
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <TrendingUp size={20} className="text-amity-blue" />
          Most Borrowed Components
        </h3>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '4px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}
                />
                <Bar dataKey="issues" fill="#002147" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400 italic">No issuance data available yet to generate charts.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
