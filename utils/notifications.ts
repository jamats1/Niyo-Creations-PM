import { prisma } from '@/lib/db'
import { NotificationType } from '@prisma/client'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  entityId?: string
  entityType?: string
}

export async function createNotification(params: CreateNotificationParams) {
  try {
    const notification = await prisma.notification.create({
      data: params
    })
    return notification
  } catch (error) {
    console.error('Error creating notification:', error)
    throw error
  }
}

// Helper functions to create specific notification types
export async function notifyTaskAssigned(userId: string, taskTitle: string, taskId: string) {
  return createNotification({
    userId,
    type: 'TASK_ASSIGNED',
    title: 'New Task Assigned',
    message: `You have been assigned to task: ${taskTitle}`,
    entityId: taskId,
    entityType: 'task'
  })
}

export async function notifyProjectDeadline(userId: string, projectTitle: string, projectId: string, deadline: Date) {
  const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  return createNotification({
    userId,
    type: 'PROJECT_DEADLINE',
    title: 'Project Deadline Approaching',
    message: `Project "${projectTitle}" deadline is in ${daysUntil} days`,
    entityId: projectId,
    entityType: 'project'
  })
}

export async function notifyTaskOverdue(userId: string, taskTitle: string, taskId: string) {
  return createNotification({
    userId,
    type: 'TASK_OVERDUE',
    title: 'Task Overdue',
    message: `Task "${taskTitle}" is now overdue`,
    entityId: taskId,
    entityType: 'task'
  })
}

export async function notifyProjectStatusChanged(userIds: string[], projectTitle: string, projectId: string, newStatus: string) {
  const notifications = await Promise.all(
    userIds.map(userId =>
      createNotification({
        userId,
        type: 'PROJECT_STATUS_CHANGED',
        title: 'Project Status Updated',
        message: `Project "${projectTitle}" status changed to ${newStatus.replace('_', ' ').toLowerCase()}`,
        entityId: projectId,
        entityType: 'project'
      })
    )
  )
  return notifications
}