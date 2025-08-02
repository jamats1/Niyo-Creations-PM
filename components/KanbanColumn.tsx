'use client';

import { Droppable, Draggable } from 'react-beautiful-dnd';
import { TypedColumn, Task } from '@/types';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useModalStore } from '@/store/modalStore';

interface KanbanColumnProps {
  id: TypedColumn;
  tasks: Task[];
  title: string;
}

export default function KanbanColumn({ id, tasks, title }: KanbanColumnProps) {
  const { openTaskModal } = useModalStore();

  const getColumnColor = (columnId: TypedColumn) => {
    switch (columnId) {
      case 'todo':
        return 'bg-gray-100 border-gray-300';
      case 'in-progress':
        return 'bg-blue-100 border-blue-300';
      case 'review':
        return 'bg-yellow-100 border-yellow-300';
      case 'done':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  const getColumnTextColor = (columnId: TypedColumn) => {
    switch (columnId) {
      case 'todo':
        return 'text-gray-700';
      case 'in-progress':
        return 'text-blue-700';
      case 'review':
        return 'text-yellow-700';
      case 'done':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[600px]">
      {/* Column Header */}
      <div className={`p-4 border-b ${getColumnColor(id)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold ${getColumnTextColor(id)}`}>
              {title}
            </h3>
            <span className="bg-white/80 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
              {tasks.length}
            </span>
          </div>
          <button
            onClick={() => openTaskModal()}
            className="p-1 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Column Content */}
      <Droppable droppableId={id} type="card">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`p-4 min-h-[500px] transition-colors ${
              snapshot.isDraggingOver ? 'bg-green-50' : 'bg-white'
            }`}
          >
            <div className="space-y-3">
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        snapshot.isDragging ? 'rotate-2 shadow-lg' : ''
                      } transition-all duration-200`}
                    >
                      <TaskCard task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>

            {/* Empty State */}
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="text-sm">No tasks yet</p>
                <button
                  onClick={() => openTaskModal()}
                  className="text-xs text-blue-600 hover:text-blue-800 mt-1"
                >
                  Add a task
                </button>
              </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
} 