import React, { useState } from 'react';
import { Search, Plus, Trash2, User, Mail, Briefcase, Edit, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Technician } from '../types';
import Modal from '../components/Modal';

const Technicians: React.FC = () => {
  const { technicians, addTechnician, updateTechnician, deleteTechnician } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Technician>>({
    name: '', role: '', email: '', status: 'Active', image: ''
  });

  const handleOpenModal = (tech?: Technician) => {
    if (tech) {
        setEditingId(tech.id);
        setFormData(tech);
    } else {
        setEditingId(null);
        setFormData({ name: '', role: '', email: '', status: 'Active', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updateTechnician(editingId, formData);
    } else {
        addTechnician(formData as Technician);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Technician Management</h1>
          <p className="text-slate-500">Manage maintenance team members.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
               <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full flex-shrink-0 bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg overflow-hidden border border-slate-200">
                      {tech.image ? (
                          <img src={tech.image} alt={tech.name} className="w-full h-full object-cover" />
                      ) : (
                          <span>{tech.name.charAt(0)}</span>
                      )}
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-900">{tech.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                        <Briefcase size={12} /> {tech.role}
                      </div>
                  </div>
               </div>
               <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${tech.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                  {tech.status}
               </span>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Mail size={14} /> 
                  <span className="truncate max-w-[150px]">{tech.email}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                        onClick={() => handleOpenModal(tech)}
                        className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Technician"
                    >
                        <Edit size={18} />
                    </button>
                    <button 
                    onClick={() => deleteTechnician(tech.id)} 
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove Technician"
                    >
                    <Trash2 size={18} />
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Technician' : 'Add Technician'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              required 
              type="text" 
              className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. John Doe"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Role/Specialty</label>
                <input 
                required 
                type="text" 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Senior Electrician"
                value={formData.role} 
                onChange={e => setFormData({...formData, role: e.target.value})} 
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                   className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   value={formData.status}
                   onChange={e => setFormData({...formData, status: e.target.value as any})}
                >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              required 
              type="email" 
              className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. john@company.com"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Profile Image URL (Optional)</label>
            <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                    type="text" 
                    className="w-full pl-10 pr-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                    value={formData.image || ''}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingId ? 'Save Changes' : 'Register'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Technicians;