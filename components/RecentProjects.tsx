'use client';

import { Project } from '@/types';
import { Calendar, Users, DollarSign, Clock, MoreVertical } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/utils/cn';

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Modern Office Interior Design',
    description: 'Complete interior redesign for tech startup office space',
    status: 'in-progress',
    priority: 'high',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-03-15'),
    budget: 75000,
    clientId: 'client-1',
    teamMembers: ['user-1', 'user-2', 'user-3'],
    tags: ['interior-design', 'office', 'modern'],
    category: 'interior-design',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '2',
    name: 'E-commerce Website Development',
    description: 'Full-stack e-commerce platform with payment integration',
    status: 'planning',
    priority: 'urgent',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-04-30'),
    budget: 45000,
    clientId: 'client-2',
    teamMembers: ['user-4', 'user-5'],
    tags: ['web-development', 'e-commerce', 'react'],
    category: 'it',
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '3',
    name: 'Kitchen Renovation Project',
    description: 'Complete kitchen remodel with custom cabinetry',
    status: 'completed',
    priority: 'medium',
    startDate: new Date('2023-11-01'),
    endDate: new Date('2024-01-15'),
    budget: 35000,
    clientId: 'client-3',
    teamMembers: ['user-6', 'user-7'],
    tags: ['construction', 'kitchen', 'renovation'],
    category: 'construction',
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    name: 'Mobile App Development',
    description: 'Cross-platform mobile app for fitness tracking',
    status: 'in-progress',
    priority: 'high',
    startDate: new Date('2024-01-20'),
    endDate: new Date('2024-05-20'),
    budget: 60000,
    clientId: 'client-4',
    teamMembers: ['user-8', 'user-9', 'user-10'],
    tags: ['mobile-app', 'fitness', 'react-native'],
    category: 'it',
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-22'),
  },
];

const getStatusColor = (status: Project['status']) => {
  switch (status) {
    case 'planning':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-yellow-100 text-yellow-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'on-hold':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityColor = (priority: Project['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getCategoryColor = (category: Project['category']) => {
  switch (category) {
    case 'interior-design':
      return 'bg-purple-100 text-purple-800';
    case 'construction':
      return 'bg-orange-100 text-orange-800';
    case 'it':
      return 'bg-blue-100 text-blue-800';
    case 'consulting':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function RecentProjects() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {mockProjects.map((project) => (
          <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {project.name}
                  </h3>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getStatusColor(project.status)
                  )}>
                    {project.status.replace('-', ' ')}
                  </span>
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    getPriorityColor(project.priority)
                  )}>
                    {project.priority}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-3">
                  {project.description}
                </p>

                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {format(project.startDate, 'MMM dd')} - {project.endDate ? format(project.endDate, 'MMM dd, yyyy') : 'Ongoing'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{project.teamMembers.length} members</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${project.budget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                      getCategoryColor(project.category)
                    )}>
                      {project.category.replace('-', ' ')}
                    </span>
                    {project.tags.slice(0, 2).map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 