import { create } from 'zustand';

interface ModalState {
  isTaskModalOpen: boolean;
  isProjectModalOpen: boolean;
  isClientModalOpen: boolean;
  isDeleteModalOpen: boolean;
  selectedTaskId: string | null;
  selectedProjectId: string | null;
  selectedClientId: string | null;
  openTaskModal: (taskId?: string) => void;
  closeTaskModal: () => void;
  openProjectModal: (projectId?: string) => void;
  closeProjectModal: () => void;
  openClientModal: (clientId?: string) => void;
  closeClientModal: () => void;
  openDeleteModal: (type: 'task' | 'project' | 'client', id: string) => void;
  closeDeleteModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isTaskModalOpen: false,
  isProjectModalOpen: false,
  isClientModalOpen: false,
  isDeleteModalOpen: false,
  selectedTaskId: null,
  selectedProjectId: null,
  selectedClientId: null,

  openTaskModal: (taskId?: string) => 
    set({ 
      isTaskModalOpen: true, 
      selectedTaskId: taskId || null 
    }),

  closeTaskModal: () => 
    set({ 
      isTaskModalOpen: false, 
      selectedTaskId: null 
    }),

  openProjectModal: (projectId?: string) => 
    set({ 
      isProjectModalOpen: true, 
      selectedProjectId: projectId || null 
    }),

  closeProjectModal: () => 
    set({ 
      isProjectModalOpen: false, 
      selectedProjectId: null 
    }),

  openClientModal: (clientId?: string) => 
    set({ 
      isClientModalOpen: true, 
      selectedClientId: clientId || null 
    }),

  closeClientModal: () => 
    set({ 
      isClientModalOpen: false, 
      selectedClientId: null 
    }),

  openDeleteModal: (type: 'task' | 'project' | 'client', id: string) => 
    set({ 
      isDeleteModalOpen: true,
      selectedTaskId: type === 'task' ? id : null,
      selectedProjectId: type === 'project' ? id : null,
      selectedClientId: type === 'client' ? id : null,
    }),

  closeDeleteModal: () => 
    set({ 
      isDeleteModalOpen: false,
      selectedTaskId: null,
      selectedProjectId: null,
      selectedClientId: null,
    }),
})); 