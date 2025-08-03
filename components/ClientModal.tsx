'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  X, 
  Upload, 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Globe,
  FileText,
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
  category: 'contract' | 'proposal' | 'reference' | 'other';
}

// Contact person types
interface ContactPerson {
  id: string;
  name: string;
  email: string;
  phone: string;
  position: string;
  isPrimary: boolean;
}

// Form schema
const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().min(1, 'Company name is required'),
  website: z.string().url().optional().or(z.literal('')),
  industry: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROSPECT', 'FORMER']),
  notes: z.string().optional(),
  
  // Address fields
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postalCode: z.string().optional(),
  country: z.string().optional(),
  
  // Company details
  companySize: z.string().optional(),
  foundedYear: z.string().optional(),
  annualRevenue: z.string().optional(),
  taxId: z.string().optional(),
  
  // Contact persons
  contactPersons: z.array(z.object({
    name: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Valid email is required'),
    phone: z.string().optional(),
    position: z.string().optional(),
    isPrimary: z.boolean(),
  })).min(1, 'At least one contact person is required'),
});

type ClientFormData = z.infer<typeof clientSchema>;

export default function ClientModal() {
  const { isClientModalOpen, closeClientModal, selectedClientId } = useModalStore();
  const [activeTab, setActiveTab] = useState('company');
  const [companyLogo, setCompanyLogo] = useState<File | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const fileInputRefs = {
    logo: useRef<HTMLInputElement>(null),
    contract: useRef<HTMLInputElement>(null),
    proposal: useRef<HTMLInputElement>(null),
    reference: useRef<HTMLInputElement>(null),
    other: useRef<HTMLInputElement>(null),
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      industry: '',
      status: 'PROSPECT',
      notes: '',
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
      companySize: '',
      foundedYear: '',
      annualRevenue: '',
      taxId: '',
      contactPersons: [],
    },
  });

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'contacts', label: 'Contact Persons', icon: User },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'files', label: 'Files & Documents', icon: FileText },
  ];

  // Load client data when editing
  useEffect(() => {
    if (isClientModalOpen && selectedClientId) {
      loadClientData();
    }
  }, [isClientModalOpen, selectedClientId]);

  const loadClientData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/clients/${selectedClientId}`);
      if (response.ok) {
        const clientData = await response.json();
        
        // Set form values
        setValue('name', clientData.name);
        setValue('email', clientData.email);
        setValue('phone', clientData.phone || '');
        setValue('company', clientData.company || '');
        setValue('website', clientData.website || '');
        setValue('industry', clientData.industry || '');
        setValue('status', clientData.status);
        setValue('notes', clientData.notes || '');
        
        // Set address values
        if (clientData.address) {
          setValue('street', clientData.address.street || '');
          setValue('city', clientData.address.city || '');
          setValue('state', clientData.address.state || '');
          setValue('postalCode', clientData.address.postalCode || '');
          setValue('country', clientData.address.country || '');
        }
        
        // Set contact persons
        if (clientData.contactPersons) {
          setContactPersons(clientData.contactPersons);
          setValue('contactPersons', clientData.contactPersons);
        }
      }
    } catch (error) {
      console.error('Error loading client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle contact person management
  const addContactPerson = () => {
    const newContact: ContactPerson = {
      id: generateFileId(),
      name: '',
      email: '',
      phone: '',
      position: '',
      isPrimary: contactPersons.length === 0, // First contact is primary
    };
    const updatedContacts = [...contactPersons, newContact];
    setContactPersons(updatedContacts);
    setValue('contactPersons', updatedContacts);
  };

  const updateContactPerson = (id: string, field: keyof ContactPerson, value: any) => {
    const updatedContacts = contactPersons.map(contact => 
      contact.id === id ? { ...contact, [field]: value } : contact
    );
    setContactPersons(updatedContacts);
    setValue('contactPersons', updatedContacts);
  };

  const removeContactPerson = (id: string) => {
    const updatedContacts = contactPersons.filter(contact => contact.id !== id);
    setContactPersons(updatedContacts);
    setValue('contactPersons', updatedContacts);
  };

  const setPrimaryContact = (id: string) => {
    const updatedContacts = contactPersons.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    }));
    setContactPersons(updatedContacts);
    setValue('contactPersons', updatedContacts);
  };

  const handleCompanyLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
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

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Prepare the data for API
      const clientData = {
        ...data,
        contactPersons: contactPersons,
        address: {
          street: data.street,
          city: data.city,
          state: data.state,
          postalCode: data.postalCode,
          country: data.country,
        },
      };

      const url = selectedClientId ? `/api/clients/${selectedClientId}` : '/api/clients';
      const method = selectedClientId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clientData),
      });

      if (response.ok) {
        closeModal();
        // Dispatch custom event to refresh clients list
        window.dispatchEvent(new CustomEvent('clientUpdated'));
        // You might want to refresh the projects list here
      } else {
        throw new Error('Failed to save client');
      }
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  const closeModal = () => {
    closeClientModal();
    reset();
    setCompanyLogo(null);
    setUploadedFiles([]);
    setContactPersons([]);
    setActiveTab('company');
  };

  if (!isClientModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {selectedClientId ? 'Edit Client' : 'Add New Client'}
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
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="p-6 space-y-6">
              {/* Company Logo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Logo
                </label>
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-24 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    {companyLogo ? (
                      <img
                        src={URL.createObjectURL(companyLogo)}
                        alt="Company Logo"
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <Building className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => fileInputRefs.logo.current?.click()}
                      className="btn btn-secondary"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </button>
                    <input
                      ref={fileInputRefs.logo}
                      type="file"
                      accept="image/*"
                      onChange={handleCompanyLogoUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name *
                </label>
                <Controller
                  name="company"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter company name"
                    />
                  )}
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-600">{errors.company.message}</p>
                )}
              </div>

              {/* Client Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Name *
                </label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter client name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email and Phone */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter email address"
                      />
                    )}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="tel"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter phone number"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Website and Industry */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Controller
                    name="website"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="url"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="https://example.com"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <Controller
                    name="industry"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., Technology, Healthcare"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Company Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Company Size
                  </label>
                  <Controller
                    name="companySize"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select size</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-500">201-500 employees</option>
                        <option value="500+">500+ employees</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Founded Year
                  </label>
                  <Controller
                    name="foundedYear"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        min="1800"
                        max={new Date().getFullYear()}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="e.g., 2020"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Annual Revenue and Tax ID */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Revenue
                  </label>
                  <Controller
                    name="annualRevenue"
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select range</option>
                        <option value="<1M">Less than $1M</option>
                        <option value="1M-10M">$1M - $10M</option>
                        <option value="10M-50M">$10M - $50M</option>
                        <option value="50M-100M">$50M - $100M</option>
                        <option value="100M+">$100M+</option>
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID
                  </label>
                  <Controller
                    name="taxId"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter tax ID"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Status */}
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
                      <option value="PROSPECT">Prospect</option>
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                      <option value="FORMER">Former</option>
                    </select>
                  )}
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Additional notes about the client..."
                    />
                  )}
                />
              </div>
            </div>
          )}

          {/* Contact Persons Tab */}
          {activeTab === 'contacts' && (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Contact Persons</h3>
                <button
                  type="button"
                  onClick={addContactPerson}
                  className="btn btn-secondary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contact
                </button>
              </div>

              {contactPersons.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No contact persons added yet</p>
                  <p className="text-sm">Add at least one contact person for this client</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contactPersons.map((contact, index) => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-900">
                          Contact Person {index + 1}
                          {contact.isPrimary && (
                            <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              Primary
                            </span>
                          )}
                        </h4>
                        <div className="flex items-center space-x-2">
                          {!contact.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimaryContact(contact.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Set as Primary
                            </button>
                          )}
                          {contactPersons.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeContactPerson(contact.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Name *
                          </label>
                          <input
                            type="text"
                            value={contact.name}
                            onChange={(e) => updateContactPerson(contact.id, 'name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter contact name"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Position
                          </label>
                          <input
                            type="text"
                            value={contact.position}
                            onChange={(e) => updateContactPerson(contact.id, 'position', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="e.g., CEO, Manager"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Email *
                          </label>
                          <input
                            type="email"
                            value={contact.email}
                            onChange={(e) => updateContactPerson(contact.id, 'email', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Phone
                          </label>
                          <input
                            type="tel"
                            value={contact.phone}
                            onChange={(e) => updateContactPerson(contact.id, 'phone', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {errors.contactPersons && (
                <p className="text-sm text-red-600">{errors.contactPersons.message}</p>
              )}
            </div>
          )}

          {/* Address Tab */}
          {activeTab === 'address' && (
            <div className="p-6 space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Company Address</h3>
              
              {/* Street Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Street Address
                </label>
                <Controller
                  name="street"
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter street address"
                    />
                  )}
                />
              </div>

              {/* City and State */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <Controller
                    name="city"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter city"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State/Province
                  </label>
                  <Controller
                    name="state"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter state or province"
                      />
                    )}
                  />
                </div>
              </div>

              {/* Postal Code and Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <Controller
                    name="postalCode"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter postal code"
                      />
                    )}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter country"
                      />
                    )}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Files & Documents Tab */}
          {activeTab === 'files' && (
            <div className="p-6 space-y-8">
              {/* Contracts */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Contracts</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.contract.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.contract}
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'contract')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('contract').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No contracts uploaded</p>
                      <p className="text-sm">Upload contract documents and agreements</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('contract').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Proposals */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Proposals</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.proposal.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.proposal}
                    type="file"
                    multiple
                    accept=".pdf,.ppt,.pptx,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'proposal')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('proposal').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No proposals uploaded</p>
                      <p className="text-sm">Upload project proposals and presentations</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('proposal').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
              </div>

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
                    accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload(e, 'reference')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('reference').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No reference files uploaded</p>
                      <p className="text-sm">Upload reference materials and documents</p>
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

              {/* Other Files */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Other Files</h3>
                  <button
                    type="button"
                    onClick={() => fileInputRefs.other.current?.click()}
                    className="btn btn-secondary"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Files
                  </button>
                  <input
                    ref={fileInputRefs.other}
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'other')}
                    className="hidden"
                  />
                </div>
                <div className="bg-gray-50 rounded-lg p-4 min-h-[120px]">
                  {getFilesByCategory('other').length === 0 ? (
                    <div className="text-center text-gray-500">
                      <FileText className="h-8 w-8 mx-auto mb-2" />
                      <p>No other files uploaded</p>
                      <p className="text-sm">Upload any additional client-related files</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {getFilesByCategory('other').map((file) => (
                        <FileItem key={file.id} file={file} onRemove={removeFile} />
                      ))}
                    </div>
                  )}
                </div>
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
            {isSubmitting ? 'Saving...' : (selectedClientId ? 'Update Client' : 'Create Client')}
          </button>
        </div>
      </div>
    </div>
  );
}

// File Item Component
function FileItem({ file, onRemove }: { file: UploadedFile; onRemove: (id: string) => void }) {
  const getFileIconComponent = (type: string) => {
    if (type.startsWith('image/')) return <FileText className="h-4 w-4" />;
    if (type.startsWith('video/')) return <FileText className="h-4 w-4" />;
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