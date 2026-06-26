import React, { useState } from 'react';
import { apiClient } from '../api';
import { Search, Package } from 'lucide-react';

const StudentPortal: React.FC = () => {
  const [studentId, setStudentId] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId) return;
    setLoading(true);
    setError('');
    setData(null);
    try {
      const res = await apiClient.get(`/students/${studentId}`);
      setData(res.data);
    } catch (err) {
      setError('Could not find records for this ID.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-3xl border-t-4 border-t-amity-yellow">
        <h1 className="text-3xl font-bold text-amity-blue mb-2 text-center">Student Portal</h1>
        <p className="text-gray-500 text-center mb-8">View your issued components and active fines.</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Enter Batch ID or Student ID (e.g., BATCH-001)"
            value={studentId}
            onChange={e => setStudentId(e.target.value)}
            className="flex-1 border border-gray-300 p-3 rounded-md focus:outline-none focus:border-amity-yellow"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-amity-blue text-white px-6 py-3 rounded-md font-medium hover:bg-blue-900 transition flex items-center gap-2"
          >
            <Search size={20} /> {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {data && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Results for: {data.batchId}</h2>
            
            {data.transactions.length === 0 ? (
              <div className="text-center p-8 bg-gray-50 rounded border border-dashed border-gray-300 text-gray-500">
                <Package className="mx-auto mb-2 text-gray-400" size={32} />
                No active records found for this ID.
              </div>
            ) : (
              <div className="space-y-4">
                {data.transactions.map((tx: any) => (
                  <div key={tx.id} className="border border-gray-200 rounded p-4 bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-medium text-gray-800">Transaction #{tx.id.substring(0, 8)}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${tx.return_status === 'returned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {tx.return_status.toUpperCase()}
                      </span>
                    </div>
                    <ul className="space-y-2">
                      {tx.items?.map((item: any) => (
                        <li key={item.id} className="flex justify-between bg-white p-2 border rounded text-sm">
                          <span>Component: {item.component_id}</span>
                          <span className="font-semibold">Qty: {item.quantity_issued}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
