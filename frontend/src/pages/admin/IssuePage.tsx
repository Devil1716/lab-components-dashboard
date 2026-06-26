import React, { useEffect, useState } from 'react';
import { SemesterAPI } from '../../api/semesterApi';
import type { Semester } from '../../api/semesterApi';
import { LabAPI } from '../../api/labApi';
import type { Lab } from '../../api/labApi';
import { BatchAPI } from '../../api/batchApi';
import type { LabBatch } from '../../api/batchApi';
import { ComponentAPI } from '../../api/componentApi';
import type { Component } from '../../api/componentApi';
import { IssueAPI } from '../../api/issueApi';
import { Plus, Trash2 } from 'lucide-react';

const IssuePage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [batches, setBatches] = useState<LabBatch[]>([]);
  const [components, setComponents] = useState<Component[]>([]);

  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedLab, setSelectedLab] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');

  const [selectedItems, setSelectedItems] = useState<{ component_id: string; quantity: number }[]>([]);

  useEffect(() => {
    SemesterAPI.getAll().then(setSemesters);
    ComponentAPI.getAll().then(setComponents);
  }, []);

  useEffect(() => {
    if (selectedSemester) LabAPI.getBySemester(selectedSemester).then(setLabs);
    else setLabs([]);
  }, [selectedSemester]);

  useEffect(() => {
    if (selectedLab) BatchAPI.getByLab(selectedLab).then(setBatches);
    else setBatches([]);
  }, [selectedLab]);

  const handleAddItem = (compId: string) => {
    if (!compId || selectedItems.find(i => i.component_id === compId)) return;
    setSelectedItems([...selectedItems, { component_id: compId, quantity: 1 }]);
  };

  const handleQuantityChange = (compId: string, qty: number) => {
    setSelectedItems(selectedItems.map(i => i.component_id === compId ? { ...i, quantity: qty } : i));
  };

  const handleRemoveItem = (compId: string) => {
    setSelectedItems(selectedItems.filter(i => i.component_id !== compId));
  };

  const handleSubmit = async () => {
    if (!selectedSemester || !selectedLab || !selectedBatch || selectedItems.length === 0) return;

    try {
      await IssueAPI.create({
        transaction: {
          semester_id: selectedSemester,
          lab_id: selectedLab,
          session_id: 'SESS-' + Date.now(), // Temporary dynamic session ID
          batch_id: selectedBatch,
          issued_by: 'Admin User',
          issue_status: 'pending_acknowledgment',
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
      alert('Components Issued Successfully! Students can now acknowledge receipt.');
      setSelectedItems([]);
      setSelectedBatch('');
    } catch (e) {
      console.error(e);
      alert('Failed to issue components.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-amity-blue">Issue Components to Batch</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <select className="border p-2 outline-none focus:border-amity-yellow" value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
            <option value="">-- Select Semester --</option>
            {semesters.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select className="border p-2 outline-none focus:border-amity-yellow" value={selectedLab} onChange={e => setSelectedLab(e.target.value)} disabled={!selectedSemester}>
            <option value="">-- Select Lab --</option>
            {labs.map(l => <option key={l.id} value={l.id}>{l.lab_name}</option>)}
          </select>
          <select className="border p-2 outline-none focus:border-amity-yellow" value={selectedBatch} onChange={e => setSelectedBatch(e.target.value)} disabled={!selectedLab}>
            <option value="">-- Select Batch --</option>
            {batches.map(b => <option key={b.id} value={b.id}>{b.batch_name}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Component Selection Area */}
        <div className="w-full lg:w-1/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4">Inventory</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {components.map(comp => (
              <div key={comp.id} className="p-3 border flex justify-between items-center bg-gray-50 hover:bg-gray-100">
                <div>
                  <div className="font-medium">{comp.component_name}</div>
                  <div className="text-xs text-gray-500">Available: {comp.available_quantity}</div>
                </div>
                <button 
                  onClick={() => handleAddItem(comp.id!)}
                  disabled={comp.available_quantity === 0}
                  className="bg-amity-blue text-white p-1 rounded-sm disabled:bg-gray-300"
                >
                  <Plus size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Items Area */}
        <div className="w-full lg:w-2/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4">Selected Items</h3>
          {selectedItems.length === 0 ? (
            <p className="text-gray-500 italic">No components selected.</p>
          ) : (
            <div className="space-y-3">
              {selectedItems.map(item => {
                const comp = components.find(c => c.id === item.component_id);
                return (
                  <div key={item.component_id} className="p-3 border-l-4 border-amity-yellow bg-gray-50 flex items-center justify-between">
                    <span className="font-medium w-1/2">{comp?.component_name}</span>
                    <div className="flex items-center gap-4">
                      <input 
                        type="number" min={1} max={comp?.available_quantity || 1} 
                        className="border p-1 w-20 text-center outline-none focus:border-amity-yellow"
                        value={item.quantity}
                        onChange={e => handleQuantityChange(item.component_id, parseInt(e.target.value))}
                      />
                      <button onClick={() => handleRemoveItem(item.component_id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="mt-6 border-t pt-4 flex justify-end">
                <button 
                  onClick={handleSubmit}
                  disabled={!selectedBatch}
                  className="bg-amity-yellow text-amity-blue font-bold px-6 py-2 rounded-sm shadow-sm disabled:opacity-50"
                >
                  Confirm Issuance
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssuePage;
