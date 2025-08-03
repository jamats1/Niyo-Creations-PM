import { create } from 'zustand';
import { Board, Task, TypedColumn } from '@/types';

interface BoardState {
  board: Board;
  loading: boolean;
  error: string | null;
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
      ['TODO', { id: 'TODO', tasks: [] }],
      ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: [] }],
      ['REVIEW', { id: 'REVIEW', tasks: [] }],
      ['DONE', { id: 'DONE', tasks: [] }],
    ]),
  },
  loading: false,
  error: null,

  getBoard: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch('/api/tasks');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Handle error response from API
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Ensure we have an array of tasks
      const tasks = Array.isArray(data) ? data : [];

      const columns = new Map<TypedColumn, { id: TypedColumn; tasks: Task[] }>([
        ['TODO', { id: 'TODO', tasks: tasks.filter((task: Task) => task.status === 'TODO') }],
        ['IN_PROGRESS', { id: 'IN_PROGRESS', tasks: tasks.filter((task: Task) => task.status === 'IN_PROGRESS') }],
        ['REVIEW', { id: 'REVIEW', tasks: tasks.filter((task: Task) => task.status === 'REVIEW') }],
        ['DONE', { id: 'DONE', tasks: tasks.filter((task: Task) => task.status === 'DONE') }],
      ]);

      set({ board: { columns }, loading: false });
    } catch (error) {
      console.error('Error fetching board:', error);
      set({ error: 'Failed to fetch tasks', loading: false });
    }
  },

  setBoard: (board: Board) => set({ board }),

  updateTaskInColumn: async (taskId: string, columnId: TypedColumn, updatedTask: Task) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = column.tasks.map(task => 
        task.id === taskId ? updatedTask : task
      );
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });

      // Update via API
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: updatedTask.title,
            description: updatedTask.description,
            status: columnId,
            priority: updatedTask.priority,
            dueDate: updatedTask.dueDate?.toISOString(),
          }),
        });
      } catch (error) {
        console.error('Error updating task:', error);
      }
    }
  },

  deleteTask: async (taskId: string, columnId: TypedColumn) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = column.tasks.filter(task => task.id !== taskId);
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });

      // Delete via API
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE',
        });
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  },

  addTask: async (task: Task, columnId: TypedColumn) => {
    const { board } = get();
    const newColumns = new Map(board.columns);
    const column = newColumns.get(columnId);
    
    if (column) {
      const updatedTasks = [...column.tasks, task];
      newColumns.set(columnId, { ...column, tasks: updatedTasks });
      set({ board: { columns: newColumns } });

      // Create via API
      try {
        await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            status: columnId,
            priority: task.priority,
            dueDate: task.dueDate?.toISOString(),
            projectId: task.projectId,
            assignedTo: task.assignedTo,
          }),
        });
      } catch (error) {
        console.error('Error creating task:', error);
      }
    }
  },

  moveTask: async (taskId: string, fromColumnId: TypedColumn, toColumnId: TypedColumn, newIndex: number) => {
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

          // Update status via API
          try {
            await fetch(`/api/tasks/${taskId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: toColumnId,
              }),
            });
          } catch (error) {
            console.error('Error updating task status:', error);
          }
        }
      }
    }
  },
})); 