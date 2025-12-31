import React, { useState } from 'react';
import { Search, Plus, Minus, Trash2, AlertCircle, Package, Image as ImageIcon } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Part } from '../types';
import Modal from '../components/Modal';

const Inventory: React.FC = () => {
  const { parts, addPart, updatePart, deletePart } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Part>>({
    name: '', sku: '', category: '', quantity: 0, unitPrice: 0, image: ''
  });

  const filteredParts = parts.filter(part => 
    part.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    part.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (part?: Part) => {
    if (part) {
        setEditingId(part.id);
        setFormData(part);
    } else {
        setEditingId(null);
        setFormData({ name: '', sku: '', category: '', quantity: 0, unitPrice: 0, image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
        updatePart(editingId, formData);
    } else {
        addPart(formData as Part);
    }
    setIsModalOpen(false);
  };

  const adjustStock = (id: string, current: number, amount: number) => {
    const newQuantity = current + amount;
    if (newQuantity < 0) return;
    updatePart(id, { quantity: newQuantity });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Inventory & Parts</h1>
          <p className="text-slate-500">Track spare parts and stock levels.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus size={18} />
          Add Part
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Search by name or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-semibold border-b border-slate-200">
                <th className="px-6 py-4">Part Name</th>
                <th className="px-6 py-4">SKU</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Unit Price</th>
                <th className="px-6 py-4">Stock Level</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParts.map((part) => (
                <tr key={part.id} className={`hover:bg-slate-50 transition-colors cursor-pointer ${part.quantity < 10 ? 'bg-red-50/30' : ''}`} onClick={() => handleOpenModal(part)}>
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden border border-slate-200 bg-white ${!part.image && (part.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600')}`}>
                          {part.image ? (
                              <img src={part.image} alt={part.name} className="w-full h-full object-cover" />
                          ) : (
                              <Package size={18} />
                          )}
                       </div>
                       <div>
                         <div className="flex items-center gap-2">
                            {part.name}
                            {part.quantity < 10 && <span className="text-xs text-red-600 font-bold px-2 py-0.5 bg-red-100 rounded-full">Low</span>}
                         </div>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-mono">{part.sku}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <span className="px-2 py-1 bg-slate-100 rounded text-slate-600 text-xs font-medium">
                      {part.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">${part.unitPrice.toFixed(2)}</td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => adjustStock(part.id, part.quantity, -1)}
                          className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 hover:bg-slate-100 text-slate-600 bg-white"
                        >
                          <Minus size={14} />
                        </button>
                        <span className={`text-sm font-bold w-8 text-center ${part.quantity < 10 ? 'text-red-600' : 'text-slate-700'}`}>
                          {part.quantity}
                        </span>
                        <button 
                          onClick={() => adjustStock(part.id, part.quantity, 1)}
                          className="w-7 h-7 rounded flex items-center justify-center border border-slate-300 hover:bg-slate-100 text-slate-600 bg-white"
                        >
                          <Plus size={14} />
                        </button>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => { e.stopPropagation(); deletePart(part.id); }} 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

       <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'Edit Spare Part' : 'Add Spare Part'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Part Name</label>
            <input 
              required 
              type="text" 
              className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Ball Bearing"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">SKU</label>
              <input 
                required 
                type="text" 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. BRG-001"
                value={formData.sku} 
                onChange={e => setFormData({...formData, sku: e.target.value})} 
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
               <input 
                 required 
                 type="text" 
                 className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 placeholder="e.g. Hardware"
                 value={formData.category} 
                 onChange={e => setFormData({...formData, category: e.target.value})} 
                />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image URL (Optional)</label>
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Initial Qty</label>
              <input 
                required 
                type="number" 
                className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.quantity} 
                onChange={e => setFormData({...formData, quantity: parseInt(e.target.value)})} 
              />
            </div>
            <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Unit Price ($)</label>
               <input 
                 required 
                 type="number" 
                 step="0.01" 
                 className="w-full px-3 py-2 bg-white text-slate-900 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                 value={formData.unitPrice} 
                 onChange={e => setFormData({...formData, unitPrice: parseFloat(e.target.value)})} 
               />
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
             <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg">Cancel</button>
             <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">{editingId ? 'Save Changes' : 'Add Part'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Inventory;