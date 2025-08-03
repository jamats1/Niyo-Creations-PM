'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Upload, 
  Image, 
  FileText, 
  Video, 
  FolderOpen, 
  Calendar,
  Users,
  DollarSign,
  Tag,
  Plus,
  Trash2,
  Eye,
  Download
} from 'lucide-react';
import { useModalStore } from '@/store/modalStore';
import { cn } from '@/utils/cn';
import { validateFiles, formatFileSize, getFileIcon, generateFileId } from '@/utils/fileUpload';

// File upload types
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  category: 'reference' | 'production' | 'client';
}

// User types
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface TeamMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  user: User;
}

// Form schema
const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  description: z.string().min(1, 'Project description is required'),
  status: z.enum(['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED', 'CANCELLED']),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  budget: z.number().min(0, 'Budget must be positive'),
  categories: z.array(z.string()).min(1, 'At least one category is required'),
  tags: z.array(z.string()),
  clientId: z.string().optional(),
  teamMembers: z.array(z.object({
    userId: z.string(),
    role: z.enum(['owner', 'admin', 'member', 'viewer']),
  })),
});

type ProjectFormData = z.infer<typeof projectSchema>;

export default function ProjectModal() {
  const { isProjectModalOpen, closeProjectModal, selectedProjectId } = useModalStore();
  const [activeTab, setActiveTab] = useState('basic');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const fileInputRefs = {
    cover: useRef<HTMLInputElement>(null),
    reference: useRef<HTMLInputElement>(null),
    production: useRef<HTMLInputElement>(null),
    client: useRef<HTMLInputElement>(null),
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'PLANNING',
      priority: 'MEDIUM',
      startDate: '',
      endDate: '',
      budget: 0,
      categories: [],
      tags: [],
      teamMembers: [] as any,
    },
  });

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: FileText },
    { id: 'files', label: 'Files & Media', icon: FolderOpen },
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'team', label: 'Team & Budget', icon: Users },
  ];

  // Fetch users when modal opens
  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const usersData = await response.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Handle team member selection
  const handleTeamMemberToggle = (user: User, role: 'owner' | 'admin' | 'member' | 'viewer' = 'member') => {
    const existingMember = selectedTeamMembers.find(member => member.userId === user.id);
    
    if (existingMember) {
      // Remove member
      setSelectedTeamMembers(selectedTeamMembers.filter(member => member.userId !== user.id));
    } else {
      // Add member
      setSelectedTeamMembers([...selectedTeamMembers, { userId: user.id, role, user }]);
    }
  };

  // Handle role change for team member
  const handleRoleChange = (userId: string, newRole: 'owner' | 'admin' | 'member' | 'viewer') => {
    setSelectedTeamMembers(selectedTeamMembers.map(member => 
      member.userId === userId ? { ...member, role: newRole } : member
    ));
  };

  // Fetch users when modal opens
  useEffect(() => {
    if (isProjectModalOpen) {
      fetchUsers();
    }
  }, [isProjectModalOpen]);

  const handleCoverImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCoverImage(file);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, category: UploadedFile['category']) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Validate files
    const validation = validateFiles(files);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    setIsUploading(true);
    
    // Create file objects with validation
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: generateFileId(),
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
      category,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);
    setIsUploading(false);
    
    // Reset input
    event.target.value = '';
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getFilesByCategory = (category: UploadedFile['category']) => {
    return uploadedFiles.filter(file => file.category === category);
  };

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const formData = new FormData();
      
      // Append form data (excluding teamMembers as we'll handle it separately)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'teamMembers') {
          if (Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      // Append team members data
      formData.append('teamMembers', JSON.stringify(selectedTeamMembers));

      // Append cover image
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      // Append uploaded files
      uploadedFiles.forEach((file, index) => {
        formData.append(`files[${index}]`, JSON.stringify(file));
      });

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        closeModal();
        // You might want to refresh the projects list here
      } else {
        throw new Error('Failed to create project');
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const closeModal = () => {
    closeProjectModal();
    reset();
    setCoverImage(null);
    setUploadedFiles([]);
    setSelectedTeamMembers([]);
    setActiveTab('basic');
  };

  if (!isProjectModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedProjectId ? 'Edit Project' : 'Create New Project'}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center space-x-2 py-4 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Basic Info Tab */}
          {activeTab === 'basic' && (
            <div className="p-6 space-y-6">
              {/* Cover Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Cover Image
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {coverImage ? (
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Upload className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.cover.current?.click()}
                      className="btn btn-secondary"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Cover Image
                    </button>
                    <input
                      ref={fileInputRefs.cover}
                      type="file"
                      accept="image/*"
                      onChange={handleCoverImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter project name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description *
                </label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Describe your project..."
                    />
                  )}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Status and Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="PLANNING">Planning</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="ON_HOLD">On Hold</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <Controller
                    name="priority"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                        <option value="URGENT">Urgent</option>
                      </select>
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Files & Media Tab */}
          {activeTab === 'files' && (
            <div className="p-6 space-y-8">
              {/* Reference Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Reference Files</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.reference.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.reference}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.gif,.pdf,.dwg,.skp,.mp4,.mov,.avi"
                    onChange={(e) => handleFileUpload(e, 'reference')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('reference').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <Image className="h-8 w-8 mx-auto mb-2" />
                      <p>No reference files uploaded</p>
                      <p className="text-sm">Upload images, CAD files, SketchUp models, or videos</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('reference').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Production Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Production Files</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.production.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.production}
                    type="file"
                    multiple
                    accept=".rvt,.dwg,.pdf,.skp"
                    onChange={(e) => handleFileUpload(e, 'production')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('production').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No production files uploaded</p>
                      <p className="text-sm">Upload Revit, CAD, or other production files</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('production').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Client Submission Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Client Submission Files</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.client.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.client}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.ppt,.pptx"
                    onChange={(e) => handleFileUpload(e, 'client')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('client').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No client files uploaded</p>
                      <p className="text-sm">Upload proposals, presentations, or client deliverables</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('client').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="p-6 space-y-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date *
                </label>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
                {errors.startDate && (
                  <p className="mt-1 text-sm text-red-600">{errors.startDate.message}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  )}
                />
              </div>

              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categories *
                </label>
                <Controller
                  name="categories"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      {['Interior Design', 'Architecture', 'Construction', 'IT', 'Marketing'].map((category) => (
                        <label key={category} className="flex items-center">
                          <input
                            type="checkbox"
                            value={category}
                            checked={field.value.includes(category)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                field.onChange([...field.value, category]);
                              } else {
                                field.onChange(field.value.filter(c => c !== category));
                              }
                            }}
                            className="mr-2"
                          />
                          {category}
                        </label>
                      ))}
                    </div>
                  )}
                />
                {errors.categories && (
                  <p className="mt-1 text-sm text-red-600">{errors.categories.message}</p>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <Controller
                  name="tags"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="text"
                      placeholder="Enter tags separated by commas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={field.value.join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag);
                        field.onChange(tags);
                      }}
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Team & Budget Tab */}
          {activeTab === 'team' && (
            <div className="p-6 space-y-6">
              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget ($)
                </label>
                <Controller
                  name="budget"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    />
                  )}
                />
                {errors.budget && (
                  <p className="mt-1 text-sm text-red-600">{errors.budget.message}</p>
                )}
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Team Members
                </label>
                
                {isLoadingUsers ? (
                  <div className="text-sm text-gray-500">Loading users...</div>
                ) : (
                  <div className="space-y-4">
                    {/* Available Users */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-2">Available Team Members</h4>
                      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                        {users.map((user) => {
                          const isSelected = selectedTeamMembers.some(member => member.userId === user.id);
                          return (
                            <div
                              key={user.id}
                              className={`flex items-center justify-between p-2 rounded-lg border cursor-pointer transition-colors ${
                                isSelected 
                                  ? 'bg-blue-50 border-blue-200' 
                                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                              }`}
                              onClick={() => handleTeamMemberToggle(user)}
                            >
                              <div className="flex items-center space-x-3">
                                {user.avatar ? (
                                  <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-gray-600">
                                      {user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                  <div className="text-xs text-gray-500">{user.email}</div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Selected Team Members */}
                    {selectedTeamMembers.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-600 mb-2">Selected Team Members</h4>
                        <div className="space-y-2">
                          {selectedTeamMembers.map((member) => (
                            <div key={member.userId} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <div className="flex items-center space-x-3">
                                {member.user.avatar ? (
                                  <img src={member.user.avatar} alt={member.user.name} className="w-8 h-8 rounded-full" />
                                ) : (
                                  <div className="w-8 h-8 bg-blue-300 rounded-full flex items-center justify-center">
                                    <span className="text-xs font-medium text-white">
                                      {member.user.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  </div>
                                )}
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{member.user.name}</div>
                                  <div className="text-xs text-gray-500">{member.user.email}</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <select
                                  value={member.role}
                                  onChange={(e) => handleRoleChange(member.userId, e.target.value as any)}
                                  className="text-xs border border-gray-300 rounded px-2 py-1 bg-white"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <option value="member">Member</option>
                                  <option value="admin">Admin</option>
                                  <option value="viewer">Viewer</option>
                                  <option value="owner">Owner</option>
                                </select>
                                <button
                                  type="button"
                                  onClick={() => handleTeamMemberToggle(member.user)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={closeModal}
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSubmitting || isUploading}
            className="btn btn-primary"
          >
            {isSubmitting ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  );
}

// File Item Component
function FileItem({ file, onRemove }: { file: UploadedFile; onRemove: (id: string) => void }) {
  const getFileIconComponent = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (type.startsWith('video/')) return <Video className="h-4 w-4" />;
    return <FileText className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center justify-between p-3 bg-white rounded border border-gray-200">
      <div className="flex items-center space-x-3">
        {getFileIconComponent(file.type)}
        <div>
          <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <button
          type="button"
          onClick={() => window.open(file.url, '_blank')}
          className="p-1 text-gray-400 hover:text-gray-600"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onRemove(file.id)}
          className="p-1 text-gray-400 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

 