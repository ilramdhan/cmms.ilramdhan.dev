import React from 'react';
import { Save, Bell, Lock, Building, Globe, RotateCcw, AlertOctagon } from 'lucide-react';
import { ASSETS, WORK_ORDERS, PARTS, TECHNICIANS, RECENT_ACTIVITY, PM_SCHEDULES } from '../constants';

const Settings: React.FC = () => {
  
  const handleResetData = () => {
    if (window.confirm("WARNING: This will delete all your local data and reset the application to its default demo state. Are you sure?")) {
      // Clear current data
      localStorage.clear();
      
      // Explicitly re-seed with constants to ensure data is present immediately
      localStorage.setItem('cmms_assets', JSON.stringify(ASSETS));
      localStorage.setItem('cmms_workOrders', JSON.stringify(WORK_ORDERS));
      localStorage.setItem('cmms_parts', JSON.stringify(PARTS));
      localStorage.setItem('cmms_technicians', JSON.stringify(TECHNICIANS));
      localStorage.setItem('cmms_activities', JSON.stringify(RECENT_ACTIVITY));
      localStorage.setItem('cmms_pmSchedules', JSON.stringify(PM_SCHEDULES));

      // Set flag for success notification on next load
      localStorage.setItem('cmms_reset_success', 'true');

      // Reload to reflect changes
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">System Settings</h1>
          <p className="text-slate-500">Configure global application preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation / Sidebar for settings */}
        <div className="col-span-1 space-y-2">
           <button className="w-full text-left px-4 py-3 bg-white border border-slate-200 rounded-lg shadow-sm font-medium text-blue-600 flex items-center gap-3">
              <Building size={18} /> Company Profile
           </button>
           <button className="w-full text-left px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-3">
              <Bell size={18} /> Notifications
           </button>
           <button className="w-full text-left px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-3">
              <Lock size={18} /> Security & Roles
           </button>
           <button className="w-full text-left px-4 py-3 bg-slate-50 border border-transparent rounded-lg text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-3">
              <Globe size={18} /> Language & Region
           </button>
        </div>

        {/* Main Form Area */}
        <div className="col-span-1 md:col-span-2 space-y-6">
            
            {/* Company Profile Section */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Company Information</h3>
              
              <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                        <input type="text" defaultValue="Acme Manufacturing" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tax ID / EIN</label>
                        <input type="text" defaultValue="XX-XXXXXXX" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                    <input type="text" defaultValue="123 Industrial Way, Sector 7" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none mb-3" />
                    <div className="grid grid-cols-3 gap-3">
                        <input type="text" defaultValue="Springfield" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="text" defaultValue="IL" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                        <input type="text" defaultValue="62704" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-end">
                    <button type="button" className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                  </div>
              </form>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
              <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                 <AlertOctagon size={20} /> Danger Zone
              </h3>
              <p className="text-sm text-red-600 mb-6">
                 Resetting the system will clear all created assets, work orders, and inventory. The application will reload with the initial demo data.
              </p>
              
              <button 
                onClick={handleResetData}
                className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-100 flex items-center gap-2 transition-colors"
              >
                  <RotateCcw size={18} /> Reset to Demo Data
              </button>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Settings;