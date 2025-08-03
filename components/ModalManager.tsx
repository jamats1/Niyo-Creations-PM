'use client';

import { useModalStore } from '@/store/modalStore';
import { useBoardStore } from '@/store/boardStore';
import TaskForm from '@/components/forms/TaskForm';
import ProjectForm from '@/components/forms/ProjectForm';
import ClientForm from '@/components/forms/ClientForm';
import { useEffect, useState } from 'react';

export default function ModalManager() {
  const {
    isTaskModalOpen,
    isProjectModalOpen,
    isClientModalOpen,
    selectedTaskId,
    selectedProjectId,
    selectedClientId,
    closeTaskModal,
    closeProjectModal,
    closeClientModal,
  } = useModalStore();

  const { getBoard } = useBoardStore();
  
  const [taskData, setTaskData] = useState<any>(null);
  const [projectData, setProjectData] = useState<any>(null);
  const [clientData, setClientData] = useState<any>(null);

  // Fetch task data when editing
  useEffect(() => {
    if (isTaskModalOpen && selectedTaskId) {
      fetchTaskData(selectedTaskId);
    } else {
      setTaskData(null);
    }
  }, [isTaskModalOpen, selectedTaskId]);

  // Fetch project data when editing
  useEffect(() => {
    if (isProjectModalOpen && selectedProjectId) {
      fetchProjectData(selectedProjectId);
    } else {
      setProjectData(null);
    }
  }, [isProjectModalOpen, selectedProjectId]);

  // Fetch client data when editing
  useEffect(() => {
    if (isClientModalOpen && selectedClientId) {
      fetchClientData(selectedClientId);
    } else {
      setClientData(null);
    }
  }, [isClientModalOpen, selectedClientId]);

  const fetchTaskData = async (taskId: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`);
      if (response.ok) {
        const task = await response.json();
        setTaskData({
          title: task.title,
          description: task.description || '',
          status: task.status,
          priority: task.priority,
          dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
          assignedTo: task.assignedTo || '',
          projectId: task.projectId,
        });
      }
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const fetchProjectData = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const project = await response.json();
        setProjectData({
          title: project.title,
          description: project.description || '',
          type: project.type,
          status: project.status,
          teamId: project.teamId,
          clientId: project.clientId || '',
          deadline: project.deadline ? new Date(project.deadline).toISOString().split('T')[0] : '',
        });
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  };

  const fetchClientData = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const client = await response.json();
        setClientData({
          name: client.name,
          email: client.email || '',
          phone: client.phone || '',
          company: client.company || '',
          notes: client.notes || '',
        });
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const handleTaskSuccess = () => {
    getBoard(); // Refresh the board
    // You can add additional refresh logic here
  };

  const handleProjectSuccess = () => {
    // Refresh projects list or redirect
    window.location.reload(); // Simple refresh for now
  };

  const handleClientSuccess = () => {
    // Refresh clients list
    window.location.reload(); // Simple refresh for now
  };

  return (
    <>
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        onSuccess={handleTaskSuccess}
        initialData={taskData}
        taskId={selectedTaskId || undefined}
      />
      
      <ProjectForm
        isOpen={isProjectModalOpen}
        onClose={closeProjectModal}
        onSuccess={handleProjectSuccess}
        initialData={projectData}
        projectId={selectedProjectId || undefined}
      />
      
      <ClientForm
        isOpen={isClientModalOpen}
        onClose={closeClientModal}
        onSuccess={handleClientSuccess}
        initialData={clientData}
        clientId={selectedClientId || undefined}
      />
    </>
  );
}