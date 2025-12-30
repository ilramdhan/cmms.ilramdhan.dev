import React, { useState } from 'react';
import { Camera, Send, LogOut, CheckCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { WorkOrderPriority } from '../types';

interface RequestPortalProps {
  onExit: () => void;
}

const RequestPortal: React.FC<RequestPortalProps> = ({ onExit }) => {
  const { assets, addWorkOrder } = useData();
  const [step, setStep] = useState<'form' | 'success'>('form');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assetId: '',
    priority: 'Medium' as WorkOrderPriority
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === formData.assetId);
    
    addWorkOrder({
      title: formData.title,
      description: formData.description,
      assetId: formData.assetId,
      assetName: asset?.name || 'Unknown',
      assignedTo: '',
      priority: formData.priority,
      status: 'Requested',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      type: 'Reactive'
    });
    setStep('success');
  };

  const handleReset = () => {
    setFormData({ title: '', description: '', assetId: '', priority: 'Medium' });
    setStep('form');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Maintenance Request</h2>
            <p className="text-blue-100 text-sm">Operator Portal</p>
          </div>
          <button onClick={onExit} className="text-blue-100 hover:text-white" title="Exit to Admin">
            <LogOut size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 'form' ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">What asset is broken?</label>
                <select 
                  required
                  className="w-full px-3 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.assetId}
                  onChange={e => setFormData({...formData, assetId: e.target.value})}
                >
                  <option value="">Select Machine / Equipment</option>
                  {assets.map(a => <option key={a.id} value={a.id}>{a.name} ({a.location})</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue Summary</label>
                <input 
                  required
                  type="text"
                  placeholder="e.g., Leaking oil, Won't start..."
                  className="w-full px-3 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                <textarea 
                  rows={3}
                  placeholder="Describe what happened..."
                  className="w-full px-3 py-3 bg-slate-50 text-slate-900 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                <div className="flex gap-2">
                  {['Low', 'Medium', 'High', 'Critical'].map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData({...formData, priority: p as WorkOrderPriority})}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg border ${
                        formData.priority === p 
                          ? 'bg-blue-600 text-white border-blue-600' 
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={18} /> Submit Request
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Request Sent!</h3>
              <p className="text-slate-500 mt-2 mb-8">The maintenance team has been notified. Your ticket ID is generated.</p>
              <button 
                onClick={handleReset}
                className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Submit Another
              </button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-6 text-slate-400 text-xs">OptiMaint CMMS &copy; 2023</p>
    </div>
  );
};

export default RequestPortal;