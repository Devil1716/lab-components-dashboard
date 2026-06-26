import React, { useEffect, useState } from 'react';
import { Download, FileText, FileDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import { IssueAPI } from '../../api/issueApi';
import type { IssueTransaction } from '../../api/issueApi';

const ReportsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<IssueTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const txs = await IssueAPI.getAll();
      setTransactions(txs);
    } catch (e) {
      console.error(e);
      alert('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    if (transactions.length === 0) {
      alert('No data to export');
      return;
    }

    // Flatten data for Excel
    const data: any[] = [];
    transactions.forEach(tx => {
      if (tx.items && tx.items.length > 0) {
        tx.items.forEach((item: any) => {
          data.push({
            'Transaction ID': tx.id,
            'Batch ID': tx.batch_id,
            'Issued At': new Date(tx.issued_at!).toLocaleString(),
            'Issued By': tx.issued_by,
            'Transaction Status': tx.return_status,
            'Component ID': item.component_id,
            'Quantity Issued': item.quantity_issued,
            'Quantity Returned': item.quantity_returned,
            'Quantity Damaged': item.quantity_damaged,
            'Quantity Missing': item.quantity_missing,
            'Item Status': item.item_status
          });
        });
      } else {
        data.push({
          'Transaction ID': tx.id,
          'Batch ID': tx.batch_id,
          'Issued At': new Date(tx.issued_at!).toLocaleString(),
          'Issued By': tx.issued_by,
          'Transaction Status': tx.return_status,
          'Component ID': 'N/A',
          'Quantity Issued': 0,
          'Quantity Returned': 0,
          'Quantity Damaged': 0,
          'Quantity Missing': 0,
          'Item Status': 'N/A'
        });
      }
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Issuance Logs");
    XLSX.writeFile(workbook, `Lab_Issuance_Report_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-amity-blue flex items-center gap-2">
            <FileText size={24} /> Reports & Logs
          </h2>
          <p className="text-sm text-gray-500 mt-1">View and export all component issuance and return logs.</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => window.open('http://localhost:5000/api/reports/pdf', '_blank')}
            className="bg-red-600 text-white px-4 py-2 rounded-sm shadow-sm hover:bg-red-700 transition flex items-center gap-2 font-medium"
          >
            <FileDown size={18} /> Download PDF
          </button>
          <button 
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-sm shadow-sm hover:bg-green-700 transition flex items-center gap-2 font-medium"
          >
            <Download size={18} /> Export to Excel
          </button>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading data...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="p-3 text-sm font-semibold text-gray-600">Tx ID</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Batch</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Date Issued</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Items Count</th>
                  <th className="p-3 text-sm font-semibold text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b last:border-b-0 hover:bg-gray-50 transition">
                    <td className="p-3 text-sm font-medium">{tx.id}</td>
                    <td className="p-3 text-sm">{tx.batch_id}</td>
                    <td className="p-3 text-sm">{new Date(tx.issued_at!).toLocaleString()}</td>
                    <td className="p-3 text-sm">{tx.items?.length || 0}</td>
                    <td className="p-3 text-sm">
                      {tx.return_status === 'returned' ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">Returned</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-semibold">Active</span>
                      )}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500 italic">No transactions found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
