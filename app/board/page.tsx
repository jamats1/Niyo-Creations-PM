'use client';

import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import KanbanBoard from '@/components/KanbanBoard';

export default function BoardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1">
          <KanbanBoard />
        </main>
      </div>
    </div>
  );
} 