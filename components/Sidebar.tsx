'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePermissions } from '@/utils/permissions';
import { 
  LayoutDashboard, 
  Kanban, 
  FolderOpen, 
  Users, 
  Calendar, 
  BarChart3, 
  Settings, 
  FileText,
  Home,
  Building2,
  Wrench,
  Monitor
} from 'lucide-react';
import { cn } from '@/utils/cn';

const navigation = [
  {
    name: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    current: true,
  },
  {
    name: 'Projects',
    href: '/projects',
    icon: FolderOpen,
    current: false,
  },
  {
    name: 'Kanban Board',
    href: '/board',
    icon: Kanban,
    current: false,
  },
  {
    name: 'Clients',
    href: '/clients',
    icon: Users,
    current: false,
  },
  {
    name: 'Calendar',
    href: '/calendar',
    icon: Calendar,
    current: false,
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    current: false,
    requiresPermission: 'canViewReports',
  },
  {
    name: 'Documents',
    href: '/documents',
    icon: FileText,
    current: false,
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: Settings,
    current: false,
    requiresPermission: 'canManageUsers',
  },
];

const projectCategories = [
  {
    name: 'Interior Design',
    href: '/projects?category=interior-design',
    icon: Home,
    count: 12,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Construction',
    href: '/projects?category=construction',
    icon: Building2,
    count: 8,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
  {
    name: 'IT Projects',
    href: '/projects?category=it',
    icon: Monitor,
    count: 15,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'Consulting',
    href: '/projects?category=consulting',
    icon: Wrench,
    count: 5,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { canViewReports, canManageUsers, hasRole } = usePermissions();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={cn(
      "flex flex-col bg-white border-r border-gray-200 transition-all duration-300 h-screen sticky top-0",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Toggle Button */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-900">Navigation</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg
            className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          
          // Check permissions for protected routes
          if (item.requiresPermission) {
            const hasPermission = item.requiresPermission === 'canViewReports' 
              ? canViewReports() 
              : item.requiresPermission === 'canManageUsers' 
              ? canManageUsers() 
              : true;
            
            if (!hasPermission) return null;
          }
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 flex-shrink-0 h-5 w-5",
                  isActive ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500"
                )}
              />
              {!collapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* Project Categories - Moved to top for better visibility */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50/50">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Project Categories
          </h3>
          <div className="space-y-2">
            {projectCategories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className="group flex items-center justify-between px-2 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md transition-colors"
              >
                <div className="flex items-center">
                  <div className={cn("p-1 rounded-md mr-3", category.bgColor)}>
                    <category.icon className={cn("h-4 w-4", category.color)} />
                  </div>
                  <span className="truncate">{category.name}</span>
                </div>
                <span className="text-xs text-gray-400 group-hover:text-gray-600">
                  {category.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Spacer to push Quick Stats to bottom */}
      <div className="flex-1" />

      {/* Quick Stats - Always at bottom */}
      {!collapsed && (
        <div className="px-4 py-4 border-t border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Stats
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Active Projects</span>
              <span className="font-medium text-gray-900">24</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Pending Tasks</span>
              <span className="font-medium text-gray-900">156</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Overdue</span>
              <span className="font-medium text-red-600">8</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 