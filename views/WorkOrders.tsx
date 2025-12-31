import React, { useState } from 'react';
import { Calendar, Clock, AlertCircle, CheckCircle, Plus, Trash2, Edit, AlertOctagon, Wrench, ChevronDown, PauseCircle, Package, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import { WorkOrderStatus, WorkOrderPriority, WorkOrder } from '../types';
import Modal from '../components/Modal';

const WorkOrders: React.FC = () => {
  const { workOrders, assets, technicians, parts, addWorkOrder, updateWorkOrder, deleteWorkOrder, addNotification } = useData();
  const [activeTab, setActiveTab] = useState<WorkOrderStatus | 'All'>('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingWO, setEditingWO] = useState<WorkOrder | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<WorkOrder>>({
    title: '', description: '', priority: 'Medium', status: 'Pending', assignedTo: '', assetId: '', dueDate: '', partsUsed: ''
  });

  // Local state for the "Parts Selector" in the modal
  const [selectedPartId, setSelectedPartId] = useState('');
  const [selectedPartQty, setSelectedPartQty] = useState(1);
  // We keep a temporary list of parts in the modal before saving to the string format
  const [tempPartsList, setTempPartsList] = useState<string[]>([]);

  // Helper to get currently selected part object
  const selectedPart = parts.find(p => p.id === selectedPartId);

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
      case 'Completed': return <CheckCircle size={16} className="text-green-600" />;
      case 'Pending': return <Clock size={16} className="text-slate-500" />;
      case 'Requested': return <AlertOctagon size={16} className="text-purple-600" />;
      case 'In Progress': return <div className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"></div>;
      case 'On Hold': return <PauseCircle size={16} className="text-orange-500" />;
      default: return <AlertCircle size={16} className="text-slate-400" />;
    }
  };

  const getStatusStyles = (status: WorkOrderStatus) => {
    switch (status) {
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100';
      case 'Requested': return 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100';
      case 'Pending': return 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
      case 'On Hold': return 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100';
      default: return 'bg-white text-slate-700 border-slate-200';
    }
  };

  const handleOpenModal = (wo?: WorkOrder) => {
    if (wo) {
      setEditingWO(wo);
      setFormData(wo);
      // Initialize temp parts list from the string
      setTempPartsList(wo.partsUsed ? wo.partsUsed.split(', ').filter(s => s) : []);
    } else {
      setEditingWO(null);
      setFormData({
        title: '', description: '', priority: 'Medium', status: 'Pending', assignedTo: '', assetId: '', dueDate: new Date().toISOString().split('T')[0], partsUsed: ''
      });
      setTempPartsList([]);
    }
    setSelectedPartId('');
    setSelectedPartQty(1);
    setIsModalOpen(true);
  };

  const handleAddPart = () => {
    if (!selectedPartId) return;
    const part = parts.find(p => p.id === selectedPartId);
    
    if (part) {
        // Validation: Check stock
        if (selectedPartQty > part.quantity) {
            alert(`Error: Cannot add ${selectedPartQty} units. Only ${part.quantity} available in stock.`);
            return;
        }

        // Create a string that DataContext can parse later: "PartName xQty"
        const partString = `${part.name} x${selectedPartQty}`;
        setTempPartsList([...tempPartsList, partString]);
        
        // Reset selection
        setSelectedPartId('');
        setSelectedPartQty(1);
    }
  };

  const handleRemovePart = (index: number) => {
    const newList = [...tempPartsList];
    newList.splice(index, 1);
    setTempPartsList(newList);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const asset = assets.find(a => a.id === formData.assetId);
    const assetName = asset ? asset.name : 'Unknown Asset';
    
    // Combine parts array back to string for storage
    const finalPartsString = tempPartsList.join(', ');

    if (editingWO) {
      updateWorkOrder(editingWO.id, { ...formData, assetName, partsUsed: finalPartsString });
    } else {
      addWorkOrder({
        ...formData as any,
        assetName,
        partsUsed: finalPartsString,
        createdAt: new Date().toISOString().split('T')[0]
      });
    }
    setIsModalOpen(false);
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
                  {wo.partsUsed && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded w-fit">
                          <Package size={12} />
                          <span>Parts: {wo.partsUsed}</span>
                      </div>
                  )}
                </div>

                <div className="flex items-center gap-4 sm:gap-6 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 min-w-[120px]">
                    <Calendar size={16} className="text-slate-400" />
                    <span>Due {wo.dueDate}</span>
                  </div>
                  
                  {/* UX IMPROVEMENT: Explicit Status Dropdown */}
                  <div className="relative min-w-[160px]">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                      {getStatusIcon(wo.status)}
                    </div>
                    <select
                      value={wo.status}
                      onChange={(e) => updateWorkOrder(wo.id, { status: e.target.value as WorkOrderStatus })}
                      className={`w-full appearance-none pl-10 pr-8 py-2 rounded-lg text-sm font-medium border focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${getStatusStyles(wo.status)}`}
                    >
                      <option value="Requested">Requested</option>
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="On Hold">On Hold</option>
                      <option value="Completed">Completed</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500/70">
                      <ChevronDown size={14} />
                    </div>
                  </div>

                  <div className="flex gap-2 border-l border-slate-200 pl-4">
                    <button onClick={() => handleOpenModal(wo)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Details">
                        <Edit size={18} />
                    </button>
                    <button onClick={() => deleteWorkOrder(wo.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
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
            <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2 flex items-center gap-2">
                 <Package size={14} /> Parts Required / Used
            </h4>
            
            {/* Parts Selector with Explicit Text Color Fix */}
            <div className="flex gap-2 mb-3">
               <select 
                 className="flex-1 px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={selectedPartId}
                 onChange={(e) => {
                     setSelectedPartId(e.target.value);
                     setSelectedPartQty(1); // Reset qty when part changes
                 }}
               >
                 <option value="" className="text-slate-500">Select Part...</option>
                 {parts.map(p => (
                   <option key={p.id} value={p.id} className="text-slate-900">
                     {p.name} (Stock: {p.quantity})
                   </option>
                 ))}
               </select>
               <input 
                 type="number" 
                 min="1"
                 max={selectedPart ? selectedPart.quantity : 100} // Dynamic MAX
                 className="w-20 px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                 value={selectedPartQty}
                 onChange={(e) => setSelectedPartQty(parseInt(e.target.value))}
               />
               <button 
                 type="button" 
                 onClick={handleAddPart}
                 className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium"
               >
                 Add
               </button>
            </div>
            {selectedPart && (
                <p className="text-xs text-slate-500 mb-2">
                    Max available: <span className="font-semibold">{selectedPart.quantity}</span>
                </p>
            )}

            {/* Selected Parts List */}
            {tempPartsList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                    {tempPartsList.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
                            <span>{item}</span>
                            <button type="button" onClick={() => handleRemovePart(index)} className="hover:text-blue-900">
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-xs text-slate-400 italic">No parts added yet.</p>
            )}
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