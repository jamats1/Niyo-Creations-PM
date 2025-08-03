'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { TypedColumn, Task } from '@/types';
import SortableTaskCard from './SortableTaskCard';
import { Plus } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';

interface KanbanColumnProps {
  id: TypedColumn;
  tasks: Task[];
  title: string;
}

export default function KanbanColumn({ id, tasks, title }: KanbanColumnProps) {
  const { openTaskModal } = useModalStore();
  
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${id}`,
  });

  const getColumnColor = (columnId: TypedColumn) => {
    switch (columnId) {
      case 'TODO':
        return 'bg-slate-100 border-slate-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 border-blue-300';
      case 'REVIEW':
        return 'bg-amber-100 border-amber-300';
      case 'DONE':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-slate-100 border-slate-300';
    }
  };

  const getColumnTextColor = (columnId: TypedColumn) => {
    switch (columnId) {
      case 'TODO':
        return 'text-slate-700';
      case 'IN_PROGRESS':
        return 'text-blue-700';
      case 'REVIEW':
        return 'text-amber-700';
      case 'DONE':
        return 'text-green-700';
      default:
        return 'text-slate-700';
    }
  };

  const getColumnIcon = (columnId: TypedColumn) => {
    switch (columnId) {
      case 'TODO':
        return '📋';
      case 'IN_PROGRESS':
        return '⚡';
      case 'REVIEW':
        return '👀';
      case 'DONE':
        return '✅';
      default:
        return '📋';
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200 min-h-[600px] overflow-hidden">
      {/* Column Header */}
      <div className={`p-4 border-b ${getColumnColor(id)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-lg">{getColumnIcon(id)}</span>
            <div>
              <h3 className={`font-semibold text-sm ${getColumnTextColor(id)}`}>
                {title}
              </h3>
              <span className="bg-white/80 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
                {tasks.length} task{tasks.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <button
            onClick={() => openTaskModal()}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-white/70 rounded-lg transition-all duration-200 hover:scale-105"
            title="Add new task"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Column Content */}
      <div
        ref={setNodeRef}
        className={`p-4 min-h-[500px] transition-all duration-300 ${
          isOver 
            ? 'bg-gradient-to-b from-blue-50 to-blue-100 border-dashed border-2 border-blue-300' 
            : 'bg-transparent'
        }`}
      >
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {tasks.map((task) => (
              <SortableTaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>

        {/* Empty State */}
        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500">
            <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3 shadow-sm">
              <span className="text-2xl opacity-50">{getColumnIcon(id)}</span>
            </div>
            <p className="text-sm font-medium text-gray-600">No tasks yet</p>
            <button
              onClick={() => openTaskModal()}
              className="text-xs text-blue-600 hover:text-blue-800 mt-2 px-3 py-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              Add your first task
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 