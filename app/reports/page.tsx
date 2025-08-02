'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { BarChart3, TrendingUp, TrendingDown, Calendar, Users, DollarSign, FileText, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalTasks: number;
  overdueTasks: number;
  activeClients: number;
  totalRevenue: number;
  trends: {
    projects: number;
    activeProjects: number;
    tasks: number;
    overdueTasks: number;
    clients: number;
    revenue: number;
  };
  projectStatusDistribution: Array<{
    status: string;
    _count: number;
  }>;
  taskStatusDistribution: Array<{
    status: string;
    _count: number;
  }>;
}

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const projectStatusData = stats?.projectStatusDistribution.map(item => ({
    name: item.status.replace('_', ' '),
    value: item._count,
  })) || [];

  const taskStatusData = stats?.taskStatusDistribution.map(item => ({
    name: item.status.replace('_', ' '),
    value: item._count,
  })) || [];

  const monthlyData = [
    { month: 'Jan', projects: 4, tasks: 45, revenue: 25000 },
    { month: 'Feb', projects: 6, tasks: 52, revenue: 32000 },
    { month: 'Mar', projects: 8, tasks: 61, revenue: 38000 },
    { month: 'Apr', projects: 7, tasks: 58, revenue: 35000 },
    { month: 'May', projects: 9, tasks: 67, revenue: 42000 },
    { month: 'Jun', projects: 12, tasks: 78, revenue: 48000 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
                  <p className="text-gray-600">Comprehensive insights into your project performance</p>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={selectedPeriod}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="quarter">This Quarter</option>
                    <option value="year">This Year</option>
                  </select>
                  <button className="btn btn-primary flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Export Report</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalProjects || 0}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stats?.trends.projects && stats.trends.projects > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stats?.trends.projects && stats.trends.projects > 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stats?.trends.projects && stats.trends.projects > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.trends.projects}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {stats?.trends.projects}%
                    </span>
                  )}
                  <span className="text-gray-600 ml-2">from last period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalTasks || 0}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stats?.trends.tasks && stats.trends.tasks > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stats?.trends.tasks && stats.trends.tasks > 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stats?.trends.tasks && stats.trends.tasks > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.trends.tasks}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {stats?.trends.tasks}%
                    </span>
                  )}
                  <span className="text-gray-600 ml-2">from last period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.activeClients || 0}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stats?.trends.clients && stats.trends.clients > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stats?.trends.clients && stats.trends.clients > 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stats?.trends.clients && stats.trends.clients > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.trends.clients}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {stats?.trends.clients}%
                    </span>
                  )}
                  <span className="text-gray-600 ml-2">from last period</span>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">${(stats?.totalRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stats?.trends.revenue && stats.trends.revenue > 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                    {stats?.trends.revenue && stats.trends.revenue > 0 ? (
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    ) : (
                      <TrendingDown className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  {stats?.trends.revenue && stats.trends.revenue > 0 ? (
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      +{stats.trends.revenue}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-4 w-4 mr-1" />
                      {stats?.trends.revenue}%
                    </span>
                  )}
                  <span className="text-gray-600 ml-2">from last period</span>
                </div>
              </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Project Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={projectStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {projectStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Task Status Distribution */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={taskStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Monthly Trends */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line yAxisId="left" type="monotone" dataKey="projects" stroke="#3B82F6" name="Projects" />
                  <Line yAxisId="left" type="monotone" dataKey="tasks" stroke="#10B981" name="Tasks" />
                  <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#F59E0B" name="Revenue ($)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Project Performance</h3>
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completion Rate</span>
                    <span className="text-sm font-medium text-gray-900">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">On-Time Delivery</span>
                    <span className="text-sm font-medium text-gray-900">92%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Client Satisfaction</span>
                    <span className="text-sm font-medium text-gray-900">4.8/5</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Team Productivity</h3>
                  <Users className="h-5 w-5 text-green-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="text-sm font-medium text-gray-900">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hours Logged</span>
                    <span className="text-sm font-medium text-gray-900">1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Efficiency</span>
                    <span className="text-sm font-medium text-gray-900">94%</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Financial Overview</h3>
                  <DollarSign className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Revenue</span>
                    <span className="text-sm font-medium text-gray-900">${stats?.totalRevenue?.toLocaleString() || '0'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg. Project Value</span>
                    <span className="text-sm font-medium text-gray-900">$45,230</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Profit Margin</span>
                    <span className="text-sm font-medium text-gray-900">32%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 