import { Asset, WorkOrder, KpiData, ChartDataPoint, ActivityLog, Part, Technician, PMSchedule } from './types';

// Calculated internally in Dashboard, but keeping type for reference
export const KPI_DATA: KpiData = {
  totalAssets: 0,
  activeWorkOrders: 0,
  lowStockItems: 0,
  mtbf: 0,
};

export const CHART_DATA: ChartDataPoint[] = []; // Calculated dynamically

export const ASSETS: Asset[] = [
  {
    id: 'AST-001',
    name: 'CNC Milling Machine X1',
    category: 'Manufacturing',
    model: 'Haas VF-2',
    serialNumber: 'HS-9982-X1',
    installDate: '2021-05-12',
    location: 'Floor 1, Zone A',
    status: 'Running',
    uptime: 98.5,
    lastMaintenance: '2023-10-15',
    nextMaintenance: '2023-11-15',
    image: 'https://images.unsplash.com/photo-1635338692797-27b0b0051787?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 'AST-002',
    name: 'Hydraulic Press 50T',
    category: 'Forming',
    model: 'Dake 50 Ton',
    serialNumber: 'DK-50T-2022',
    installDate: '2022-01-20',
    location: 'Floor 1, Zone B',
    status: 'Downtime',
    uptime: 45.2,
    lastMaintenance: '2023-09-20',
    nextMaintenance: '2023-10-20',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 'AST-003',
    name: 'Conveyor Belt System',
    category: 'Logistics',
    model: 'Siemens Flow',
    serialNumber: 'SF-CON-003',
    installDate: '2020-11-15',
    location: 'Floor 2, Zone C',
    status: 'Maintenance',
    uptime: 88.0,
    lastMaintenance: '2023-10-25',
    nextMaintenance: '2023-11-25',
    image: 'https://images.unsplash.com/photo-1565514020176-db711eb900b1?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 'AST-004',
    name: 'Industrial Robot Arm',
    category: 'Assembly',
    model: 'Kuka KR 16',
    serialNumber: 'KK-ROBO-16',
    installDate: '2023-03-10',
    location: 'Floor 1, Zone A',
    status: 'Running',
    uptime: 99.9,
    lastMaintenance: '2023-10-01',
    nextMaintenance: '2024-01-01',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 'AST-005',
    name: 'Injection Molder',
    category: 'Manufacturing',
    model: 'Arburg 370',
    serialNumber: 'ARB-370-V2',
    installDate: '2019-08-05',
    location: 'Floor 1, Zone B',
    status: 'Running',
    uptime: 92.4,
    lastMaintenance: '2023-10-10',
    nextMaintenance: '2023-12-10',
    image: 'https://images.unsplash.com/photo-1590502160462-237199464052?auto=format&fit=crop&q=80&w=300&h=300',
  },
  {
    id: 'AST-006',
    name: 'Packaging Unit Z1',
    category: 'Logistics',
    model: 'PackMaster 3000',
    serialNumber: 'PM-3000-Z1',
    installDate: '2021-06-01',
    location: 'Floor 2, Zone D',
    status: 'Offline',
    uptime: 95.0,
    lastMaintenance: '2023-08-15',
    nextMaintenance: '2024-02-15',
    image: 'https://images.unsplash.com/photo-1580983556856-14e39893d395?auto=format&fit=crop&q=80&w=300&h=300',
  }
];

export const TECHNICIANS: Technician[] = [
  { 
    id: 'Mike Ross', 
    name: 'Mike Ross', 
    role: 'Senior Mechanic', 
    status: 'Active', 
    email: 'mike.ross@optimaint.com',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150' 
  },
  { 
    id: 'Sarah Connor', 
    name: 'Sarah Connor', 
    role: 'Electrical Specialist', 
    status: 'Active', 
    email: 'sarah.connor@optimaint.com',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'John Doe', 
    name: 'John Doe', 
    role: 'General Maintenance', 
    status: 'Active', 
    email: 'john.doe@optimaint.com',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
  },
  { 
    id: 'Jane Smith', 
    name: 'Jane Smith', 
    role: 'Apprentice', 
    status: 'Inactive', 
    email: 'jane.smith@optimaint.com',
    // No image for testing fallback
  },
];

export const WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2345',
    title: 'Replace Hydraulic Seal',
    description: 'Leaking oil from main cylinder',
    assetId: 'AST-002',
    assetName: 'Hydraulic Press 50T',
    assignedTo: 'Mike Ross',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    type: 'Reactive',
    partsUsed: 'Hydraulic Oil (5L) x1'
  },
  {
    id: 'WO-2346',
    title: 'Quarterly Sensor Calibration',
    description: 'Routine calibration for precision sensors',
    assetId: 'AST-004',
    assetName: 'Industrial Robot Arm',
    assignedTo: 'Sarah Connor',
    priority: 'Medium',
    status: 'Pending',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString().split('T')[0],
    type: 'Preventive'
  },
  {
    id: 'WO-2347',
    title: 'Emergency: Motor Overheat',
    description: 'Motor temp > 90C, thermal cutoff activated',
    assetId: 'AST-003',
    assetName: 'Conveyor Belt System',
    assignedTo: 'John Doe',
    priority: 'Critical',
    status: 'In Progress',
    dueDate: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
    type: 'Reactive',
    partsUsed: 'Fuse 10A x2'
  },
  {
    id: 'WO-2348',
    title: 'Lubrication Check',
    assetId: 'AST-001',
    assetName: 'CNC Milling Machine X1',
    assignedTo: 'Jane Smith',
    priority: 'Low',
    status: 'Completed',
    dueDate: new Date(Date.now() - 5 * 86400000).toISOString().split('T')[0],
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    type: 'Preventive',
    partsUsed: 'Hydraulic Oil (5L) x1'
  },
  {
    id: 'WO-2350',
    title: 'Strange Noise during operation',
    description: 'Operator reported grinding noise',
    assetId: 'AST-001',
    assetName: 'CNC Milling Machine X1',
    assignedTo: '',
    priority: 'Medium',
    status: 'Requested',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    createdAt: new Date().toISOString().split('T')[0],
    type: 'Reactive'
  },
  // Previous months data for Chart Visualization
  {
    id: 'WO-2201',
    title: 'Belt Replacement',
    assetId: 'AST-003',
    assetName: 'Conveyor Belt System',
    assignedTo: 'Mike Ross',
    priority: 'Medium',
    status: 'Completed',
    dueDate: '2023-09-15',
    createdAt: '2023-09-10',
    type: 'Reactive',
    partsUsed: 'V-Belt A45 x1'
  },
   {
    id: 'WO-2202',
    title: 'Safety Guard Repair',
    assetId: 'AST-002',
    assetName: 'Hydraulic Press 50T',
    assignedTo: 'John Doe',
    priority: 'High',
    status: 'Completed',
    dueDate: '2023-08-20',
    createdAt: '2023-08-18',
    type: 'Reactive'
  }
];

export const PM_SCHEDULES: PMSchedule[] = [
  {
    id: 'PM-001',
    taskName: 'Weekly Belt Inspection',
    assetId: 'AST-003',
    assetName: 'Conveyor Belt System',
    frequencyDays: 7,
    lastRunDate: new Date(Date.now() - 7 * 86400000).toISOString().split('T')[0],
    nextDueDate: new Date().toISOString().split('T')[0],
    assignedTo: 'John Doe'
  },
  {
    id: 'PM-002',
    taskName: 'Monthly Hydraulic Filter Change',
    assetId: 'AST-002',
    assetName: 'Hydraulic Press 50T',
    frequencyDays: 30,
    lastRunDate: new Date(Date.now() - 25 * 86400000).toISOString().split('T')[0],
    nextDueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    assignedTo: 'Mike Ross'
  }
];

export const RECENT_ACTIVITY: ActivityLog[] = [
  { id: '1', action: 'Created WO-2350', user: 'Admin', timestamp: '10 mins ago', type: 'info' },
  { id: '2', action: 'AST-002 Status changed to Downtime', user: 'System', timestamp: '45 mins ago', type: 'error' },
  { id: '3', action: 'Completed WO-2348', user: 'Jane Smith', timestamp: '2 hours ago', type: 'success' },
  { id: '4', action: 'Low Stock Alert: Hydraulic Oil', user: 'Inventory Bot', timestamp: '4 hours ago', type: 'warning' },
];

export const PARTS: Part[] = [
  { id: 'PRT-001', name: 'Hydraulic Oil (5L)', sku: 'OIL-HYD-05', quantity: 8, unitPrice: 45.00, category: 'Fluids', image: 'https://images.unsplash.com/photo-1627932644673-c6c747796d84?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'PRT-002', name: 'Ball Bearing 50mm', sku: 'BRG-50-MM', quantity: 24, unitPrice: 12.50, category: 'Hardware', image: 'https://images.unsplash.com/photo-1596464716127-f9a085929533?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'PRT-003', name: 'V-Belt A45', sku: 'VBLT-A45', quantity: 15, unitPrice: 8.99, category: 'Belts' },
  { id: 'PRT-004', name: 'Fuse 10A', sku: 'FUSE-10A', quantity: 4, unitPrice: 1.50, category: 'Electrical', image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=150&h=150' },
  { id: 'PRT-005', name: 'Safety Sensor', sku: 'SENS-SAF-01', quantity: 12, unitPrice: 120.00, category: 'Sensors' },
  { id: 'PRT-006', name: 'M8 Bolts (Box)', sku: 'BLT-M8-100', quantity: 50, unitPrice: 5.00, category: 'Hardware' },
];