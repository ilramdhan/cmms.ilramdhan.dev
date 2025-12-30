import { Asset, WorkOrder, KpiData, ChartDataPoint, ActivityLog, Part, Technician, PMSchedule } from './types';

export const KPI_DATA: KpiData = {
  totalAssets: 142,
  activeWorkOrders: 18,
  lowStockItems: 5,
  mtbf: 320,
};

export const CHART_DATA: ChartDataPoint[] = [
  { month: 'Jan', completed: 45, backlog: 12, costs: 4200 },
  { month: 'Feb', completed: 52, backlog: 8, costs: 3800 },
  { month: 'Mar', completed: 48, backlog: 15, costs: 5100 },
  { month: 'Apr', completed: 61, backlog: 5, costs: 4500 },
  { month: 'May', completed: 55, backlog: 10, costs: 4800 },
  { month: 'Jun', completed: 67, backlog: 4, costs: 4100 },
];

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
    image: 'https://picsum.photos/200/200?random=1',
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
    image: 'https://picsum.photos/200/200?random=2',
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
    image: 'https://picsum.photos/200/200?random=3',
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
    image: 'https://picsum.photos/200/200?random=4',
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
    image: 'https://picsum.photos/200/200?random=5',
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
    dueDate: '2023-10-28',
    createdAt: '2023-10-26',
    type: 'Reactive'
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
    dueDate: '2023-11-01',
    createdAt: '2023-10-27',
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
    dueDate: '2023-10-27',
    createdAt: '2023-10-27',
    type: 'Reactive'
  },
  {
    id: 'WO-2348',
    title: 'Lubrication Check',
    assetId: 'AST-001',
    assetName: 'CNC Milling Machine X1',
    assignedTo: 'Jane Smith',
    priority: 'Low',
    status: 'Completed',
    dueDate: '2023-10-25',
    createdAt: '2023-10-24',
    type: 'Preventive'
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
    dueDate: '2023-11-01',
    createdAt: '2023-10-28',
    type: 'Reactive'
  },
];

export const PM_SCHEDULES: PMSchedule[] = [
  {
    id: 'PM-001',
    taskName: 'Weekly Belt Inspection',
    assetId: 'AST-003',
    assetName: 'Conveyor Belt System',
    frequencyDays: 7,
    lastRunDate: '2023-10-20',
    nextDueDate: '2023-10-27',
    assignedTo: 'John Doe'
  },
  {
    id: 'PM-002',
    taskName: 'Monthly Hydraulic Filter Change',
    assetId: 'AST-002',
    assetName: 'Hydraulic Press 50T',
    frequencyDays: 30,
    lastRunDate: '2023-09-25',
    nextDueDate: '2023-10-25',
    assignedTo: 'Mike Ross'
  }
];

export const RECENT_ACTIVITY: ActivityLog[] = [
  { id: '1', action: 'Created WO-2349', user: 'Admin', timestamp: '10 mins ago', type: 'info' },
  { id: '2', action: 'AST-002 Status changed to Downtime', user: 'System', timestamp: '45 mins ago', type: 'error' },
  { id: '3', action: 'Completed WO-2348', user: 'Jane Smith', timestamp: '2 hours ago', type: 'success' },
  { id: '4', action: 'Low Stock Alert: Hydraulic Oil', user: 'Inventory Bot', timestamp: '4 hours ago', type: 'warning' },
];

export const PARTS: Part[] = [
  { id: 'PRT-001', name: 'Hydraulic Oil (5L)', sku: 'OIL-HYD-05', quantity: 24, unitPrice: 45.00, category: 'Fluids' },
  { id: 'PRT-002', name: 'Ball Bearing 50mm', sku: 'BRG-50-MM', quantity: 8, unitPrice: 12.50, category: 'Hardware' },
  { id: 'PRT-003', name: 'V-Belt A45', sku: 'VBLT-A45', quantity: 15, unitPrice: 8.99, category: 'Belts' },
  { id: 'PRT-004', name: 'Fuse 10A', sku: 'FUSE-10A', quantity: 4, unitPrice: 1.50, category: 'Electrical' },
  { id: 'PRT-005', name: 'Safety Sensor', sku: 'SENS-SAF-01', quantity: 12, unitPrice: 120.00, category: 'Sensors' },
];

export const TECHNICIANS: Technician[] = [
  { id: 'T-001', name: 'Mike Ross', role: 'Senior Mechanic', status: 'Active', email: 'mike.ross@optimaint.com' },
  { id: 'T-002', name: 'Sarah Connor', role: 'Electrical Specialist', status: 'Active', email: 'sarah.connor@optimaint.com' },
  { id: 'T-003', name: 'John Doe', role: 'General Maintenance', status: 'Active', email: 'john.doe@optimaint.com' },
  { id: 'T-004', name: 'Jane Smith', role: 'Apprentice', status: 'Inactive', email: 'jane.smith@optimaint.com' },
];