'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search, User, Bell, Settings, Menu } from 'lucide-react';
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { cn } from '@/utils/cn';

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  entityId?: string;
  entityType?: string;
}

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Fetch notifications
  useEffect(() => {
    if (user) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications?unread=false');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications.slice(0, 5)); // Show only latest 5
        setUnreadCount(data.unreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-400/40 to-blue-500/40 opacity-50 blur-3xl -z-10" />
      
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-4 space-y-4 md:space-y-0">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Niyo Creations PM</h1>
                <p className="text-sm text-gray-500">Project Management & CRM</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search projects, tasks, clients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                />
              </div>
            </form>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <SignedIn>
              <div className="relative" ref={notificationRef}>
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                {showNotifications && (
                  <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {loading ? (
                        <div className="px-4 py-8 text-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                        </div>
                      ) : notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => {
                              if (!notification.read) markAsRead(notification.id);
                              if (notification.entityType && notification.entityId) {
                                router.push(`/${notification.entityType}s/${notification.entityId}`);
                                setShowNotifications(false);
                              }
                            }}
                            className={cn(
                              "px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer",
                              !notification.read && "bg-blue-50"
                            )}
                          >
                            <p className="text-sm text-gray-900 font-medium">{notification.title}</p>
                            <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-8 text-center text-gray-500">
                          <Bell className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                          <p className="text-sm">No notifications yet</p>
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button 
                        onClick={() => {
                          router.push('/notifications');
                          setShowNotifications(false);
                        }}
                        className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        View all notifications
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => router.push('/settings')} className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <UserButton 
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                      userButtonPopoverCard: "shadow-lg",
                    }
                  }}
                  showName={false}
                />
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.fullName || user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.publicMetadata?.role as string || 'Member'}
                  </p>
                </div>
              </div>
            </SignedIn>
            <SignedOut>
              <button onClick={() => router.push('/sign-in')} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Sign In
              </button>
            </SignedOut>

            {/* Mobile Menu */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* GPT Summary Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-blue-100">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">AI</span>
            </div>
            <p className="text-sm text-blue-700 font-medium">
              AI is summarizing your tasks for today
            </p>
          </div>
        </div>
      </div>
    </header>
  );
} 