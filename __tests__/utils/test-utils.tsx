import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock Clerk for testing
jest.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id: 'user-1',
      firstName: 'Test',
      lastName: 'User',
      fullName: 'Test User',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
      imageUrl: null,
      publicMetadata: { role: 'MEMBER' },
    },
    isLoaded: true,
    isSignedIn: true,
  }),
  useAuth: () => ({
    userId: 'user-1',
    isLoaded: true,
    isSignedIn: true,
  }),
  UserButton: ({ children, ...props }: any) => <div data-testid="user-button" {...props}>{children}</div>,
  SignIn: ({ children, ...props }: any) => <div data-testid="sign-in" {...props}>{children}</div>,
  SignUp: ({ children, ...props }: any) => <div data-testid="sign-up" {...props}>{children}</div>,
  ClerkProvider: ({ children }: any) => <div data-testid="clerk-provider">{children}</div>,
}))

jest.mock('@clerk/nextjs/server', () => ({
  auth: () => ({
    userId: 'user-1',
    sessionClaims: {
      metadata: { role: 'MEMBER' },
    },
  }),
}))

// Mock permissions utility
jest.mock('@/utils/permissions', () => ({
  usePermissions: () => ({
    userRole: 'MEMBER',
    hasRole: (role: string) => role === 'MEMBER' || role === 'CLIENT',
    canCreateProject: () => true,
    canEditProject: () => true,
    canDeleteProject: () => false,
    canManageUsers: () => false,
    canViewReports: () => true,
    canManageClients: () => true,
    canAssignTasks: () => true,
  }),
}))

// Mock server permissions utility
jest.mock('@/utils/server-permissions', () => ({
  checkServerPermission: () => Promise.resolve(true),
  getServerUserRole: () => Promise.resolve('MEMBER'),
  withRoleAuth: (requiredRole: string) => (handler: Function) => handler(),
}))

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Mock data helpers
export const mockTask = {
  id: 'task-1',
  title: 'Test Task',
  description: 'Test description',
  status: 'TODO' as const,
  priority: 'MEDIUM' as const,
  dueDate: new Date().toISOString(),
  assignedTo: 'user-1',
  projectId: 'project-1',
  assignee: {
    id: 'user-1',
    name: 'John Doe',
    avatarUrl: null,
  },
  project: {
    id: 'project-1',
    title: 'Test Project',
    type: 'IT' as const,
    status: 'EXECUTING' as const,
    teamId: 'team-1',
    clientId: 'client-1',
    deadline: null,
    team: {
      id: 'team-1',
      name: 'Test Team',
      members: [],
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    client: {
      id: 'client-1',
      name: 'Test Client',
      email: 'client@test.com',
      phone: null,
      company: 'Test Company',
      notes: null,
      projects: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    tasks: [],
    documents: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const mockProject = {
  id: 'project-1',
  title: 'Test Project',
  description: 'Test project description',
  type: 'IT' as const,
  status: 'EXECUTING' as const,
  teamId: 'team-1',
  clientId: 'client-1',
  deadline: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  team: {
    id: 'team-1',
    name: 'Test Team',
    members: [],
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  client: {
    id: 'client-1',
    name: 'Test Client',
    email: 'client@test.com',
    phone: null,
    company: 'Test Company',
    notes: null,
    projects: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  tasks: [],
  documents: [],
}

export const mockUser = {
  id: 'user-1',
  email: 'user@test.com',
  name: 'Test User',
  role: 'MEMBER' as const,
  avatarUrl: null,
  teams: [],
  tasks: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

// Mock Clerk user for testing
export const mockClerkUser = {
  id: 'user-1',
  firstName: 'Test',
  lastName: 'User',
  fullName: 'Test User',
  emailAddresses: [{ emailAddress: 'test@example.com' }],
  imageUrl: null,
  publicMetadata: { role: 'MEMBER' },
}

// Helper to create mock API responses with auth
export const mockAuthenticatedFetch = (data: any) => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(data),
    })
  ) as jest.Mock
}