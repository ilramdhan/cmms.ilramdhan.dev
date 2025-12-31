import React, { useState } from 'react';
import { Search, Filter, MoreVertical, Plus, MapPin, Trash2, Edit, Eye, History, FileText, CheckCircle, PenTool, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { AssetStatus, Asset } from '../types';
import Modal from '../components/Modal';

const StatusBadge: React.FC<{ status: AssetStatus }> = ({ status }) => {
  const styles = {
    Running: 'bg-green-100 text-green-700 border-green-200',
    Downtime: 'bg-red-100 text-red-700 border-red-200',
    Maintenance: 'bg-orange-100 text-orange-700 border-orange-200',
    Offline: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.Offline}`}>
      {status}
    </span>
  );
};

const Assets: React.FC = () => {
  const { assets, workOrders, addAsset, updateAsset, deleteAsset } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'create'>('view');
  const [activeTab, setActiveTab] = useState<'details' | 'history'>('details');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Partial<Asset>>({
    name: '', category: '', model: '', serialNumber: '', location: '', status: 'Offline', uptime: 100, installDate: ''
  });

  const filteredAssets = assets.filter(asset => 
    asset.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    asset.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAssetWorkOrders = (assetId: string) => {
    return workOrders.filter(wo => wo.assetId === assetId);
  };

  const handleOpenCreate = () => {
    setViewMode('create');
    setSelectedAsset(null);
    setFormData({
      name: '', category: 'General', model: '', serialNumber: '', location: '', status: 'Offline', uptime: 100,
      installDate: new Date().toISOString().split('T')[0],
      image: `https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=300&h=300` // Default Tech Image
    });
    setIsModalOpen(true);
  };

  const handleOpenView = (asset: Asset) => {
    setViewMode('view');
    setActiveTab('details');
    setSelectedAsset(asset);
    setFormData(asset); // Pre-fill in case they switch to edit
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asset: Asset) => {
    setViewMode('edit');
    setSelectedAsset(asset);
    setFormData(asset);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (viewMode === 'edit' && selectedAsset) {
      updateAsset(selectedAsset.id, formData);
    } else {
      addAsset({
        ...formData as Asset,
        lastMaintenance: new Date().toISOString().split('T')[0],
        nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Asset Management</h1>
          <p className="text-slate-500">Manage your machinery and equipment inventory.</p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Asset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search assets..."
              className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Serial #</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleOpenView(asset)}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-200">
                         <img 
                           src={asset.image} 
                           alt={asset.name} 
                           className="w-full h-full object-cover" 
                           onError={(e) => {
                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=100&h=100'; // Fallback
                           }}
                         />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{asset.name}</p>
                        <p className="text-xs text-slate-500">{asset.model}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={asset.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <MapPin size={14} className="text-slate-400" />
                      {asset.location}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-mono">
                    {asset.serialNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                       <button onClick={() => handleOpenView(asset)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => handleOpenEdit(asset)} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Edit">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteAsset(asset.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deep Asset Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={viewMode === 'create' ? 'Create New Asset' : viewMode === 'edit' ? 'Edit Asset' : 'Asset Details'}
      >
        {viewMode === 'view' && selectedAsset ? (
          <div className="space-y-4">
            {/* Modal Tabs */}
            <div className="flex border-b border-slate-200">
               <button 
                  onClick={() => setActiveTab('details')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
               >
                 Overview
               </button>
               <button 
                  onClick={() => setActiveTab('history')}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'history' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
               >
                 History & WOs
               </button>
            </div>

            {/* Tab Content */}
            <div className="py-2">
               {activeTab === 'details' ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <img 
                        src={selectedAsset.image} 
                        alt={selectedAsset.name} 
                        className="w-full h-48 object-cover rounded-lg bg-slate-100" 
                        onError={(e) => {
                             (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300&h=300';
                         }}
                       />
                       <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <h4 className="font-semibold text-slate-800 mb-2 flex items-center gap-2">
                            <PenTool size={16} /> Maintenance Stats
                          </h4>
                          <div className="space-y-2 text-sm">
                             <div className="flex justify-between">
                                <span className="text-slate-500">Uptime</span>
                                <span className="font-medium text-green-600">{selectedAsset.uptime}%</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Last Service</span>
                                <span className="text-slate-800">{selectedAsset.lastMaintenance}</span>
                             </div>
                             <div className="flex justify-between">
                                <span className="text-slate-500">Next Due</span>
                                <span className="text-blue-600 font-medium">{selectedAsset.nextMaintenance}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Asset Name</label>
                          <p className="text-lg font-medium text-slate-900">{selectedAsset.name}</p>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Model</label>
                            <p className="text-slate-800">{selectedAsset.model}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Serial Number</label>
                            <p className="text-slate-800 font-mono text-sm">{selectedAsset.serialNumber || 'N/A'}</p>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Category</label>
                            <p className="text-slate-800">{selectedAsset.category}</p>
                          </div>
                          <div>
                            <label className="text-xs font-semibold text-slate-500 uppercase">Install Date</label>
                            <p className="text-slate-800">{selectedAsset.installDate || 'N/A'}</p>
                          </div>
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Location</label>
                          <p className="text-slate-800 flex items-center gap-1">
                             <MapPin size={14} className="text-slate-400" /> {selectedAsset.location}
                          </p>
                       </div>
                       <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Current Status</label>
                          <div className="mt-1"><StatusBadge status={selectedAsset.status} /></div>
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Work Order History</h4>
                    {getAssetWorkOrders(selectedAsset.id).length === 0 ? (
                       <div className="text-center py-8 text-slate-400">No work orders found for this asset.</div>
                    ) : (
                       getAssetWorkOrders(selectedAsset.id).map(wo => (
                          <div key={wo.id} className="p-3 border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center justify-between">
                             <div>
                                <div className="flex items-center gap-2">
                                   <span className="text-xs font-mono text-slate-400">#{wo.id}</span>
                                   <span className={`text-xs px-2 py-0.5 rounded border ${wo.status === 'Completed' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                                      {wo.status}
                                   </span>
                                </div>
                                <p className="text-sm font-medium text-slate-800 mt-1">{wo.title}</p>
                                <p className="text-xs text-slate-500 mt-0.5">Assigned to: {wo.assignedTo || 'Unassigned'} • {wo.createdAt}</p>
                             </div>
                             <div className="text-right">
                                <FileText size={18} className="text-slate-300" />
                             </div>
                          </div>
                       ))
                    )}
                 </div>
               )}
            </div>
            
            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
               <button onClick={() => setViewMode('edit')} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 flex items-center gap-2">
                  <Edit size={16} /> Edit Asset
               </button>
               <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
                  Close
               </button>
            </div>
          </div>
        ) : (
          /* Create / Edit Form */
          <form onSubmit={handleSubmit} className="space-y-4">
             {/* Image Preview in Edit Mode */}
             {(formData.image) && (
                 <div className="flex justify-center mb-4">
                     <img 
                        src={formData.image} 
                        alt="Preview" 
                        className="w-32 h-32 object-cover rounded-lg border border-slate-200 shadow-sm" 
                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=150&h=150'; }}
                     />
                 </div>
             )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Asset Name</label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Image URL</label>
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
              <p className="text-xs text-slate-500 mt-1">Leave empty for default placeholder.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Model</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.model}
                  onChange={(e) => setFormData({...formData, model: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Serial Number</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.serialNumber}
                  onChange={(e) => setFormData({...formData, serialNumber: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Install Date</label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.installDate}
                  onChange={(e) => setFormData({...formData, installDate: e.target.value})}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <select 
                  className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as any})}
                >
                  <option value="Running">Running</option>
                  <option value="Downtime">Downtime</option>
                  <option value="Maintenance">Maintenance</option>
                  <option value="Offline">Offline</option>
                </select>
              </div>
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
                {viewMode === 'edit' ? 'Save Changes' : 'Create Asset'}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Assets;