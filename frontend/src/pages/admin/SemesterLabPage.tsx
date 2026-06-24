import React, { useEffect, useState } from 'react';
import { SemesterAPI } from '../../api/semesterApi';
import type { Semester } from '../../api/semesterApi';
import { LabAPI } from '../../api/labApi';
import type { Lab } from '../../api/labApi';
import { Plus, Trash2 } from 'lucide-react';

const SemesterLabPage: React.FC = () => {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);
  const [labs, setLabs] = useState<Lab[]>([]);
  
  const [newSemesterName, setNewSemesterName] = useState('');
  const [newLabName, setNewLabName] = useState('');

  const loadSemesters = async () => {
    try {
      const data = await SemesterAPI.getAll();
      setSemesters(data);
      if (data.length > 0 && !selectedSemester) {
        setSelectedSemester(data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const loadLabs = async () => {
    if (!selectedSemester) return;
    try {
      const data = await LabAPI.getBySemester(selectedSemester);
      setLabs(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { loadSemesters(); }, []);
  useEffect(() => { loadLabs(); }, [selectedSemester]);

  const handleCreateSemester = async () => {
    if (!newSemesterName) return;
    await SemesterAPI.create({ name: newSemesterName, academic_year: '2026-2027', start_date: '2026-08-01', end_date: '2026-12-15', is_active: true });
    setNewSemesterName('');
    loadSemesters();
  };

  const handleCreateLab = async () => {
    if (!newLabName || !selectedSemester) return;
    await LabAPI.create({ lab_name: newLabName, semester_id: selectedSemester });
    setNewLabName('');
    loadLabs();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Semesters List */}
      <div className="w-full lg:w-1/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-amity-blue">Semesters</h2>
        <div className="flex gap-2 mb-4">
          <input 
            type="text" placeholder="Semester Name" className="border p-2 flex-1 outline-none focus:border-amity-yellow"
            value={newSemesterName} onChange={e => setNewSemesterName(e.target.value)} 
          />
          <button onClick={handleCreateSemester} className="bg-amity-yellow text-amity-blue px-3 rounded-sm font-medium hover:bg-yellow-500"><Plus size={20}/></button>
        </div>
        <div className="space-y-2">
          {semesters.map(s => (
            <div 
              key={s.id} 
              onClick={() => setSelectedSemester(s.id)}
              className={`p-3 border cursor-pointer transition ${selectedSemester === s.id ? 'bg-amity-blue text-white border-amity-blue' : 'hover:bg-gray-50'}`}
            >
              <div className="font-medium">{s.name}</div>
              <div className={`text-xs ${selectedSemester === s.id ? 'text-blue-200' : 'text-gray-500'}`}>{s.academic_year}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Labs List */}
      <div className="w-full lg:w-2/3 bg-white p-6 rounded-sm shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4 text-amity-blue">Labs for Semester</h2>
        {selectedSemester ? (
          <>
            <div className="flex gap-2 mb-4">
              <input 
                type="text" placeholder="New Lab Name" className="border p-2 flex-1 outline-none focus:border-amity-yellow"
                value={newLabName} onChange={e => setNewLabName(e.target.value)} 
              />
              <button onClick={handleCreateLab} className="bg-amity-blue text-white px-4 rounded-sm font-medium hover:bg-blue-900">Add Lab</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {labs.map(lab => (
                <div key={lab.id} className="p-4 border border-gray-200 rounded-sm shadow-sm flex justify-between items-center bg-gray-50">
                  <span className="font-medium">{lab.lab_name}</span>
                  <button onClick={async () => { await LabAPI.delete(lab.id); loadLabs(); }} className="text-red-500 hover:text-red-700">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a semester to view labs.</p>
        )}
      </div>
    </div>
  );
};

export default SemesterLabPage;
