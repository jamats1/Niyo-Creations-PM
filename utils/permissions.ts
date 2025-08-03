import { useUser } from '@clerk/nextjs'

export type UserRole = 'ADMIN' | 'MEMBER' | 'CLIENT'

// Client-side permission checking hook
export function usePermissions() {
  const { user } = useUser()
  
  const getUserRole = (): UserRole => {
    return (user?.publicMetadata?.role as UserRole) || 'MEMBER'
  }
  
  const hasRole = (requiredRole: UserRole): boolean => {
    const userRole = getUserRole()
    return hasPermission(userRole, requiredRole)
  }
  
  const canCreateProject = (): boolean => {
    return hasRole('ADMIN') || hasRole('MEMBER')
  }
  
  const canEditProject = (): boolean => {
    return hasRole('ADMIN') || hasRole('MEMBER')
  }
  
  const canDeleteProject = (): boolean => {
    return hasRole('ADMIN')
  }
  
  const canManageUsers = (): boolean => {
    return hasRole('ADMIN')
  }
  
  const canViewReports = (): boolean => {
    return hasRole('ADMIN') || hasRole('MEMBER')
  }
  
  const canManageClients = (): boolean => {
    return hasRole('ADMIN') || hasRole('MEMBER')
  }
  
  const canAssignTasks = (): boolean => {
    return hasRole('ADMIN') || hasRole('MEMBER')
  }
  
  return {
    userRole: getUserRole(),
    hasRole,
    canCreateProject,
    canEditProject,
    canDeleteProject,
    canManageUsers,
    canViewReports,
    canManageClients,
    canAssignTasks,
  }
}

// Role hierarchy helper
function hasPermission(userRole: UserRole, requiredRole: UserRole): boolean {
  const roleHierarchy: Record<UserRole, number> = {
    'CLIENT': 1,
    'MEMBER': 2,
    'ADMIN': 3,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}