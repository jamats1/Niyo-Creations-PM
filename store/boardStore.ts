import { create } from 'zustand';
import { Board, Task, TypedColumn } from '@/types';

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoard: (board: Board) => void;
  updateTaskInColumn: (taskId: string, columnId: TypedColumn, task: Task) => void;
  deleteTask: (taskId: string, columnId: TypedColumn) => void;
  addTask: (task: Task, columnId: TypedColumn) => void;
  moveTask: (taskId: string, fromColumnId: TypedColumn, toColumnId: TypedColumn, newIndex: number) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, { id: TypedColumn; tasks: Task[] }>([
      ['todo', { id: 'todo', tasks: [] }],
      ['in-progress', { id: 'in-progress', tasks: [] }],
      ['review', { id: 'review', tasks: [] }],
      ['done', { id: 'done', tasks: [] }],
    ]),
  },

  getBoard: async () => {
    try {
      const response = await fetch('/api/tasks');
      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }
      
      const tasks = await response.json();
      
      // Transform database tasks to our Task format
      const transformedTasks: Task[] = tasks.map((task: any) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status.toLowerCase() as TypedColumn,
        priority: task.priority.toLowerCase(),
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        estimatedHours: task.estimatedHours,
        actualHours: task.actualHours,
        tags: task.tags ? JSON.parse(task.tags) : [],
        projectId: task.projectId,
        assignee: task.assignee,
        creator: task.creator,
        commentsCount: task._count?.comments || 0,
        attachmentsCount: task._count?.attachments || 0,
        attachments: task.attachments || [],
        comments: task.comments || [],
        createdAt: new Date(task.createdAt),
        updatedAt: new Date(task.updatedAt),
      }));

      const columns = new Map<TypedColumn, { id: TypedColumn; tasks: Task[] }>([
        ['todo', { id: 'todo', tasks: transformedTasks.filter(task => task.status === 'todo') }],
        ['in-progress', { id: 'in-progress', tasks: transformedTasks.filter(task => task.status === 'in-progress') }],
        ['review', { id: 'review', tasks: transformedTasks.filter(task => task.status === 'review') }],
        ['done', { id: 'done', tasks: transformedTasks.filter(task => task.status === 'done') }],
      ]);

      set({ board: { columns } });
    } catch (error) {
      console.error('Error fetching board:', error);
    }
  },

  setBoard: (board: Board) => set({ board }),

  updateTaskInColumn: (taskId: string, columnId: TypedColumn, updatedTask: Task) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = column.tasks.map(task => 
        task.id === taskId ? updatedTask : task
      );
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });
    }
  },

  deleteTask: (taskId: string, columnId: TypedColumn) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = column.tasks.filter(task => task.id !== taskId);
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });
    }
  },

  addTask: (task: Task, columnId: TypedColumn) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = [...column.tasks, task];
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });
    }
  },

  moveTask: (taskId: string, fromColumnId: TypedColumn, toColumnId: TypedColumn, newIndex: number) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    
    // Remove task from source column
    const fromColumn = newColumns.get(fromColumnId);
    if (fromColumn) {
      const taskToMove = fromColumn.tasks.find(task => task.id === taskId);
      if (taskToMove) {
        const updatedFromTasks = fromColumn.tasks.filter(task => task.id !== taskId);
        newColumns.set(fromColumnId, { ...fromColumn, tasks: updatedFromTasks });
        
        // Add task to destination column
        const toColumn = newColumns.get(toColumnId);
        if (toColumn) {
          const updatedToTasks = [...toColumn.tasks];
          updatedToTasks.splice(newIndex, 0, { ...taskToMove, status: toColumnId });
          newColumns.set(toColumnId, { ...toColumn, tasks: updatedToTasks });
          
          set({ board: { columns: newColumns } });
        }
      }
    }
  },
})); 