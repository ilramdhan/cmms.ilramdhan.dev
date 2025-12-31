import React, { useMemo, useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Activity, AlertTriangle, CheckCircle2, Clock, Users, DollarSign, Download } from 'lucide-react';
import StatCard from '../components/StatCard';
import { useData } from '../context/DataContext';

interface DashboardProps {
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { assets, workOrders, parts, activities } = useData();
  const [now, setNow] = useState(new Date());

  // Update "now" every minute to keep relative time fresh
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const lowStockCount = parts.filter(p => p.quantity < 10).length;
  const activeWOs = workOrders.filter(wo => wo.status === 'In Progress' || wo.status === 'Pending').length;
  
  // Calculate approximate costs (Inventory Value)
  // This is calculated from real data in DataContext
  const totalInventoryValue = parts.reduce((acc, part) => acc + (part.unitPrice * part.quantity), 0);

  // --- Helper: Format Time Ago ---
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    // Check if it's a valid date (handles the ISO strings we just added)
    if (isNaN(date.getTime())) {
      // If not a date (e.g. "10 mins ago" from legacy dummy data), return as is
      return dateString;
    }

    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  // --- Real-time Chart Logic ---
  const chartData = useMemo(() => {
    // 1. Get last 6 months
    const months: string[] = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(d.toLocaleString('default', { month: 'short' }));
    }

    // 2. Initialize data structure
    const data = months.map(month => ({
      month,
      completed: 0,
      backlog: 0,
      costs: 0
    }));

    // 3. Populate with real WO data
    workOrders.forEach(wo => {
      const woDate = new Date(wo.createdAt);
      const woMonthStr = woDate.toLocaleString('default', { month: 'short' });
      
      const dataPoint = data.find(d => d.month === woMonthStr);
      if (dataPoint) {
        if (wo.status === 'Completed') {
          dataPoint.completed += 1;
          // Simulated Cost: $150 labor + arbitrary part cost logic for chart visual
          dataPoint.costs += 150; 
        } else {
          dataPoint.backlog += 1;
        }
      }
    });

    return data;
  }, [workOrders]);

  // --- Export Function ---
  const handleDownloadReport = () => {
    // 1. Define headers
    const headers = ['WO ID', 'Title', 'Asset', 'Status', 'Priority', 'Assigned To', 'Date Created', 'Due Date'];
    
    // 2. Map data
    const rows = workOrders.map(wo => [
      wo.id,
      `"${wo.title}"`, // Quote strings to handle commas
      `"${wo.assetName}"`,
      wo.status,
      wo.priority,
      wo.assignedTo || 'Unassigned',
      wo.createdAt,
      wo.dueDate
    ]);

    // 3. Create CSV Content
    const csvContent = [
      headers.join(','), 
      ...rows.map(r => r.join(','))
    ].join('\n');

    // 4. Trigger Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `optimaint_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Real-time system performance.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleDownloadReport}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
          >
            <Download size={16} /> Download Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Work Orders" 
          value={workOrders.length} 
          icon={Activity} 
          trend="Real-time" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="Active Jobs" 
          value={activeWOs} 
          icon={Clock} 
          trend="Current backlog" 
          trendUp={activeWOs < 5} 
          color="orange"
        />
        <StatCard 
          title="Low Stock Alerts" 
          value={lowStockCount} 
          icon={AlertTriangle} 
          trend={lowStockCount > 0 ? "Action Needed" : "Stable"} 
          trendUp={lowStockCount === 0} 
          color={lowStockCount > 0 ? "red" : "green"}
        />
        <StatCard 
          title="Inventory Value" 
          value={`$${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`} 
          icon={DollarSign} 
          trend="Calculated" 
          trendUp={true} 
          color="green"
        />
      </div>

      {/* Interactive Alerts Section */}
      {(lowStockCount > 0 || activeWOs > 5) && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center animate-in slide-in-from-top-2 duration-300">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800">System Attention Required</h4>
            <div className="text-sm text-orange-700 mt-1 flex flex-col sm:flex-row gap-2 sm:gap-4">
              {lowStockCount > 0 && (
                <span className="flex items-center gap-1">
                  • <b>{lowStockCount}</b> items are low on stock.
                </span>
              )}
              {activeWOs > 5 && (
                <span className="flex items-center gap-1">
                   • High volume of active work orders (<b>{activeWOs}</b>).
                </span>
              )}
            </div>
          </div>
          <button 
            onClick={() => lowStockCount > 0 ? onNavigate('inventory') : onNavigate('work-orders')}
            className="px-4 py-2 bg-white border border-orange-200 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-100 whitespace-nowrap"
          >
            {lowStockCount > 0 ? 'Check Inventory' : 'View Work Orders'}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-Time Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800">Maintenance Trends (6 Months)</h3>
            <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">Live Data</span>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="completed" name="Completed Jobs" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="backlog" name="Pending/Backlog" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="text-lg font-bold text-slate-800">Recent Activity</h3>
             <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">Live Feed</span>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar max-h-[320px]">
            <div className="space-y-6">
              {activities.length === 0 ? (
                 <p className="text-slate-400 text-sm text-center italic mt-10">No recent activity logged.</p>
              ) : (
                activities.map((log) => (
                  <div key={log.id} className="flex gap-4 animate-in slide-in-from-right-4 duration-300">
                    <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      log.type === 'success' ? 'bg-green-100 text-green-600' :
                      log.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                      log.type === 'error' ? 'bg-red-100 text-red-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {log.type === 'success' ? <CheckCircle2 size={16} /> :
                      log.type === 'warning' ? <AlertTriangle size={16} /> :
                      log.type === 'error' ? <AlertTriangle size={16} /> :
                      <Activity size={16} />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">{log.action}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-slate-500">{log.user}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="text-xs text-slate-500">{formatTimeAgo(log.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;