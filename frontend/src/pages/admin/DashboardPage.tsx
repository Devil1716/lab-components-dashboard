import React, { useEffect, useState } from 'react';
import { Package, Users, Calendar, AlertTriangle } from 'lucide-react';
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

      {/* Placeholder for future charts/graphs */}
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 h-64 flex items-center justify-center">
        <p className="text-gray-400 italic">Component Issuance Analytics Chart (Coming Soon)</p>
      </div>
    </div>
  );
};

export default DashboardPage;
