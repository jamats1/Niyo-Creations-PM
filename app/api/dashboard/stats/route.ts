import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Get total counts
    const [
      totalProjects,
      activeProjects,
      totalTasks,
      overdueTasks,
      activeClients,
      totalRevenue,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.project.count({
        where: {
          status: {
            in: ['PLANNING', 'IN_PROGRESS'],
          },
        },
      }),
      prisma.task.count(),
      prisma.task.count({
        where: {
          dueDate: {
            lt: new Date(),
          },
          status: {
            not: 'DONE',
          },
        },
      }),
      prisma.client.count({
        where: {
          status: 'ACTIVE',
        },
      }),
      prisma.project.aggregate({
        _sum: {
          budget: true,
        },
        where: {
          status: 'COMPLETED',
        },
      }),
    ])

    // Get recent activities
    const recentActivities = await prisma.activity.findMany({
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        project: {
          select: {
            id: true,
            name: true,
          },
        },
        task: {
          select: {
            id: true,
            title: true,
          },
        },
        client: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Get project status distribution
    const projectStatusDistribution = await prisma.project.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    // Get task status distribution
    const taskStatusDistribution = await prisma.task.groupBy({
      by: ['status'],
      _count: {
        status: true,
      },
    })

    // Calculate trends (mock data for now - in real app, you'd compare with previous periods)
    const trends = {
      projects: 12, // percentage increase
      activeProjects: 8,
      tasks: 23,
      overdueTasks: -15,
      clients: 5,
      revenue: 18,
    }

    const stats = {
      totalProjects,
      activeProjects,
      totalTasks,
      overdueTasks,
      activeClients,
      totalRevenue: totalRevenue._sum.budget || 0,
      trends,
      recentActivities,
      projectStatusDistribution,
      taskStatusDistribution,
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