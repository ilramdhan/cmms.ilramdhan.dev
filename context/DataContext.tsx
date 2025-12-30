import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Asset, WorkOrder, Part, Technician, Notification, ActivityLog, PMSchedule } from '../types';
import { ASSETS, WORK_ORDERS, PARTS, TECHNICIANS, RECENT_ACTIVITY, PM_SCHEDULES } from '../constants';

interface DataContextType {
  assets: Asset[];
  workOrders: WorkOrder[];
  parts: Part[];
  technicians: Technician[];
  activities: ActivityLog[];
  notifications: Notification[];
  pmSchedules: PMSchedule[];
  
  // Asset Actions
  addAsset: (asset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;

  // Work Order Actions
  addWorkOrder: (wo: Omit<WorkOrder, 'id'>) => void;
  updateWorkOrder: (id: string, updates: Partial<WorkOrder>) => void;
  deleteWorkOrder: (id: string) => void;

  // PM Actions
  addPMSchedule: (pm: Omit<PMSchedule, 'id'>) => void;
  generateWOFromPM: (pmId: string) => void;
  deletePMSchedule: (id: string) => void;

  // Inventory Actions
  addPart: (part: Omit<Part, 'id'>) => void;
  updatePart: (id: string, updates: Partial<Part>) => void;
  deletePart: (id: string) => void;

  // Technician Actions
  addTechnician: (tech: Omit<Technician, 'id'>) => void;
  updateTechnician: (id: string, updates: Partial<Technician>) => void;
  deleteTechnician: (id: string) => void;

  // Notification Actions
  addNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(ASSETS);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(WORK_ORDERS);
  const [parts, setParts] = useState<Part[]>(PARTS);
  const [technicians, setTechnicians] = useState<Technician[]>(TECHNICIANS);
  const [activities, setActivities] = useState<ActivityLog[]>(RECENT_ACTIVITY);
  const [pmSchedules, setPmSchedules] = useState<PMSchedule[]>(PM_SCHEDULES);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- Assets ---
  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset = { ...asset, id: `AST-${Math.floor(Math.random() * 1000)}` };
    setAssets([...assets, newAsset]);
    addNotification('Asset created successfully', 'success');
  };
  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(assets.map(a => a.id === id ? { ...a, ...updates } : a));
    addNotification('Asset updated', 'info');
  };
  const deleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    addNotification('Asset deleted', 'error');
  };

  // --- Work Orders ---
  const addWorkOrder = (wo: Omit<WorkOrder, 'id'>) => {
    const newWO = { ...wo, id: `WO-${Math.floor(Math.random() * 10000)}` };
    setWorkOrders([newWO, ...workOrders]);
    addNotification('Work Order created', 'success');
  };
  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    setWorkOrders(workOrders.map(w => w.id === id ? { ...w, ...updates } : w));
    addNotification('Work Order updated', 'info');
  };
  const deleteWorkOrder = (id: string) => {
    setWorkOrders(workOrders.filter(w => w.id !== id));
    addNotification('Work Order deleted', 'error');
  };

  // --- PM Schedules ---
  const addPMSchedule = (pm: Omit<PMSchedule, 'id'>) => {
    const newPM = { ...pm, id: `PM-${Math.floor(Math.random() * 1000)}` };
    setPmSchedules([...pmSchedules, newPM]);
    addNotification('Preventive Maintenance Schedule created', 'success');
  };

  const generateWOFromPM = (pmId: string) => {
    const pm = pmSchedules.find(p => p.id === pmId);
    if (!pm) return;

    const newWO: Omit<WorkOrder, 'id'> = {
      title: `PM: ${pm.taskName}`,
      description: 'Auto-generated preventive maintenance task.',
      assetId: pm.assetId,
      assetName: pm.assetName,
      assignedTo: pm.assignedTo,
      priority: 'Medium',
      status: 'Pending',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      type: 'Preventive'
    };

    addWorkOrder(newWO);
    
    // Update Next Due Date
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + pm.frequencyDays);
    setPmSchedules(pmSchedules.map(p => p.id === pmId ? { 
      ...p, 
      lastRunDate: new Date().toISOString().split('T')[0], 
      nextDueDate: nextDue.toISOString().split('T')[0] 
    } : p));

    addNotification('Work Order generated from Schedule', 'success');
  };

  const deletePMSchedule = (id: string) => {
    setPmSchedules(pmSchedules.filter(p => p.id !== id));
    addNotification('Schedule deleted', 'error');
  };


  // --- Inventory ---
  const addPart = (part: Omit<Part, 'id'>) => {
    const newPart = { ...part, id: `PRT-${Math.floor(Math.random() * 1000)}` };
    setParts([...parts, newPart]);
    addNotification('Part added to inventory', 'success');
  };
  const updatePart = (id: string, updates: Partial<Part>) => {
    setParts(parts.map(p => p.id === id ? { ...p, ...updates } : p));
    addNotification('Inventory updated', 'info');
  };
  const deletePart = (id: string) => {
    setParts(parts.filter(p => p.id !== id));
    addNotification('Part removed', 'error');
  };

  // --- Technicians ---
  const addTechnician = (tech: Omit<Technician, 'id'>) => {
    const newTech = { ...tech, id: `T-${Math.floor(Math.random() * 1000)}` };
    setTechnicians([...technicians, newTech]);
    addNotification('Technician registered', 'success');
  };
  const updateTechnician = (id: string, updates: Partial<Technician>) => {
    setTechnicians(technicians.map(t => t.id === id ? { ...t, ...updates } : t));
    addNotification('Technician updated', 'info');
  };
  const deleteTechnician = (id: string) => {
    setTechnicians(technicians.filter(t => t.id !== id));
    addNotification('Technician removed', 'error');
  };

  return (
    <DataContext.Provider value={{
      assets, workOrders, parts, technicians, activities, notifications, pmSchedules,
      addAsset, updateAsset, deleteAsset,
      addWorkOrder, updateWorkOrder, deleteWorkOrder,
      addPMSchedule, generateWOFromPM, deletePMSchedule,
      addPart, updatePart, deletePart,
      addTechnician, updateTechnician, deleteTechnician,
      addNotification, removeNotification
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};