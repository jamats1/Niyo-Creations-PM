'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Plus, Search, Mail, Phone, Building, MapPin, Calendar, DollarSign } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  notes: string;
  createdAt: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  } | null;
  projects: Array<{
    project: {
      id: string;
      name: string;
      status: string;
      priority: string;
    };
  }>;
  _count: {
    projects: number;
    comments: number;
    activities: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (client.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'PROSPECT': return 'bg-blue-100 text-blue-800';
      case 'FORMER': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'URGENT': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Clients</h1>
                  <p className="text-gray-600">Manage your client relationships and contacts</p>
                </div>
                <button className="btn btn-primary flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Client</span>
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
                      placeholder="Search clients by name, email, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="PROSPECT">Prospect</option>
                    <option value="FORMER">Former</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clients Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <div key={client.id} className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Client Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{client.name}</h3>
                        {client.company && (
                          <p className="text-sm text-gray-600 flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            {client.company}
                          </p>
                        )}
                      </div>
                      <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(client.status))}>
                        {client.status}
                      </span>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        <a href={`mailto:${client.email}`} className="hover:text-blue-600">
                          {client.email}
                        </a>
                      </div>
                      
                      {client.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          <a href={`tel:${client.phone}`} className="hover:text-blue-600">
                            {client.phone}
                          </a>
                        </div>
                      )}

                      {client.address && (
                        <div className="flex items-start text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 mt-0.5" />
                          <div>
                            <div>{client.address.street}</div>
                            <div>{client.address.city}, {client.address.state} {client.address.postalCode}</div>
                            <div>{client.address.country}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Client Stats */}
                    <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>Since {new Date(client.createdAt).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        <span>{client._count.projects} projects</span>
                      </div>
                    </div>

                    {/* Active Projects */}
                    {client.projects.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Active Projects</h4>
                        <div className="space-y-2">
                          {client.projects.slice(0, 3).map((projectData) => (
                            <div key={projectData.project.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{projectData.project.name}</span>
                              <div className="flex gap-1">
                                <span className={cn("px-1 py-0.5 rounded text-xs", getStatusColor(projectData.project.status))}>
                                  {projectData.project.status.replace('_', ' ')}
                                </span>
                                <span className={cn("px-1 py-0.5 rounded text-xs", getPriorityColor(projectData.project.priority))}>
                                  {projectData.project.priority}
                                </span>
                              </div>
                            </div>
                          ))}
                          {client.projects.length > 3 && (
                            <div className="text-xs text-gray-500 text-center">
                              +{client.projects.length - 3} more projects
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {client.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                        <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {client.notes}
                        </p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>{client._count.activities} activities</span>
                        <span>{client._count.comments} comments</span>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button className="text-sm text-blue-600 hover:text-blue-800">View Details</button>
                        <button className="text-sm text-gray-600 hover:text-gray-800">Edit</button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Building className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 