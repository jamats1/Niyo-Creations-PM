// Project Management Types
export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'completed' | 'on-hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: Date;
  endDate?: Date;
  budget: number;
  clientId: string;
  teamMembers: string[];
  tags: string[];
  category: 'interior-design' | 'construction' | 'it' | 'consulting';
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  projectId: string;
  dueDate?: Date;
  estimatedHours: number;
  actualHours?: number;
  tags: string[];
  attachments: Attachment[];
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
  projects: string[];
  status: 'active' | 'inactive' | 'prospect';
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'designer' | 'developer' | 'contractor';
  department: 'interior-design' | 'construction' | 'it' | 'sales' | 'management';
  skills: string[];
  hourlyRate: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video' | 'other';
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

// Board Types (for Kanban board)
export type TypedColumn = 'todo' | 'in-progress' | 'review' | 'done';

export interface Column {
  id: TypedColumn;
  tasks: Task[];
}

export interface Board {
  columns: Map<TypedColumn, Column>;
}

// Dashboard Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  totalClients: number;
  activeClients: number;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ProjectProgress {
  projectId: string;
  projectName: string;
  progress: number;
  status: Project['status'];
  dueDate: Date;
}

// Form Types
export interface TaskFormData {
  title: string;
  description: string;
  status: Task['status'];
  priority: Task['priority'];
  assigneeId?: string;
  projectId: string;
  dueDate?: Date;
  estimatedHours: number;
  tags: string[];
}

export interface ProjectFormData {
  name: string;
  description: string;
  status: Project['status'];
  priority: Project['priority'];
  startDate: Date;
  endDate?: Date;
  budget: number;
  clientId: string;
  teamMembers: string[];
  tags: string[];
  category: Project['category'];
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company: string;
  address: Address;
  status: Client['status'];
  notes: string;
}

// Filter and Search Types
export interface FilterOptions {
  status?: string[];
  priority?: string[];
  assignee?: string[];
  project?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
}

export interface SearchParams {
  query: string;
  filters: FilterOptions;
  sortBy: 'createdAt' | 'dueDate' | 'priority' | 'status' | 'title';
  sortOrder: 'asc' | 'desc';
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: Date;
}

// Calendar Types
export interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'task' | 'meeting' | 'deadline' | 'milestone';
  projectId?: string;
  taskId?: string;
  color: string;
}

// Report Types
export interface TimeReport {
  id: string;
  userId: string;
  taskId: string;
  projectId: string;
  hours: number;
  date: Date;
  description: string;
  createdAt: Date;
}

export interface ProjectReport {
  projectId: string;
  projectName: string;
  totalHours: number;
  budget: number;
  actualCost: number;
  progress: number;
  tasks: {
    completed: number;
    total: number;
  };
  teamMembers: {
    userId: string;
    hours: number;
  }[];
} 