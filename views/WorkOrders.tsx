import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, Trash2, Edit, AlertOctagon, Wrench } from 'lucide-react';
import { useData } from '../context/DataContext';
import { WorkOrderStatus, WorkOrderPriority, WorkOrder } from '../types';
import Modal from '../components/Modal';

const WorkOrders: React.FC = () => {
  const { workOrders, assets, technicians, addWorkOrder, updateWorkOrder, deleteWorkOrder } = useData();
  const [activeTab, setActiveTab] = useState<WorkOrderStatus | 'All'>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<WorkOrder | null>(null);
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    title: '', description: '', priority: 'Medium', status: 'Pending', assignedTo: '', assetId: '', dueDate: '', partsUsed: ''
  });

  const tabs = ['All', 'Requested', 'Pending', 'In Progress', 'Completed'];

  const filteredOrders = activeTab === 'All' 
    ? workOrders 
    : workOrders.filter(wo => wo.status === activeTab);

  const getPriorityColor = (priority: WorkOrderPriority) => {
    switch (priority) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-100';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  const getStatusIcon = (status: WorkOrderStatus) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} className="text-green-500" />;
      case 'Pending': return <Clock size={16} className="text-slate-400" />;
      case 'Requested': return <AlertOctagon size={16} className="text-purple-500" />;
      case 'In Progress': return <div className="w-4 h-4 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const handleOpenModal = (wo?: WorkOrder) => {
    if (wo) {
      setEditingWO(wo);
      setFormData(wo);
    } else {
      setEditingWO(null);
      setFormData({
        title: '', description: '', priority: 'Medium', status: 'Pending', assignedTo: '', assetId: '', dueDate: new Date().toISOString().split('T')[0], partsUsed: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === formData.assetId);
    const assetName = asset ? asset.name : 'Unknown Asset';
    
    if (editingWO) {
      updateWorkOrder(editingWO.id, { ...formData, assetName });
    } else {
      addWorkOrder({
        ...formData as any,
        assetName,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
  };

  const cycleStatus = (wo: WorkOrder) => {
    const statuses: WorkOrderStatus[] = ['Requested', 'Pending', 'In Progress', 'Completed'];
    const nextIndex = (statuses.indexOf(wo.status) + 1) % statuses.length;
    updateWorkOrder(wo.id, { status: statuses[nextIndex] });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Orders</h1>
          <p className="text-slate-500">Track and assign maintenance tasks.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200 flex items-center gap-2"
        >
          <Plus size={18} />
          New Work Order
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="p-1 overflow-x-auto">
          <div className="flex space-x-1 border-b border-slate-100 p-3">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  activeTab === tab 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredOrders.length === 0 ? (
             <div className="p-12 text-center text-slate-400">
                <p>No work orders found in this category.</p>
             </div>
          ) : (
             filteredOrders.map((wo) => (
              <div key={wo.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors flex flex-col md:flex-row gap-4 md:items-center">
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-mono text-slate-400">#{wo.id}</span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                    {wo.type === 'Preventive' && (
                        <span className="text-xs px-2 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200">PM</span>
                    )}
                  </div>
                  <h3 className="text-base font-semibold text-slate-900">{wo.title}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                    <Wrench size={14} className="text-slate-400" />
                    <span>{wo.assetName}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Assigned to <span className="font-medium text-slate-700">{wo.assignedTo || 'Unassigned'}</span></span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 min-w-[120px]">
                    <Calendar size={16} className="text-slate-400" />
                    <span>Due {wo.dueDate}</span>
                  </div>
                  
                  <button 
                    onClick={() => cycleStatus(wo)}
                    className="flex items-center gap-2 min-w-[120px] px-2 py-1 rounded hover:bg-slate-100 transition-colors cursor-pointer group"
                    title="Click to cycle status"
                  >
                    {getStatusIcon(wo.status)}
                    <span className={`font-medium ${
                      wo.status === 'Completed' ? 'text-green-600' :
                      wo.status === 'In Progress' ? 'text-blue-600' :
                      wo.status === 'Requested' ? 'text-purple-600' :
                      'text-slate-600'
                    }`}>
                      {wo.status}
                    </span>
                  </button>

                  <div className="flex gap-2">
                    <button onClick={() => handleOpenModal(wo)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => deleteWorkOrder(wo.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>

       {/* Modal Form */}
       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingWO ? 'Edit Work Order' : 'Create Work Order'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              required
              type="text" 
              className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={2}
              value={formData.description || ''}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset</label>
              <select 
                required
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.assetId}
                onChange={(e) => setFormData({...formData, assetId: e.target.value})}
              >
                <option value="">Select Asset</option>
                {assets.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Technician</label>
              <select 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.assignedTo}
                onChange={(e) => setFormData({...formData, assignedTo: e.target.value})}
              >
                <option value="">Unassigned</option>
                {technicians.map(t => <option key={t.id} value={t.name}>{t.name} ({t.role})</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value as any})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
              <input 
                required
                type="date"
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.dueDate}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">Parts Used (Demo)</h4>
            <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. V-Belt A45"
                  className="flex-1 px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none"
                  value={formData.partsUsed || ''}
                  onChange={(e) => setFormData({...formData, partsUsed: e.target.value})}
                />
            </div>
            <p className="text-xs text-slate-400 mt-1">
               Integration Demo: If you type "V-Belt" and complete this WO, stock will decrease by 1.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              {editingWO ? 'Save Changes' : 'Create Order'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default WorkOrders;