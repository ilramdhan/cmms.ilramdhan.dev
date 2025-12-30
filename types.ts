export type AssetStatus = 'Running' | 'Downtime' | 'Maintenance' | 'Offline';

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type WorkOrderStatus = 'Requested' | 'Pending' | 'In Progress' | 'Completed' | 'On Hold';

export interface Asset {
  id: string;
  name: string;
  category: string;
  model: string;
  serialNumber: string;
  installDate: string;
  location: string;
  status: AssetStatus;
  uptime: number; // Percentage
  lastMaintenance: string;
  nextMaintenance: string;
  image: string;
}

export interface WorkOrder {
  id: string;
  title: string;
  description?: string;
  assetId: string;
  assetName: string;
  assignedTo: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  dueDate: string;
  createdAt: string;
  type?: 'Reactive' | 'Preventive';
  partsUsed?: string; // Format: "PRT-001:2" (PartID:Qty) -> Simple text for demo integration
}

export interface PMSchedule {
  id: string;
  taskName: string;
  assetId: string;
  assetName: string;
  frequencyDays: number;
  lastRunDate: string;
  nextDueDate: string;
  assignedTo: string;
}

export interface Part {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  category: string;
}

export interface Technician {
  id: string;
  name: string;
  role: string;
  status: 'Active' | 'Inactive';
  email: string;
}

export interface KpiData {
  totalAssets: number;
  activeWorkOrders: number;
  lowStockItems: number;
  mtbf: number;
}

export interface ChartDataPoint {
  month: string;
  completed: number;
  backlog: number;
  costs: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export interface Notification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}