'use client';

import { useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useBoardStore } from '@/store/boardStore';
import { TypedColumn, Task } from '@/types';
import KanbanColumn from './KanbanColumn';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';
import { useState } from 'react';

export default function KanbanBoard() {
  const { isLoaded, isSignedIn } = useUser();
  const { board, getBoard, moveTask, loading, error } = useBoardStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    // Only fetch board data if user is authenticated
    if (isLoaded && isSignedIn) {
      getBoard();
    }
  }, [getBoard, isLoaded, isSignedIn]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTaskById(active.id as string);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Handle drag over logic if needed
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the task being dragged
    const task = findTaskById(activeId);
    if (!task) return;

    // Determine the source and destination columns
    const sourceColumn = findColumnByTaskId(activeId);
    const destinationColumn = overId.includes('column-') 
      ? overId.replace('column-', '') as TypedColumn
      : findColumnByTaskId(overId) || sourceColumn;

    if (!sourceColumn || !destinationColumn) return;

    // If dropped in the same column, handle reordering
    if (sourceColumn === destinationColumn) {
      const column = board.columns.get(sourceColumn);
      if (!column) return;

      const oldIndex = column.tasks.findIndex(t => t.id === activeId);
      const newIndex = overId.includes('column-') 
        ? column.tasks.length 
        : column.tasks.findIndex(t => t.id === overId);

      if (oldIndex !== newIndex) {
        moveTask(activeId, sourceColumn, destinationColumn, newIndex);
      }
    } else {
      // Moving to a different column
      const destinationColumnData = board.columns.get(destinationColumn);
      const newIndex = overId.includes('column-') 
        ? destinationColumnData?.tasks.length || 0 
        : destinationColumnData?.tasks.findIndex(t => t.id === overId) || 0;

      moveTask(activeId, sourceColumn, destinationColumn, newIndex);
    }
  };

  const findTaskById = (id: string): Task | null => {
    for (const [, column] of board.columns) {
      const task = column.tasks.find(task => task.id === id);
      if (task) return task;
    }
    return null;
  };

  const findColumnByTaskId = (taskId: string): TypedColumn | null => {
    for (const [columnId, column] of board.columns) {
      if (column.tasks.some(task => task.id === taskId)) {
        return columnId;
      }
    }
    return null;
  };

  const idToColumnText: Record<TypedColumn, string> = {
    'TODO': 'To Do',
    'IN_PROGRESS': 'In Progress',
    'REVIEW': 'Review',
    'DONE': 'Done',
  };

  const columnColors: Record<TypedColumn, string> = {
    'TODO': 'bg-slate-50 border-slate-200',
    'IN_PROGRESS': 'bg-blue-50 border-blue-200',
    'REVIEW': 'bg-amber-50 border-amber-200',
    'DONE': 'bg-green-50 border-green-200',
  };

  return (
    <div className="h-full bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Board</h1>
            <p className="text-slate-600">Manage your tasks across different industries with drag and drop</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 animate-pulse">
              <div className="h-6 bg-slate-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-20 bg-slate-100 rounded"></div>
                <div className="h-20 bg-slate-100 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from(board.columns.entries()).map(([columnId, column]) => (
              <div key={columnId} className={`rounded-xl border-2 ${columnColors[columnId]} backdrop-blur-sm`}>
                <KanbanColumn
                  id={columnId}
                  tasks={column.tasks}
                  title={idToColumnText[columnId]}
                />
              </div>
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <div className="transform rotate-12 scale-110">
                <TaskCard task={activeTask} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
} 