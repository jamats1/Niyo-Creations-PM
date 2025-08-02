'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import RecentProjects from '@/components/RecentProjects';
import QuickActions from '@/components/QuickActions';
import ActivityFeed from '@/components/ActivityFeed';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, John!
              </h1>
              <p className="text-gray-600">
                Here's what's happening with your projects today.
              </p>
            </div>

            {/* Dashboard Stats */}
            <DashboardStats />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
              {/* Recent Projects */}
              <div className="lg:col-span-2">
                <RecentProjects />
              </div>

              {/* Quick Actions & Activity */}
              <div className="space-y-6">
                <QuickActions />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 