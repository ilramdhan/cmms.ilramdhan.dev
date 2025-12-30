import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, LineChart, Line } from 'recharts';
import { Activity, AlertTriangle, Box, CheckCircle2, Clock, Users, DollarSign } from 'lucide-react';
import StatCard from '../components/StatCard';
import { CHART_DATA, KPI_DATA } from '../constants'; // Keeping chart data static for visual demo as per prompt, but KPIs dynamic
import { useData } from '../context/DataContext';

const Dashboard: React.FC = () => {
  const { assets, workOrders, parts, activities } = useData();

  const lowStockCount = parts.filter(p => p.quantity < 10).length;
  const activeWOs = workOrders.filter(wo => wo.status === 'In Progress' || wo.status === 'Pending').length;
  const totalAssets = assets.length;
  
  // Calculate approximate costs (dummy logic for display)
  const totalCost = parts.reduce((acc, part) => acc + (part.unitPrice * part.quantity), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500">Real-time system performance.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            Download Report
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Work Orders" 
          value={workOrders.length} 
          icon={Activity} 
          trend="Live" 
          trendUp={true} 
          color="blue"
        />
        <StatCard 
          title="Active Jobs" 
          value={activeWOs} 
          icon={Clock} 
          trend="In Progress" 
          trendUp={false} 
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
          value={`$${totalCost.toLocaleString()}`} 
          icon={DollarSign} 
          trend="Estimated" 
          trendUp={true} 
          color="green"
        />
      </div>

      {/* Alerts Section (New) */}
      {(lowStockCount > 0 || activeWOs > 5) && (
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800">System Attention Required</h4>
            <p className="text-sm text-orange-700 mt-1">
              {lowStockCount > 0 && `• ${lowStockCount} items are running low on stock. `}
              {activeWOs > 5 && `• High volume of active work orders (${activeWOs}).`}
            </p>
          </div>
          <button className="px-4 py-2 bg-white border border-orange-200 text-orange-700 text-sm font-medium rounded-lg hover:bg-orange-100">
            View Details
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Maintenance Requests (6 Months)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CHART_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="completed" name="Completed" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="backlog" name="Backlog" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <div className="space-y-6">
              {activities.map((log) => (
                <div key={log.id} className="flex gap-4">
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
                      <span className="text-xs text-slate-500">{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;