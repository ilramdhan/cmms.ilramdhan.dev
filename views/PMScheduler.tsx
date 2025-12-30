import React, { useState } from 'react';
import { Calendar, Plus, RefreshCw, Trash2, Play } from 'lucide-react';
import { useData } from '../context/DataContext';
import { PMSchedule } from '../types';
import Modal from '../components/Modal';

const PMScheduler: React.FC = () => {
  const { pmSchedules, assets, technicians, addPMSchedule, generateWOFromPM, deletePMSchedule } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<PMSchedule>>({
    taskName: '', assetId: '', frequencyDays: 30, assignedTo: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === formData.assetId);
    addPMSchedule({
       ...formData as any,
       assetName: asset?.name || 'Unknown',
       lastRunDate: 'Never',
       nextDueDate: new Date(Date.now() + (formData.frequencyDays || 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Preventive Maintenance</h1>
          <p className="text-slate-500">Schedule recurring tasks and automate work orders.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          New Schedule
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pmSchedules.map((pm) => (
          <div key={pm.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
             <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                   <RefreshCw size={24} />
                </div>
                <div className="text-right">
                   <p className="text-xs text-slate-500 uppercase font-semibold">Frequency</p>
                   <p className="text-sm font-medium text-slate-900">Every {pm.frequencyDays} Days</p>
                </div>
             </div>
             
             <h3 className="text-lg font-bold text-slate-900 mb-1">{pm.taskName}</h3>
             <p className="text-sm text-slate-500 mb-4">{pm.assetName}</p>
             
             <div className="space-y-2 text-sm text-slate-600 mb-6 bg-slate-50 p-3 rounded-lg">
                <div className="flex justify-between">
                   <span>Last Run:</span>
                   <span className="font-medium">{pm.lastRunDate}</span>
                </div>
                <div className="flex justify-between">
                   <span>Next Due:</span>
                   <span className={`font-medium ${new Date(pm.nextDueDate) < new Date() ? 'text-red-600' : 'text-blue-600'}`}>
                      {pm.nextDueDate}
                   </span>
                </div>
                <div className="flex justify-between">
                   <span>Assigned:</span>
                   <span>{pm.assignedTo || 'Unassigned'}</span>
                </div>
             </div>

             <div className="flex gap-2">
                <button 
                   onClick={() => generateWOFromPM(pm.id)}
                   className="flex-1 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                   title="Generate Work Order Now"
                >
                   <Play size={16} /> Run Now
                </button>
                <button 
                   onClick={() => deletePMSchedule(pm.id)}
                   className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200"
                >
                   <Trash2 size={18} />
                </button>
             </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create PM Schedule">
        <form onSubmit={handleSubmit} className="space-y-4">
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Task Name</label>
              <input 
                required 
                type="text" 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g., Weekly Lubrication"
                value={formData.taskName} 
                onChange={e => setFormData({...formData, taskName: e.target.value})} 
              />
           </div>
           <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Asset</label>
              <select 
                required 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.assetId} 
                onChange={e => setFormData({...formData, assetId: e.target.value})}
              >
                 <option value="">Select Asset</option>
                 {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
           </div>
           <div className="grid grid-cols-2 gap-4">
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Frequency (Days)</label>
                 <input 
                   required 
                   type="number" 
                   min="1"
                   className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   value={formData.frequencyDays} 
                   onChange={e => setFormData({...formData, frequencyDays: parseInt(e.target.value)})} 
                 />
              </div>
              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Assign Tech</label>
                 <select 
                   className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                   value={formData.assignedTo} 
                   onChange={e => setFormData({...formData, assignedTo: e.target.value})}
                 >
                    <option value="">Auto-Assign</option>
                    {technicians.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                 </select>
              </div>
           </div>
           <div className="pt-4 flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Create Schedule</button>
           </div>
        </form>
      </Modal>
    </div>
  );
};

export default PMScheduler;