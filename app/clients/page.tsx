'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { 
  Plus, 
  Search, 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Edit, 
  Trash2,
  MoreHorizontal,
  Calendar,
  FileText,
  TrendingUp
} from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import Link from 'next/link';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  projects: Array<{
    id: string;
    title: string;
    type: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN';
    status: 'DRAFT' | 'PLANNING' | 'EXECUTING' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
    deadline: string | null;
    tasks: Array<{
      id: string;
      status: string;
    }>;
  }>;
}

export default function ClientsPage() {
  const { openClientModal } = useModalStore();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client => {
    const searchText = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(searchText) ||
      client.email?.toLowerCase().includes(searchText) ||
      client.company?.toLowerCase().includes(searchText)
    );
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IT': return '💻';
      case 'CONSTRUCTION': return '🏗️';
      case 'INTERIOR_DESIGN': return '🎨';
      default: return '📁';
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PLANNING: 'bg-blue-100 text-blue-800',
      EXECUTING: 'bg-yellow-100 text-yellow-800',
      REVIEW: 'bg-purple-100 text-purple-800',
      COMPLETED: 'bg-green-100 text-green-800',
      ON_HOLD: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getClientStats = (client: Client) => {
    const totalProjects = client.projects.length;
    const activeProjects = client.projects.filter(p => 
      ['PLANNING', 'EXECUTING', 'REVIEW'].includes(p.status)
    ).length;
    const completedProjects = client.projects.filter(p => p.status === 'COMPLETED').length;
    const totalTasks = client.projects.reduce((acc, project) => acc + project.tasks.length, 0);
    const completedTasks = client.projects.reduce((acc, project) => 
      acc + project.tasks.filter(task => task.status === 'DONE').length, 0
    );

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="h-6 bg-gray-200 rounded mb-4"></div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-100 rounded"></div>
                      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Client Management</h1>
                  <p className="text-slate-600">Manage your client relationships and track project progress</p>
                </div>
                <button 
                  onClick={() => openClientModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Client
                </button>
              </div>
            </div>

            {/* Search and Stats */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{clients.length} Total Clients</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>{clients.filter(c => c.company).length} Companies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>{clients.reduce((acc, c) => acc + c.projects.length, 0)} Projects</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => {
                const stats = getClientStats(client);
                
                return (
                  <div key={client.id} className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 group">
                    <div className="p-6">
                      {/* Client Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                            <User className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {client.name}
                            </h3>
                            {client.company && (
                              <p className="text-sm text-gray-600">{client.company}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openClientModal(client.id)}
                            className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors"
                            title="Edit client"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 rounded transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-2 mb-4">
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{client.email}</span>
                          </div>
                        )}
                        {client.phone && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{client.phone}</span>
                          </div>
                        )}
                      </div>

                      {/* Project Stats */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                          <div>
                            <div className="text-lg font-semibold text-gray-900">{stats.totalProjects}</div>
                            <div className="text-xs text-gray-600">Total Projects</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-blue-600">{stats.activeProjects}</div>
                            <div className="text-xs text-gray-600">Active</div>
                          </div>
                        </div>
                        
                        {stats.totalTasks > 0 && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                              <span>Task Progress</span>
                              <span>{stats.completionRate}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${stats.completionRate}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Recent Projects */}
                      {client.projects.length > 0 ? (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-medium text-gray-900">Recent Projects</h4>
                            <span className="text-xs text-gray-500">{client.projects.length} total</span>
                          </div>
                          <div className="space-y-2">
                            {client.projects.slice(0, 2).map((project) => (
                              <Link key={project.id} href={`/projects/${project.id}`}>
                                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group">
                                  <div className="flex items-center gap-2 flex-1">
                                    <span className="text-sm">{getTypeIcon(project.type)}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
                                        {project.title}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                          {project.status.replace('_', ' ')}
                                        </span>
                                        {project.deadline && (
                                          <span className="text-xs text-gray-500">
                                            Due {new Date(project.deadline).toLocaleDateString()}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            ))}
                            {client.projects.length > 2 && (
                              <div className="text-center">
                                <span className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer">
                                  +{client.projects.length - 2} more projects
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          <FileText className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No projects yet</p>
                          <button className="text-xs text-blue-600 hover:text-blue-800 mt-1">
                            Create first project
                          </button>
                        </div>
                      )}

                      {/* Client Since */}
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Client since {new Date(client.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{stats.completedProjects} completed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredClients.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <User className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchQuery ? 'No clients found' : 'No clients yet'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery 
                    ? 'Try adjusting your search terms' 
                    : 'Start building your client relationships by adding your first client'
                  }
                </p>
                {!searchQuery && (
                  <button 
                    onClick={() => openClientModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Add Your First Client
                  </button>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}