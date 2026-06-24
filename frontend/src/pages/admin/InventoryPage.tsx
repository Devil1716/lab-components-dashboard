import React, { useEffect, useState } from 'react';
import { ComponentAPI } from '../../api/componentApi';
import type { Component } from '../../api/componentApi';
import { Plus, Edit2, Trash2, Search, AlertCircle } from 'lucide-react';

const InventoryPage: React.FC = () => {
  const [components, setComponents] = useState<Component[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Component>>({
    component_name: '',
    category: '',
    description: '',
    unit_price: 0,
    total_quantity: 0,
    available_quantity: 0,
    damaged_quantity: 0,
    under_review_quantity: 0,
    status: 'active'
  });

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const data = await ComponentAPI.getAll();
      setComponents(data);
    } catch (error) {
      console.error('Failed to fetch components', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComponents();
  }, []);

  const handleOpenModal = (component?: Component) => {
    if (component) {
      setFormData(component);
      setEditingId(component.id || null);
    } else {
      setFormData({
        component_name: '',
        category: '',
        description: '',
        unit_price: 0,
        total_quantity: 0,
        available_quantity: 0,
        damaged_quantity: 0,
        under_review_quantity: 0,
        status: 'active'
      });
      setEditingId(null);
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await ComponentAPI.update(editingId, formData);
      } else {
        await ComponentAPI.create(formData as any);
      }
      setIsModalOpen(false);
      fetchComponents();
    } catch (error) {
      console.error('Failed to save component', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this component?')) {
      try {
        await ComponentAPI.delete(id);
        fetchComponents();
      } catch (error) {
        console.error('Failed to delete component', error);
      }
    }
  };

  const filteredComponents = components.filter(c => 
    c.component_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold text-amity-blue">Inventory Management</h2>
          <p className="text-sm text-gray-500">Manage all lab components and their stock levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-amity-blue text-white px-4 py-2 flex items-center space-x-2 hover:bg-blue-900 transition rounded-sm"
        >
          <Plus size={18} />
          <span>Add Component</span>
        </button>
      </div>

      <div className="bg-white p-4 shadow-sm border border-gray-200 flex justify-between items-center">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Search components..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm focus:outline-none focus:border-amity-blue"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      <div className="bg-white shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Component Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Price (₹)</th>
              <th className="p-4 font-medium">Total</th>
              <th className="p-4 font-medium">Available</th>
              <th className="p-4 font-medium text-red-600">Damaged</th>
              <th className="p-4 font-medium text-orange-500">Review</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center p-4">Loading...</td></tr>
            ) : filteredComponents.length === 0 ? (
              <tr><td colSpan={9} className="text-center p-4 text-gray-500">No components found.</td></tr>
            ) : (
              filteredComponents.map(comp => (
                <tr key={comp.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="p-4 font-medium text-amity-blue">{comp.component_name}</td>
                  <td className="p-4 text-sm text-gray-600">{comp.category || '-'}</td>
                  <td className="p-4 text-sm">₹{comp.unit_price}</td>
                  <td className="p-4 text-sm font-semibold">{comp.total_quantity}</td>
                  <td className="p-4 text-sm font-semibold text-green-600">{comp.available_quantity}</td>
                  <td className="p-4 text-sm font-semibold text-red-600">{comp.damaged_quantity}</td>
                  <td className="p-4 text-sm font-semibold text-orange-500">{comp.under_review_quantity}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-sm ${comp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                      {comp.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex space-x-2">
                    <button onClick={() => handleOpenModal(comp)} className="text-amity-blue hover:text-blue-900 p-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(comp.id!)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-sm w-full max-w-lg shadow-xl">
            <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Component' : 'Add Component'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Component Name *</label>
                <input required type="text" className="w-full border border-gray-300 p-2 rounded-sm" value={formData.component_name} onChange={e => setFormData({...formData, component_name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input type="text" className="w-full border border-gray-300 p-2 rounded-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (₹) *</label>
                  <input required type="number" min="0" className="w-full border border-gray-300 p-2 rounded-sm" value={formData.unit_price} onChange={e => setFormData({...formData, unit_price: Number(e.target.value)})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Quantity *</label>
                  <input required type="number" min="0" className="w-full border border-gray-300 p-2 rounded-sm" value={formData.total_quantity} onChange={e => setFormData({...formData, total_quantity: Number(e.target.value), available_quantity: Number(e.target.value)})} disabled={!!editingId} title={editingId ? "Total quantity can only be updated via stock adjustments" : ""} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full border border-gray-300 p-2 rounded-sm" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full border border-gray-300 p-2 rounded-sm" rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-sm hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amity-blue text-white rounded-sm hover:bg-blue-900 transition">Save Component</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
