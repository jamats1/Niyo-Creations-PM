'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Search, User, Bell, Settings, Menu } from 'lucide-react';
import { UserButton, useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

import { cn } from '@/utils/cn';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useUser();
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);

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
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <h3 className="px-4 py-2 text-sm font-medium text-gray-900 border-b border-gray-200">Notifications</h3>
                  <div className="max-h-64 overflow-y-auto">
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-900">New task assigned to you</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                      <p className="text-sm text-gray-900">Project deadline approaching</p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                    <div className="px-4 py-3 hover:bg-gray-50">
                      <p className="text-sm text-gray-900">New comment on your task</p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                  <button className="w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">View all notifications</button>
                </div>
              )}
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