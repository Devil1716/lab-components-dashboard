import React, { useState, useEffect } from 'react';
import { Package, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { BatchAPI } from '../../api/batchApi';
import type { LabBatch } from '../../api/batchApi';
import { ComponentAPI } from '../../api/componentApi';
import type { Component } from '../../api/componentApi';
import { IssueAPI } from '../../api/issueApi';

const FrontDeskPortal: React.FC = () => {
  const [batchId, setBatchId] = useState('');
  const [transactions, setTransactions] = useState<any[]>([]);
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchDetails, setBatchDetails] = useState<LabBatch | null>(null);

  // Issuance State
  const [showIssueForm, setShowIssueForm] = useState(false);
  const [selectedItems, setSelectedItems] = useState<{ component_id: string; quantity: number }[]>([]);

  // Return State
  const [returnItems, setReturnItems] = useState<Record<string, { returned: number, damaged: number, missing: number }>>({});

  useEffect(() => {
    ComponentAPI.getAll().then(setComponents);
  }, []);

  const loadBatchInfo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!batchId) return;
    try {
      setLoading(true);
      // Let's assume we can fetch batch details later if needed, right now we just fetch transactions
      const res = await IssueAPI.getByBatch(batchId);
      setTransactions(res);
      // Reset forms
      setShowIssueForm(false);
      setSelectedItems([]);
      setReturnItems({});
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      alert('Failed to fetch batch issues.');
    } finally {
      setLoading(false);
    }
  };

  // Issuance Handlers
  const handleAddItem = (compId: string) => {
    if (!compId || selectedItems.find(i => i.component_id === compId)) return;
    setSelectedItems([...selectedItems, { component_id: compId, quantity: 1 }]);
  };

  const handleIssueSubmit = async () => {
    if (!batchId || selectedItems.length === 0) return;
    try {
      const tx = await IssueAPI.create({
        transaction: {
          semester_id: 'SEM-1', // Assuming for now, ideally fetch from batch
          lab_id: 'LAB-1',      // Assuming for now
          session_id: 'SESS-' + Date.now(),
          batch_id: batchId,
          issued_by: 'Admin Desk',
          issue_status: 'acknowledged', // Immediately acknowledge since admin is issuing it at the desk
          return_status: 'pending'
        },
        items: selectedItems.map(i => ({
          component_id: i.component_id,
          quantity_issued: i.quantity,
          quantity_returned: 0,
          quantity_damaged: 0,
          quantity_missing: 0,
          item_status: 'issued'
        }))
      });
      alert('Components Issued Successfully at Front Desk!');
      loadBatchInfo();
    } catch (e) {
      console.error(e);
      alert('Failed to issue components.');
    }
  };

  // Return Handlers
  const handleReturnChange = (itemId: string, field: 'returned' | 'damaged' | 'missing', val: number) => {
    setReturnItems(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: val
      }
    }));
  };

  const handleProcessReturn = async (txId: string, items: any[]) => {
    // Collect data
    const payload = items.map(item => {
      const r = returnItems[item.id] || { returned: item.quantity_issued, damaged: 0, missing: 0 };
      return { item_id: item.id, returned: r.returned, damaged: r.damaged, missing: r.missing };
    });

    try {
      await IssueAPI.processReturn(txId, payload);
      alert('Return processed successfully! Fines calculated if applicable.');
      loadBatchInfo();
    } catch (e) {
      console.error(e);
      alert('Failed to process return.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-amity-blue mb-4 flex items-center gap-2">
          <RefreshCw size={24} /> Lab Operations Desk
        </h2>
        <form onSubmit={loadBatchInfo} className="flex space-x-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Batch ID</label>
            <input 
              type="text" 
              required 
              className="w-full border border-gray-300 p-2 rounded-sm focus:outline-none focus:border-amity-yellow" 
              value={batchId}
              onChange={(e) => setBatchId(e.target.value)}
              placeholder="Enter Batch ID (e.g., BATCH-001)"
            />
          </div>
          <button type="submit" className="bg-amity-blue text-white px-6 py-2 rounded-sm hover:bg-blue-900 transition font-medium" disabled={loading}>
            {loading ? 'Searching...' : 'Search Batch'}
          </button>
        </form>
      </div>

      {transactions.length > 0 && !showIssueForm && (
        <div className="flex justify-end">
          <button onClick={() => setShowIssueForm(true)} className="bg-amity-yellow text-amity-blue px-4 py-2 rounded-sm font-semibold shadow-sm hover:bg-yellow-500 transition">
            + Issue New Components
          </button>
        </div>
      )}

      {/* Quick Issue View */}
      {showIssueForm && (
         <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 border-t-4 border-t-amity-yellow">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-semibold text-lg text-gray-800">Issue Components to {batchId}</h3>
             <button onClick={() => setShowIssueForm(false)} className="text-gray-500 hover:text-gray-700">Cancel</button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-2 border p-4 rounded-sm max-h-60 overflow-y-auto">
               <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Inventory</h4>
               {components.filter(c => c.available_quantity > 0).map(comp => (
                 <div key={comp.id} className="flex justify-between items-center bg-gray-50 p-2 border border-gray-100">
                   <div>
                     <div className="font-medium">{comp.component_name}</div>
                     <div className="text-xs text-gray-500">Avail: {comp.available_quantity}</div>
                   </div>
                   <button onClick={() => handleAddItem(comp.id!)} className="bg-amity-blue text-white text-xs px-2 py-1 rounded">Add</button>
                 </div>
               ))}
             </div>
             
             <div className="space-y-2 border p-4 rounded-sm bg-gray-50">
                <h4 className="font-medium text-sm text-gray-500 uppercase tracking-wide">Selected</h4>
                {selectedItems.map((item, idx) => {
                  const comp = components.find(c => c.id === item.component_id);
                  return (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white border">
                      <span className="font-medium text-sm">{comp?.component_name}</span>
                      <input 
                        type="number" min={1} max={comp?.available_quantity || 1} 
                        className="border p-1 w-16 text-center"
                        value={item.quantity}
                        onChange={e => {
                          const n = parseInt(e.target.value);
                          setSelectedItems(selectedItems.map((v, i) => i === idx ? { ...v, quantity: n } : v));
                        }}
                      />
                    </div>
                  );
                })}
                {selectedItems.length > 0 && (
                  <button onClick={handleIssueSubmit} className="w-full mt-4 bg-amity-blue text-white font-medium py-2 rounded-sm shadow hover:bg-blue-900">
                    Confirm Issuance
                  </button>
                )}
             </div>
           </div>
         </div>
      )}

      {/* Active Transactions (Returns) */}
      {!showIssueForm && transactions.map(tx => (
        <div key={tx.id} className={`bg-white p-6 shadow-sm border border-gray-200 rounded-sm ${tx.return_status === 'returned' ? 'opacity-70' : 'border-l-4 border-l-amity-blue'}`}>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-lg">Transaction ID: {tx.id}</h3>
              <p className="text-sm text-gray-500">Issued: {new Date(tx.issued_at).toLocaleString()}</p>
            </div>
            {tx.return_status === 'returned' ? (
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <CheckCircle size={16} /> Completed
              </span>
            ) : (
              <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                <AlertCircle size={16} /> Active
              </span>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-600">
                  <th className="p-3 border-b">Component</th>
                  <th className="p-3 border-b text-center">Issued</th>
                  {tx.return_status !== 'returned' && (
                    <>
                      <th className="p-3 border-b text-center">Proper</th>
                      <th className="p-3 border-b text-center">Damaged</th>
                      <th className="p-3 border-b text-center">Missing</th>
                    </>
                  )}
                  {tx.return_status === 'returned' && (
                    <th className="p-3 border-b text-right">Status</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {tx.items?.map((item: any) => {
                  const comp = components.find(c => c.id === item.component_id);
                  // Default fill return forms
                  if (tx.return_status !== 'returned' && !returnItems[item.id]) {
                    setReturnItems(prev => ({ ...prev, [item.id]: { returned: item.quantity_issued, damaged: 0, missing: 0 } }));
                  }
                  const r = returnItems[item.id] || { returned: item.quantity_issued, damaged: 0, missing: 0 };

                  return (
                    <tr key={item.id} className="border-b last:border-0 hover:bg-gray-50 transition">
                      <td className="p-3 font-medium">{comp?.component_name || item.component_id}</td>
                      <td className="p-3 text-center">{item.quantity_issued}</td>
                      
                      {tx.return_status !== 'returned' ? (
                        <>
                          <td className="p-3">
                            <input type="number" min={0} max={item.quantity_issued} value={r.returned} onChange={e => handleReturnChange(item.id, 'returned', parseInt(e.target.value))} className="w-16 border p-1 text-center mx-auto block outline-none focus:border-amity-yellow" />
                          </td>
                          <td className="p-3">
                            <input type="number" min={0} max={item.quantity_issued} value={r.damaged} onChange={e => handleReturnChange(item.id, 'damaged', parseInt(e.target.value))} className="w-16 border p-1 text-center mx-auto block outline-none focus:border-red-500" />
                          </td>
                          <td className="p-3">
                            <input type="number" min={0} max={item.quantity_issued} value={r.missing} onChange={e => handleReturnChange(item.id, 'missing', parseInt(e.target.value))} className="w-16 border p-1 text-center mx-auto block outline-none focus:border-red-500" />
                          </td>
                        </>
                      ) : (
                        <td className="p-3 text-right text-sm">
                          {item.item_status === 'returned_properly' ? (
                            <span className="text-green-600">Proper</span>
                          ) : (
                            <span className="text-red-600">Damaged/Missing</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {tx.return_status !== 'returned' && (
            <div className="mt-4 flex justify-end">
              <button onClick={() => handleProcessReturn(tx.id, tx.items)} className="bg-amity-blue text-white px-6 py-2 rounded-sm font-medium hover:bg-blue-900 transition shadow-sm">
                Process Return
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FrontDeskPortal;
