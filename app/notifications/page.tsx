'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Bell, Check, CheckCheck, Trash2, Filter } from 'lucide-react';
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

export default function NotificationsPage() {
  const { isLoaded, isSignedIn } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to sign in if not authenticated
  if (!isSignedIn) {
    redirect('/sign-in');
  }

  useEffect(() => {
    fetchNotifications();
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const url = filter === 'unread' 
        ? '/api/notifications?unread=true'
        : '/api/notifications?unread=false';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
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

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
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

  const getNotificationIcon = (type: string) => {
    const icons: Record<string, string> = {
      TASK_ASSIGNED: '📋',
      TASK_COMPLETED: '✅',
      TASK_OVERDUE: '⚠️',
      PROJECT_DEADLINE: '📅',
      PROJECT_STATUS_CHANGED: '🔄',
      COMMENT_ADDED: '💬',
      CLIENT_ADDED: '👤',
      DOCUMENT_UPLOADED: '📄'
    };
    return icons[type] || '🔔';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full max-w-4xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Notifications</h1>
                  <p className="text-slate-600">Stay updated with your project activities</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={notifications.filter(n => !n.read).length === 0}
                  >
                    <CheckCheck className="h-4 w-4" />
                    Mark all as read
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setFilter('all')}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                    filter === 'all'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  All Notifications
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={cn(
                    "flex-1 px-4 py-3 text-sm font-medium transition-colors",
                    filter === 'unread'
                      ? "text-blue-600 border-b-2 border-blue-600"
                      : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  Unread Only
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
              {loading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "bg-white rounded-lg shadow-sm border border-gray-200 p-4 transition-all hover:shadow-md",
                      !notification.read && "border-blue-200 bg-blue-50/50"
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{notification.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{formatTime(notification.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Mark as read"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </h3>
                  <p className="text-gray-600">
                    {filter === 'unread' 
                      ? 'All caught up! Check back later.'
                      : 'When you receive notifications, they will appear here.'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}