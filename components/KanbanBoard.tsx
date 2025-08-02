'use client';

import { useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { useBoardStore } from '@/store/boardStore';
import { TypedColumn, Task } from '@/types';
import KanbanColumn from './KanbanColumn';
import { Plus } from 'lucide-react';

export default function KanbanBoard() {
  const { board, getBoard, moveTask } = useBoardStore();

  useEffect(() => {
    getBoard();
  }, [getBoard]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, type } = result;

    // If dropped outside a valid droppable area
    if (!destination) return;

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'column') {
      // Handle column reordering if needed
      return;
    }

    if (type === 'card') {
      const sourceColumnId = source.droppableId as TypedColumn;
      const destinationColumnId = destination.droppableId as TypedColumn;

      moveTask(
        result.draggableId,
        sourceColumnId,
        destinationColumnId,
        destination.index
      );
    }
  };

  const idToColumnText: Record<TypedColumn, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'review': 'Review',
    'done': 'Done',
  };

  return (
    <div className="h-full bg-gray-50 p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Board</h1>
        <p className="text-gray-600">Manage your tasks with drag and drop</p>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="board" direction="horizontal" type="column">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {Array.from(board.columns.entries()).map(([columnId, column], index) => (
                <Draggable key={columnId} draggableId={columnId} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`${
                        snapshot.isDragging ? 'rotate-2' : ''
                      } transition-transform duration-200`}
                    >
                      <KanbanColumn
                        id={columnId}
                        tasks={column.tasks}
                        title={idToColumnText[columnId]}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {/* Add New Column Button */}
      <div className="mt-6">
        <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add New Column</span>
        </button>
      </div>
    </div>
  );
} 