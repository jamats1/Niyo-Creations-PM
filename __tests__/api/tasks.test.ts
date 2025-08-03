/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/tasks/route'
import { prisma } from '@/lib/db'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    task: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}))

const mockPrisma = prisma as jest.Mocked<typeof prisma>

describe('/api/tasks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/tasks', () => {
    it('returns tasks with related data', async () => {
      const mockTasks = [
        {
          id: 'task-1',
          title: 'Test Task',
          description: 'Test description',
          status: 'TODO',
          priority: 'HIGH',
          dueDate: new Date('2024-12-31'),
          assignedTo: 'user-1',
          projectId: 'project-1',
          assignee: {
            id: 'user-1',
            name: 'John Doe',
            avatarUrl: null,
          },
          project: {
            id: 'project-1',
            title: 'Test Project',
            team: {
              id: 'team-1',
              name: 'Test Team',
            },
            client: {
              id: 'client-1',
              name: 'Test Client',
            },
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]

      mockPrisma.task.findMany.mockResolvedValue(mockTasks as any)

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data).toEqual(mockTasks)
      expect(mockPrisma.task.findMany).toHaveBeenCalledWith({
        include: {
          assignee: true,
          project: {
            include: {
              team: true,
              client: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })
    })

    it('handles database errors', async () => {
      mockPrisma.task.findMany.mockRejectedValue(new Error('Database error'))

      const response = await GET()
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to fetch tasks' })
    })
  })

  describe('POST /api/tasks', () => {
    it('creates a new task', async () => {
      const mockTask = {
        id: 'new-task-id',
        title: 'New Task',
        description: 'New task description',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2024-12-31'),
        assignedTo: 'user-1',
        projectId: 'project-1',
        assignee: {
          id: 'user-1',
          name: 'John Doe',
          avatarUrl: null,
        },
        project: {
          id: 'project-1',
          title: 'Test Project',
          team: {
            id: 'team-1',
            name: 'Test Team',
          },
          client: {
            id: 'client-1',
            name: 'Test Client',
          },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      mockPrisma.task.create.mockResolvedValue(mockTask as any)

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'New Task',
          description: 'New task description',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: '2024-12-31',
          projectId: 'project-1',
          assignedTo: 'user-1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockTask)
      expect(mockPrisma.task.create).toHaveBeenCalledWith({
        data: {
          title: 'New Task',
          description: 'New task description',
          status: 'TODO',
          priority: 'MEDIUM',
          dueDate: new Date('2024-12-31'),
          projectId: 'project-1',
          assignedTo: 'user-1',
        },
        include: {
          assignee: true,
          project: {
            include: {
              team: true,
              client: true,
            },
          },
        },
      })
    })

    it('handles missing required fields', async () => {
      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          // Missing title and projectId
          description: 'Task without title',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      mockPrisma.task.create.mockRejectedValue(new Error('Required field missing'))

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create task' })
    })

    it('handles database errors during creation', async () => {
      mockPrisma.task.create.mockRejectedValue(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Task',
          projectId: 'project-1',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Failed to create task' })
    })
  })
})