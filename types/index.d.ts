// Industry-focused Project Management Types
export interface Project {
  id: string;
  title: string;
  description: string | null;
  type: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN';
  status: 'DRAFT' | 'PLANNING' | 'EXECUTING' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
  teamId: string;
  clientId: string | null;
  deadline: Date | null;
  team: Team;
  client: Client | null;
  tasks: Task[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: Date | null;
  assignedTo: string | null;
  projectId: string;
  assignee: User | null;
  project: Project;
  createdAt: Date;
  updatedAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  projectId: string;
  project: Project;
  uploadedAt: Date;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MEMBER' | 'CLIENT';
  avatarUrl: string | null;
  teams: TeamMember[];
  tasks: Task[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: 'ADMIN' | 'MEMBER' | 'CLIENT';
  user: User;
  team: Team;
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
export type TypedColumn = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

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