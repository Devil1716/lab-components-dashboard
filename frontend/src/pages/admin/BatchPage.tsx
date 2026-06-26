import React, { useEffect, useState } from 'react';
import { LabAPI } from '../../api/labApi';
import type { Lab } from '../../api/labApi';
import { BatchAPI } from '../../api/batchApi';
import type { LabBatch } from '../../api/batchApi';
import { Trash2, Users } from 'lucide-react';

const BatchPage: React.FC = () => {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [batches, setBatches] = useState<LabBatch[]>([]);
  
  const [newBatchName, setNewBatchName] = useState('');
  const [newBatchSize, setNewBatchSize] = useState<number>(3); // Max 3 per rules

  const loadLabs = async () => {
    try {
      const data = await LabAPI.getAll();
      setLabs(data);
      if (data.length > 0 && !selectedLab) {
        setSelectedLab(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadBatches = async () => {
    if (!selectedLab) return;
    try {
      const data = await BatchAPI.getByLab(selectedLab);
      setBatches(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadLabs(); }, []);
  useEffect(() => { loadBatches(); }, [selectedLab]);

  const handleCreateBatch = async () => {
    if (!newBatchName || !selectedLab) return;
    await BatchAPI.create({ batch_name: newBatchName, semester_id: 'SEM-1', lab_id: selectedLab, max_students: newBatchSize, status: 'active' });
    setNewBatchName('');
    loadBatches();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Labs Sidebar */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-amity-blue">Select Lab</h2>
        <div className="space-y-2">
          {labs.map(l => (
            <div 
              key={l.id} 
              onClick={() => setSelectedLab(l.id)}
              className={`p-3 border cursor-pointer transition flex items-center gap-3 ${selectedLab === l.id ? 'bg-amity-blue text-white border-amity-blue' : 'hover:bg-gray-50'}`}
            >
              <Users size={18} />
              <div className="font-medium">{l.lab_name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Batches Main Area */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-amity-blue">Batches for Selected Lab</h2>
        {selectedLab ? (
          <>
            <div className="flex gap-2 mb-6 bg-gray-50 p-4 border border-gray-200 rounded-sm">
              <input 
                type="text" placeholder="Batch Name (e.g. BATCH-A)" className="border p-2 flex-1 outline-none focus:border-amity-yellow"
                value={newBatchName} onChange={e => setNewBatchName(e.target.value)} 
              />
              <input 
                type="number" placeholder="Size (Max 3)" className="border p-2 w-24 outline-none focus:border-amity-yellow"
                value={newBatchSize} onChange={e => setNewBatchSize(parseInt(e.target.value))} 
                min={1} max={3}
              />
              <button onClick={handleCreateBatch} className="bg-amity-blue text-white px-4 rounded-sm font-medium hover:bg-blue-900">Add Batch</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {batches.map(batch => (
                <div key={batch.id} className="p-4 border-l-4 border-amity-yellow bg-white shadow-sm flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg text-amity-blue">{batch.batch_name}</span>
                    <button onClick={async () => { await BatchAPI.delete(batch.id); loadBatches(); }} className="text-red-500 hover:text-red-700">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">ID: {batch.id}</div>
                  <div className="text-sm text-gray-600">Max Size: {batch.max_students} Students</div>
                </div>
              ))}
              {batches.length === 0 && <p className="text-gray-500">No batches created for this lab.</p>}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a lab to view batches.</p>
        )}
      </div>
    </div>
  );
};

export default BatchPage;
