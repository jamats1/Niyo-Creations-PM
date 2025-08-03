'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Plus, Filter, Search, Calendar, Users, DollarSign, Tag, ArrowRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useModalStore } from '@/store/modalStore';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string | null;
  type: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN';
  status: 'DRAFT' | 'PLANNING' | 'EXECUTING' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
  deadline: string | null;
  createdAt: string;
  team: {
    id: string;
    name: string;
    members: Array<{
      user: {
        id: string;
        name: string;
        avatarUrl: string | null;
      };
    }>;
  };
  client: {
    id: string;
    name: string;
    company: string | null;
  } | null;
  tasks: Array<{
    id: string;
    status: string;
  }>;
  documents: Array<{
    id: string;
  }>;
}

export default function ProjectsPage() {
  const { openProjectModal } = useModalStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DRAFT': return 'bg-gray-100 text-gray-800';
      case 'PLANNING': return 'bg-blue-100 text-blue-800';
      case 'EXECUTING': return 'bg-yellow-100 text-yellow-800';
      case 'REVIEW': return 'bg-purple-100 text-purple-800';
      case 'COMPLETED': return 'bg-green-100 text-green-800';
      case 'ON_HOLD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IT': return '💻';
      case 'CONSTRUCTION': return '🏗️';
      case 'INTERIOR_DESIGN': return '🎨';
      default: return '📁';
    }
  };

  const getTaskStats = (tasks: Array<{status: string}>) => {
    const completed = tasks.filter(task => task.status === 'DONE').length;
    const total = tasks.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Projects</h1>
                  <p className="text-gray-600">Manage and track all your projects</p>
                </div>
                <button 
                  onClick={() => openProjectModal()}
                  className="btn btn-primary flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>New Project</span>
                </button>
              </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div className="flex gap-4">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="DRAFT">Draft</option>
                    <option value="PLANNING">Planning</option>
                    <option value="EXECUTING">Executing</option>
                    <option value="REVIEW">Review</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const taskStats = getTaskStats(project.tasks);
                
                return (
                  <Link key={project.id} href={`/projects/${project.id}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group">
                      <div className="p-6">
                        {/* Project Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-3 flex-1">
                            <div className="text-2xl">{getTypeIcon(project.type)}</div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                                {project.title}
                              </h3>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {project.description || 'No description provided'}
                              </p>
                            </div>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </div>

                        {/* Status and Type */}
                        <div className="flex gap-2 mb-4">
                          <span className={cn("px-3 py-1 rounded-full text-xs font-medium", getStatusColor(project.status))}>
                            {project.status.replace('_', ' ')}
                          </span>
                          <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                            {project.type.replace('_', ' ')}
                          </span>
                        </div>

                        {/* Project Details */}
                        <div className="space-y-3 mb-4">
                          {project.deadline && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>Due: {new Date(project.deadline).toLocaleDateString()}</span>
                            </div>
                          )}

                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2 text-gray-400" />
                            <span>{project.team.members.length} team member{project.team.members.length !== 1 ? 's' : ''}</span>
                          </div>

                          {project.client && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Tag className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{project.client.name}</span>
                            </div>
                          )}
                        </div>

                        {/* Task Progress */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                            <span>Task Progress</span>
                            <span>{taskStats.completed}/{taskStats.total}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${taskStats.percentage}%` }}
                            ></div>
                          </div>
                        </div>

                        {/* Team Avatars */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}</span>
                            <span>•</span>
                            <span>{project.documents.length} file{project.documents.length !== 1 ? 's' : ''}</span>
                          </div>
                          
                          <div className="flex -space-x-2">
                            {project.team.members.slice(0, 3).map((member) => (
                              <img
                                key={member.user.id}
                                src={member.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.id}`}
                                alt={member.user.name}
                                className="w-7 h-7 rounded-full border-2 border-white"
                                title={member.user.name}
                              />
                            ))}
                            {project.team.members.length > 3 && (
                              <div className="w-7 h-7 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                                +{project.team.members.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 