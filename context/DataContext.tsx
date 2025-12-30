import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  addNotification: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Helper to load from LocalStorage or fallback to constant
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : fallback;
    } catch (e) {
      console.error("Failed to load state", e);
      return fallback;
    }
  };

  const [assets, setAssets] = useState<Asset[]>(() => loadState('cmms_assets', ASSETS));
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => loadState('cmms_workOrders', WORK_ORDERS));
  const [parts, setParts] = useState<Part[]>(() => loadState('cmms_parts', PARTS));
  const [technicians, setTechnicians] = useState<Technician[]>(() => loadState('cmms_technicians', TECHNICIANS));
  const [activities, setActivities] = useState<ActivityLog[]>(() => loadState('cmms_activities', RECENT_ACTIVITY));
  const [pmSchedules, setPmSchedules] = useState<PMSchedule[]>(() => loadState('cmms_pmSchedules', PM_SCHEDULES));
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Persist State Changes
  useEffect(() => localStorage.setItem('cmms_assets', JSON.stringify(assets)), [assets]);
  useEffect(() => localStorage.setItem('cmms_workOrders', JSON.stringify(workOrders)), [workOrders]);
  useEffect(() => localStorage.setItem('cmms_parts', JSON.stringify(parts)), [parts]);
  useEffect(() => localStorage.setItem('cmms_technicians', JSON.stringify(technicians)), [technicians]);
  useEffect(() => localStorage.setItem('cmms_activities', JSON.stringify(activities)), [activities]);
  useEffect(() => localStorage.setItem('cmms_pmSchedules', JSON.stringify(pmSchedules)), [pmSchedules]);

  const addNotification = (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    const id = Date.now().toString();
    setNotifications(prev => [...prev, { id, message, type }]);
    
    // Log activity
    const newActivity: ActivityLog = {
      id: Date.now().toString(),
      action: message,
      user: 'Admin', // Static for demo
      timestamp: 'Just now',
      type: type
    };
    setActivities(prev => [newActivity, ...prev]);

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
    addNotification(`Asset ${newAsset.name} created`, 'success');
  };
  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(assets.map(a => a.id === id ? { ...a, ...updates } : a));
    addNotification('Asset details updated', 'info');
  };
  const deleteAsset = (id: string) => {
    setAssets(assets.filter(a => a.id !== id));
    addNotification('Asset removed from database', 'error');
  };

  // --- Work Orders ---
  const addWorkOrder = (wo: Omit<WorkOrder, 'id'>) => {
    const newWO = { ...wo, id: `WO-${Math.floor(Math.random() * 10000)}` };
    setWorkOrders([newWO, ...workOrders]);
    addNotification(`Work Order ${newWO.id} created`, 'success');
  };

  const updateWorkOrder = (id: string, updates: Partial<WorkOrder>) => {
    // INTEGRATION LOGIC: Check if we are closing a WO and if it used parts
    if (updates.status === 'Completed' && updates.partsUsed) {
      // Parse "PRT-001:2" format for demo integration
      // Logic: If user entered text like "PRT-001", we deduct 1. 
      // This is a simple logic for the demo to show data connecting.
      const partToDeduct = parts.find(p => updates.partsUsed?.includes(p.sku) || updates.partsUsed?.includes(p.name));
      
      if (partToDeduct) {
         // Deduct 1 for demo simplicity if match found
         updatePart(partToDeduct.id, { quantity: partToDeduct.quantity - 1 });
         addNotification(`Inventory deducted: 1x ${partToDeduct.name}`, 'warning');
      }
    }

    setWorkOrders(workOrders.map(w => w.id === id ? { ...w, ...updates } : w));
    addNotification('Work Order status updated', 'info');
  };

  const deleteWorkOrder = (id: string) => {
    setWorkOrders(workOrders.filter(w => w.id !== id));
    addNotification('Work Order deleted', 'error');
  };

  // --- PM Schedules ---
  const addPMSchedule = (pm: Omit<PMSchedule, 'id'>) => {
    const newPM = { ...pm, id: `PM-${Math.floor(Math.random() * 1000)}` };
    setPmSchedules([...pmSchedules, newPM]);
    addNotification('PM Schedule created', 'success');
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
    
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + pm.frequencyDays);
    setPmSchedules(pmSchedules.map(p => p.id === pmId ? { 
      ...p, 
      lastRunDate: new Date().toISOString().split('T')[0], 
      nextDueDate: nextDue.toISOString().split('T')[0] 
    } : p));

    addNotification('WO generated from PM', 'success');
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
    // Silent update for logic, audible for manual
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