'use client';

import { 
  Plus, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Calendar,
  FileText,
  BarChart3
} from 'lucide-react';
import { useModalStore } from '@/store/modalStore';

const actions = [
  {
    name: 'New Project',
    description: 'Create a new project',
    icon: FolderOpen,
    color: 'bg-blue-500',
    action: () => {
      // Open project modal
      console.log('Open new project modal');
    },
  },
  {
    name: 'New Task',
    description: 'Add a new task',
    icon: CheckSquare,
    color: 'bg-green-500',
    action: () => {
      // Open task modal
      console.log('Open new task modal');
    },
  },
  {
    name: 'New Client',
    description: 'Add a new client',
    icon: Users,
    color: 'bg-purple-500',
    action: () => {
      // Open client modal
      console.log('Open new client modal');
    },
  },
  {
    name: 'Schedule Meeting',
    description: 'Schedule a team meeting',
    icon: Calendar,
    color: 'bg-orange-500',
    action: () => {
      // Open calendar modal
      console.log('Open calendar modal');
    },
  },
  {
    name: 'Create Report',
    description: 'Generate project report',
    icon: BarChart3,
    color: 'bg-indigo-500',
    action: () => {
      // Open report modal
      console.log('Open report modal');
    },
  },
  {
    name: 'Upload Document',
    description: 'Upload project documents',
    icon: FileText,
    color: 'bg-gray-500',
    action: () => {
      // Open file upload modal
      console.log('Open file upload modal');
    },
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
        <p className="text-sm text-gray-600 mt-1">
          Common tasks and shortcuts
        </p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3">
          {actions.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className="flex items-center space-x-3 p-3 text-left rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} text-white group-hover:scale-105 transition-transform`}>
                <action.icon className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {action.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {action.description}
                </p>
              </div>
              <Plus className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 