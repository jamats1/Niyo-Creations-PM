import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get all counts using Prisma
    const [
      totalProjects,
      activeProjects,
      totalTasks,
      overdueTasks,
      activeClients,
      totalRevenue,
      projectStatusDistribution,
      taskStatusDistribution,
    ] = await Promise.all([
      // Total projects
      prisma.project.count(),
      
      // Active projects (PLANNING or EXECUTING)
      prisma.project.count({
        where: {
          status: {
            in: ['PLANNING', 'EXECUTING']
          }
        }
      }),
      
      // Total tasks
      prisma.task.count(),
      
      // Overdue tasks
      prisma.task.count({
        where: {
          dueDate: {
            lt: new Date()
          },
          status: {
            not: 'DONE'
          }
        }
      }),
      
      // Active clients (count clients with active projects)
      prisma.client.count({
        where: {
          projects: {
            some: {
              status: {
                in: ['PLANNING', 'EXECUTING']
              }
            }
          }
        }
      }),
      
      // Total revenue placeholder (since we don't have budget field in current schema)
      Promise.resolve(0),
      
      // Project status distribution
      prisma.project.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
      
      // Task status distribution
      prisma.task.groupBy({
        by: ['status'],
        _count: {
          status: true
        }
      }),
    ])

    // Calculate performance metrics
    const completedProjects = await prisma.project.count({
      where: { status: 'COMPLETED' }
    })
    
    const completedTasks = await prisma.task.count({
      where: { status: 'DONE' }
    })

    // Calculate completion rates
    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    // Get recent activities (placeholder since we don't have activity tracking yet)
    const recentActivities: any[] = []

    const stats = {
      overview: {
        totalProjects,
        activeProjects,
        totalTasks,
        overdueTasks,
        activeClients,
        totalRevenue,
      },
      performance: {
        projectCompletionRate,
        taskCompletionRate,
        onTimeDelivery: 85, // Placeholder
        clientSatisfaction: 92, // Placeholder
      },
      distribution: {
        projectStatus: projectStatusDistribution.map(item => ({
          status: item.status,
          count: item._count.status
        })),
        taskStatus: taskStatusDistribution.map(item => ({
          status: item.status,
          count: item._count.status
        })),
      },
      recentActivities,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}