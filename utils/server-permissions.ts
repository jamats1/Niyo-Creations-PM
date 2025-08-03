import { auth } from '@clerk/nextjs/server'

export type UserRole = 'ADMIN' | 'MEMBER' | 'CLIENT'

// Server-side permission checking
export async function checkServerPermission(requiredRole: UserRole): Promise<boolean> {
  const { userId, sessionClaims } = auth()
  
  if (!userId) return false
  
  const userRole = sessionClaims?.metadata?.role as UserRole || 'MEMBER'
  
  return hasPermission(userRole, requiredRole)
}

// Get current user role on server
export async function getServerUserRole(): Promise<UserRole | null> {
  const { userId, sessionClaims } = auth()
  
  if (!userId) return null
  
  return sessionClaims?.metadata?.role as UserRole || 'MEMBER'
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

// API route permission middleware
export function withRoleAuth(requiredRole: UserRole) {
  return async function middleware(handler: Function) {
    const hasPermission = await checkServerPermission(requiredRole)
    
    if (!hasPermission) {
      return Response.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      )
    }
    
    return handler()
  }
}