'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { cn } from '@/utils/cn';

const stats = [
  {
    name: 'Total Projects',
    value: '24',
    change: '+12%',
    changeType: 'positive',
    icon: FolderOpen,
    color: 'bg-blue-500',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Active Projects',
    value: '18',
    change: '+8%',
    changeType: 'positive',
    icon: CheckCircle,
    color: 'bg-green-500',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Total Tasks',
    value: '156',
    change: '+23%',
    changeType: 'positive',
    icon: Clock,
    color: 'bg-purple-500',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Overdue Tasks',
    value: '8',
    change: '-15%',
    changeType: 'negative',
    icon: AlertTriangle,
    color: 'bg-red-500',
    bgColor: 'bg-red-50',
  },
  {
    name: 'Active Clients',
    value: '32',
    change: '+5%',
    changeType: 'positive',
    icon: Users,
    color: 'bg-indigo-500',
    bgColor: 'bg-indigo-50',
  },
  {
    name: 'Monthly Revenue',
    value: '$45,230',
    change: '+18%',
    changeType: 'positive',
    icon: DollarSign,
    color: 'bg-emerald-500',
    bgColor: 'bg-emerald-50',
  },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <div className={cn(
                  "p-2 rounded-lg",
                  stat.bgColor
                )}>
                  <stat.icon className={cn(
                    "h-5 w-5",
                    stat.color.replace('bg-', 'text-')
                  )} />
                </div>
                <div className="flex items-center space-x-1">
                  {stat.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                  <span className={cn(
                    "text-sm font-medium",
                    stat.changeType === 'positive' ? "text-green-600" : "text-red-600"
                  )}>
                    {stat.change}
                  </span>
                </div>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-1">
                {stat.value}
              </p>
              
              <p className="text-sm text-gray-600">
                {stat.name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 