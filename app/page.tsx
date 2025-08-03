'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import IndustryDashboard from '@/components/IndustryDashboard';
import RecentProjects from '@/components/RecentProjects';
import QuickActions from '@/components/QuickActions';
import ActivityFeed from '@/components/ActivityFeed';
import { Code, Building2, Palette, BarChart3 } from 'lucide-react';

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [selectedIndustry, setSelectedIndustry] = useState<'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN' | 'ALL'>('ALL');

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

  const industries = [
    { id: 'ALL' as const, label: 'All Industries', icon: BarChart3, color: 'gray' },
    { id: 'IT' as const, label: 'IT Agency', icon: Code, color: 'blue' },
    { id: 'CONSTRUCTION' as const, label: 'Construction', icon: Building2, color: 'orange' },
    { id: 'INTERIOR_DESIGN' as const, label: 'Interior Design', icon: Palette, color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page Header with Industry Selector */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">
                    Welcome back, {user?.firstName || 'User'}!
                  </h1>
                  <p className="text-slate-600">
                    Here's what's happening with your projects today.
                  </p>
                </div>
                
                {/* Industry Filter */}
                <div className="flex flex-wrap gap-2">
                  {industries.map((industry) => {
                    const IconComponent = industry.icon;
                    const isSelected = selectedIndustry === industry.id;
                    
                    return (
                      <button
                        key={industry.id}
                        onClick={() => setSelectedIndustry(industry.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          isSelected
                            ? `bg-${industry.color}-100 text-${industry.color}-700 shadow-sm`
                            : 'bg-white/70 text-slate-600 hover:bg-white hover:shadow-sm'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span className="text-sm">{industry.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Industry Dashboard */}
            <div className="mb-8">
              <IndustryDashboard industry={selectedIndustry} />
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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