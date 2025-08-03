'use client';

import { useState, useEffect } from 'react';
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

interface DashboardStatsData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    overdueTasks: number;
    activeClients: number;
    totalRevenue: number;
    projectCompletionRate: number;
    taskCompletionRate: number;
  };
}

export default function DashboardStats() {
  const [statsData, setStatsData] = useState<DashboardStatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStatsData(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="animate-pulse">
              <div className="h-10 w-10 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-100 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Projects',
      value: statsData?.overview.totalProjects.toString() || '0',
      change: '+12%',
      changeType: 'positive',
      icon: FolderOpen,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Projects',
      value: statsData?.overview.activeProjects.toString() || '0',
      change: '+8%',
      changeType: 'positive',
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Total Tasks',
      value: statsData?.overview.totalTasks.toString() || '0',
      change: `${statsData?.overview.taskCompletionRate || 0}% complete`,
      changeType: 'neutral',
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Overdue Tasks',
      value: statsData?.overview.overdueTasks.toString() || '0',
      change: statsData?.overview.overdueTasks ? 'Needs attention' : 'All on track',
      changeType: statsData?.overview.overdueTasks ? 'negative' : 'positive',
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Active Clients',
      value: statsData?.overview.activeClients.toString() || '0',
      change: '+5%',
      changeType: 'positive',
      icon: Users,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
    },
    {
      name: 'Monthly Revenue',
      value: `$${(statsData?.overview.totalRevenue || 0).toLocaleString()}`,
      change: '+18%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-emerald-500',
      bgColor: 'bg-emerald-50',
    },
  ];

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
                  ) : stat.changeType === 'negative' ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : null}
                  <span className={cn(
                    "text-sm font-medium",
                    stat.changeType === 'positive' ? "text-green-600" : 
                    stat.changeType === 'negative' ? "text-red-600" : "text-gray-600"
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