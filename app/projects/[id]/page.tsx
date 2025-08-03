'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare,
  Settings,
  User,
  Edit,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Upload
} from 'lucide-react';
import { cn } from '@/utils/cn';
import Link from 'next/link';

interface ProjectData {
  id: string;
  title: string;
  description: string | null;
  type: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN';
  status: 'DRAFT' | 'PLANNING' | 'EXECUTING' | 'REVIEW' | 'COMPLETED' | 'ON_HOLD';
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  team: {
    id: string;
    name: string;
    members: Array<{
      id: string;
      role: 'ADMIN' | 'MEMBER' | 'CLIENT';
      user: {
        id: string;
        name: string;
        email: string;
        avatarUrl: string | null;
      };
    }>;
  };
  client: {
    id: string;
    name: string;
    email: string | null;
    company: string | null;
  } | null;
  tasks: Array<{
    id: string;
    title: string;
    description: string | null;
    status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    dueDate: string | null;
    assignee: {
      id: string;
      name: string;
      avatarUrl: string | null;
    } | null;
    createdAt: string;
  }>;
  documents: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
  }>;
}

const tabs = [
  { id: 'tasks', label: 'Tasks', icon: CheckCircle },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'timeline', label: 'Timeline', icon: Calendar },
  { id: 'client', label: 'Client Info', icon: User },
];

export default function ProjectDetailPage() {
  const params = useParams();
  const projectId = params.id as string;
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      } else {
        setError('Project not found');
      }
    } catch (error) {
      console.error('Error fetching project:', error);
      setError('Failed to load project');
    } finally {
      setLoading(false);
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IT': return '💻';
      case 'CONSTRUCTION': return '🏗️';
      case 'INTERIOR_DESIGN': return '🎨';
      default: return '📁';
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'text-green-600',
      MEDIUM: 'text-yellow-600',
      HIGH: 'text-orange-600',
      CRITICAL: 'text-red-600',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-600';
  };

  const getTaskStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'IN_PROGRESS': return <div className="h-4 w-4 bg-blue-500 rounded-full animate-pulse" />;
      case 'REVIEW': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'DONE': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
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
              <div className="h-32 bg-white rounded-xl"></div>
              <div className="h-64 bg-white rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link href="/projects" className="text-blue-600 hover:text-blue-800">
                ← Back to Projects
              </Link>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Tasks</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
            
            <div className="space-y-3">
              {project.tasks.map((task) => (
                <div key={task.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getTaskStatusIcon(task.status)}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{task.title}</h4>
                        {task.description && (
                          <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className={getPriorityColor(task.priority)}>
                            {task.priority}
                          </span>
                          {task.dueDate && (
                            <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          )}
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    {task.assignee && (
                      <div className="flex items-center gap-2 ml-4">
                        <img
                          src={task.assignee.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${task.assignee.id}`}
                          alt={task.assignee.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span className="text-sm text-gray-600">{task.assignee.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {project.tasks.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No tasks yet. Create your first task to get started.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Project Documents</h3>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Upload className="h-4 w-4" />
                Upload Document
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.documents.map((doc) => (
                <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-500" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
                      <p className="text-xs text-gray-500">
                        Uploaded {new Date(doc.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              {project.documents.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No documents uploaded yet.</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'timeline':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Project Timeline</h3>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <h4 className="font-medium text-gray-900">Project Created</h4>
                    <p className="text-sm text-gray-600">
                      {new Date(project.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {project.deadline && (
                  <div className="flex items-center gap-4">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div>
                      <h4 className="font-medium text-gray-900">Project Deadline</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Detailed timeline view coming soon.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'client':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
            
            {project.client ? (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{project.client.name}</h4>
                      {project.client.company && (
                        <p className="text-gray-600">{project.client.company}</p>
                      )}
                      {project.client.email && (
                        <p className="text-sm text-gray-500">{project.client.email}</p>
                      )}
                    </div>
                  </div>
                  <button className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Client Assigned</h4>
                <p className="text-gray-600 mb-4">This project doesn't have a client assigned yet.</p>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Assign Client
                </button>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full max-w-6xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-6">
              <Link 
                href="/projects" 
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Projects
              </Link>
            </div>

            {/* Project Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center text-2xl">
                    {getTypeIcon(project.type)}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
                    {project.description && (
                      <p className="text-gray-600 mb-3">{project.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <span className={cn("px-3 py-1 rounded-full text-sm font-medium", getStatusColor(project.status))}>
                        {project.status.replace('_', ' ')}
                      </span>
                      <span className="text-sm text-gray-500">
                        {project.type.replace('_', ' ')}
                      </span>
                      {project.deadline && (
                        <span className="text-sm text-gray-500">
                          Due: {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Settings className="h-5 w-5" />
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    Edit Project
                  </button>
                </div>
              </div>

              {/* Team Info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Team: {project.team.name}</h3>
                    <div className="flex -space-x-2">
                      {project.team.members.slice(0, 5).map((member) => (
                        <img
                          key={member.id}
                          src={member.user.avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user.id}`}
                          alt={member.user.name}
                          className="w-8 h-8 rounded-full border-2 border-white"
                          title={member.user.name}
                        />
                      ))}
                      {project.team.members.length > 5 && (
                        <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">
                          +{project.team.members.length - 5}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      {project.tasks.length} task{project.tasks.length !== 1 ? 's' : ''}
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.documents.length} document{project.documents.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 mb-6">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => {
                  const IconComponent = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        "flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap border-b-2",
                        isActive
                          ? "text-blue-600 border-blue-600 bg-blue-50/50"
                          : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50/50"
                      )}
                    >
                      <IconComponent className="h-4 w-4" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab Content */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
              {renderTabContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}