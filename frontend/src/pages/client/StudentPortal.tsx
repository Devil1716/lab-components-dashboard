import React, { useState } from 'react';
import { Package, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import api from '../../api/index';

const StudentPortal: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentId, setStudentId] = useState('');

  const fetchTransactions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchId) return;
    try {
      setLoading(true);
      const res = await api.get(`/issues/batch/${batchId}`);
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      alert('Failed to fetch batch issues.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (transactionId: string) => {
    if (!studentId) {
      alert('Please enter your Student ID to acknowledge receipt.');
      return;
    }
    try {
      await api.post('/issues/acknowledge', { transactionId, studentId });
      alert('Issue acknowledged successfully!');
      // Refresh
      const res = await api.get(`/issues/batch/${batchId}`);
      setTransactions(res.data);
    } catch (error) {
      console.error('Failed to acknowledge', error);
      alert('Failed to acknowledge receipt.');
    }
  };

  return (
    <div className="min-h-screen bg-amity-gray font-sans p-6">
      <header className="bg-amity-blue text-white shadow-md p-4 flex justify-between items-center rounded-sm mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-amity-yellow rounded-sm flex items-center justify-center font-bold text-amity-blue">
            LU
          </div>
          <h1 className="text-xl font-semibold tracking-wide">Student Portal</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm">
          <h2 className="text-xl font-semibold text-amity-blue mb-4">Find Your Batch Issues</h2>
          <form onSubmit={fetchTransactions} className="flex space-x-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
              <input 
                type="text" 
                required 
                className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-amity-blue" 
                value={batchId}
                onChange={(e) => setBatchId(e.target.value)}
                placeholder="Enter your Batch ID (e.g., BATCH-001)"
              />
            </div>
            <button type="submit" className="bg-amity-blue text-white px-6 py-2 rounded-sm hover:bg-blue-900 transition font-medium" disabled={loading}>
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {transactions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Assigned Components</h3>
            {transactions.map(tx => (
              <div key={tx.id} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                <div className="space-y-2 mb-4 md:mb-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-gray-800">Transaction ID:</span>
                    <span className="text-gray-600 text-sm font-mono">{tx.id}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <strong>Date:</strong> {new Date(tx.issued_at).toLocaleString()}
                  </div>
                  <div className="mt-2">
                    <h4 className="font-medium text-amity-blue flex items-center space-x-1">
                      <Package size={16} /> <span>Items:</span>
                    </h4>
                    <ul className="list-disc list-inside text-sm text-gray-700 ml-1 mt-1">
                      {tx.items?.map((item: any) => (
                        <li key={item.id}>Component ID {item.component_id} - Qty: {item.quantity_issued}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-col items-end space-y-3 bg-gray-50 p-4 rounded-sm border border-gray-100 min-w-[250px]">
                  {tx.issue_status === 'pending_acknowledgment' ? (
                    <>
                      <div className="flex items-center space-x-2 text-orange-600 text-sm font-medium">
                        <Clock size={16} />
                        <span>Pending Acknowledgment</span>
                      </div>
                      <input 
                        type="text" 
                        placeholder="Your Student ID" 
                        className="border border-gray-300 p-2 rounded-sm text-sm w-full"
                        value={studentId}
                        onChange={e => setStudentId(e.target.value)}
                      />
                      <button 
                        onClick={() => handleAcknowledge(tx.id)}
                        className="bg-amity-yellow text-amity-blue px-4 py-2 rounded-sm text-sm font-semibold hover:bg-yellow-500 transition w-full"
                      >
                        Acknowledge Receipt
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-2 text-green-600 font-medium">
                        <CheckCircle size={18} />
                        <span>Acknowledged</span>
                      </div>
                      <span className="text-xs text-gray-500">By: {tx.acknowledged_by}</span>
                    </div>
                  )}

                  {tx.return_status !== 'returned' && tx.issue_status === 'acknowledged' && (
                    <div className="flex items-center space-x-1 text-xs font-medium text-blue-600 mt-2 bg-blue-50 px-2 py-1 rounded">
                      <AlertCircle size={12} />
                      <span>Return Pending</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
