import React, { useState } from 'react';
import { Search, Plus, Trash2, User, Mail, Briefcase } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Technician } from '../types';
import Modal from '../components/Modal';

const Technicians: React.FC = () => {
  const { technicians, addTechnician, deleteTechnician } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Technician>>({
    name: '', role: '', email: '', status: 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTechnician(formData as Technician);
    setIsModalOpen(false);
    setFormData({ name: '', role: '', email: '', status: 'Active' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Technician Management</h1>
          <p className="text-slate-500">Manage maintenance team members.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Plus size={18} /> Add Technician
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {technicians.map((tech) => (
          <div key={tech.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start">
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
                      {tech.name.charAt(0)}
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
                <button 
                  onClick={() => deleteTechnician(tech.id)} 
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  title="Remove Technician"
                >
                  <Trash2 size={18} />
                </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Technician">
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
          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Register</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Technicians;