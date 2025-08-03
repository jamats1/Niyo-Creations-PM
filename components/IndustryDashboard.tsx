'use client';

import { useState, useEffect } from 'react';
import { 
  Building2, 
  Code, 
  Palette, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  FileText,
  DollarSign
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  teamMembers: number;
  clientsActive: number;
  totalRevenue: number;
  clientSatisfaction: number;
  teamUtilization: number;
}

interface IndustryDashboardProps {
  industry?: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN' | 'ALL';
}

export default function IndustryDashboard({ industry = 'ALL' }: IndustryDashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    overdueTasks: 0,
    teamMembers: 0,
    clientsActive: 0,
    totalRevenue: 0,
    clientSatisfaction: 0,
    teamUtilization: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [industry]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        const overview = data.overview;
        const performance = data.performance;
        const teamInsights = data.teamInsights;
        
        // Map API response to component state
        setStats({
          totalProjects: overview.totalProjects,
          activeProjects: overview.activeProjects,
          completedProjects: overview.totalProjects - overview.activeProjects,
          totalTasks: overview.totalTasks,
          completedTasks: Math.round(overview.totalTasks * (overview.taskCompletionRate / 100)),
          overdueTasks: overview.overdueTasks,
          teamMembers: teamInsights?.totalMembers || 0,
          clientsActive: overview.activeClients,
          totalRevenue: overview.totalRevenue,
          clientSatisfaction: performance.clientSatisfaction,
          teamUtilization: teamInsights?.utilization || 0,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIndustryConfig = () => {
    switch (industry) {
      case 'IT':
        return {
          title: 'IT Agency Dashboard',
          subtitle: 'Software development and technical projects',
          icon: Code,
          color: 'blue',
          specialMetrics: [
            { label: 'Sprint Velocity', value: '42 pts', icon: TrendingUp },
            { label: 'Code Reviews', value: '23', icon: CheckCircle },
            { label: 'Deployments', value: '8', icon: Clock },
          ]
        };
      case 'CONSTRUCTION':
        return {
          title: 'Construction Dashboard',
          subtitle: 'Building projects and site management',
          icon: Building2,
          color: 'orange',
          specialMetrics: [
            { label: 'Sites Active', value: '6', icon: Building2 },
            { label: 'Safety Incidents', value: '0', icon: AlertTriangle },
            { label: 'Budget Variance', value: '+2.3%', icon: DollarSign },
          ]
        };
      case 'INTERIOR_DESIGN':
        return {
          title: 'Interior Design Studio',
          subtitle: 'Creative projects and client spaces',
          icon: Palette,
          color: 'purple',
          specialMetrics: [
            { label: 'Design Concepts', value: '15', icon: Palette },
            { label: 'Client Approvals', value: '12', icon: CheckCircle },
            { label: 'Site Visits', value: '7', icon: Calendar },
          ]
        };
      default:
        return {
          title: 'Project Management Dashboard',
          subtitle: 'All industries overview',
          icon: FileText,
          color: 'gray',
          specialMetrics: [
            { label: 'Total Revenue', value: `$${Math.round(stats.totalRevenue || 0).toLocaleString()}`, icon: DollarSign },
            { label: 'Client Satisfaction', value: `${stats.clientSatisfaction || 0}%`, icon: TrendingUp },
            { label: 'Team Utilization', value: `${stats.teamUtilization || 0}%`, icon: Users },
          ]
        };
    }
  };

  const config = getIndustryConfig();
  const IconComponent = config.icon;

  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-700',
      icon: 'text-blue-600',
    },
    orange: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      text: 'text-orange-700',
      icon: 'text-orange-600',
    },
    purple: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      text: 'text-purple-700',
      icon: 'text-purple-600',
    },
    gray: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      text: 'text-gray-700',
      icon: 'text-gray-600',
    },
  };

  const colors = colorClasses[config.color as keyof typeof colorClasses];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  const mainStats = [
    {
      label: 'Active Projects',
      value: stats.activeProjects,
      total: stats.totalProjects,
      icon: FileText,
      color: 'blue',
    },
    {
      label: 'Tasks Completed',
      value: stats.completedTasks,
      total: stats.totalTasks,
      icon: CheckCircle,
      color: 'green',
    },
    {
      label: 'Team Members',
      value: stats.teamMembers,
      icon: Users,
      color: 'purple',
    },
    {
      label: 'Active Clients',
      value: stats.clientsActive,
      icon: Building2,
      color: 'orange',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Industry Header */}
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
        <div className="flex items-center space-x-4">
          <div className={`p-3 ${colors.bg} rounded-lg`}>
            <IconComponent className={`h-8 w-8 ${colors.icon}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${colors.text}`}>{config.title}</h2>
            <p className="text-gray-600">{config.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => {
          const StatIcon = stat.icon;
          const progress = stat.total ? (stat.value / stat.total) * 100 : 0;
          
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 bg-${stat.color}-50 rounded-lg`}>
                  <StatIcon className={`h-5 w-5 text-${stat.color}-600`} />
                </div>
                {stat.total && (
                  <span className="text-xs text-gray-500">
                    {stat.value}/{stat.total}
                  </span>
                )}
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.label}</p>
                {stat.total && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`bg-${stat.color}-500 h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Industry-Specific Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {config.specialMetrics.map((metric, index) => {
          const MetricIcon = metric.icon;
          return (
            <div key={index} className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${colors.bg} rounded-lg`}>
                  <MetricIcon className={`h-5 w-5 ${colors.icon}`} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{metric.value}</h4>
                  <p className="text-sm text-gray-600">{metric.label}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Overdue Tasks Alert */}
      {stats.overdueTasks > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-6 w-6 text-red-600" />
            <div>
              <h4 className="text-lg font-semibold text-red-900">
                {stats.overdueTasks} Overdue Task{stats.overdueTasks !== 1 ? 's' : ''}
              </h4>
              <p className="text-red-700">These tasks need immediate attention</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}