import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, User, CheckCircle2, AlertCircle, Info, Activity, AlertTriangle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './views/Dashboard';
import Assets from './views/Assets';
import WorkOrders from './views/WorkOrders';
import Inventory from './views/Inventory';
import Technicians from './views/Technicians';
import PMScheduler from './views/PMScheduler';
import RequestPortal from './views/RequestPortal';
import Settings from './views/Settings';
import { DataProvider, useData } from './context/DataContext';

// Inner App component to use the context
const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  const { notifications, activities } = useData();
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (isGuestMode) {
    return <RequestPortal onExit={() => setIsGuestMode(false)} />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'assets': return <Assets />;
      case 'work-orders': return <WorkOrders />;
      case 'inventory': return <Inventory />;
      case 'technicians': return <Technicians />;
      case 'schedules': return <PMScheduler />;
      case 'settings': return <Settings />;
      default: return <div className="p-10 text-center text-slate-500">View under construction</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onEnterGuestMode={() => setIsGuestMode(true)}
      />

      <main className="flex-1 flex flex-col min-w-0 transition-all duration-300 relative">
        {/* Top Header */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden text-slate-500 hover:text-slate-700"
            >
              <Menu size={24} />
            </button>
            
            {/* Search Bar - Hidden on small mobile */}
            <div className="hidden sm:flex items-center relative w-64 lg:w-96">
              <Search className="absolute left-3 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search system..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2 rounded-full transition-colors ${isNotifOpen ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-semibold text-slate-800">Recent Activity</h3>
                    <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline">Mark all read</span>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {activities.length > 0 ? (
                      activities.map((act) => (
                        <div key={act.id} className="px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                          <p className="text-sm text-slate-800">{act.action}</p>
                          <div className="flex justify-between items-center mt-1">
                            <span className="text-xs text-slate-500">{act.user}</span>
                            <span className="text-xs text-slate-400">{act.timestamp}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-slate-500 text-sm">No recent activity</div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-50 bg-slate-50 text-center">
                    <button className="text-xs font-medium text-slate-600 hover:text-blue-600">View Full Log</button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <p className="text-sm font-medium text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Facility Manager</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {renderView()}
          </div>
        </div>

        {/* Toast Notifications Overlay (Live Alerts) */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map((notif) => (
            <div 
              key={notif.id} 
              className="bg-white shadow-lg rounded-lg p-4 border border-slate-100 flex items-center gap-3 animate-in slide-in-from-right duration-300 pointer-events-auto min-w-[300px]"
            >
               {notif.type === 'success' && <CheckCircle2 className="text-green-500" size={20} />}
               {notif.type === 'error' && <AlertCircle className="text-red-500" size={20} />}
               {notif.type === 'info' && <Info className="text-blue-500" size={20} />}
               {notif.type === 'warning' && <AlertTriangle className="text-orange-500" size={20} />}
               <p className="text-sm font-medium text-slate-700">{notif.message}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <DataProvider>
      <AppContent />
    </DataProvider>
  );
};

export default App;