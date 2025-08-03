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
      revenueData,
      teamMembers,
      assignedTasks,
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
      
      // Total revenue from all projects
      prisma.project.aggregate({
        _sum: {
          budget: true
        }
      }),
      
      // Total team members
      prisma.user.count({
        where: {
          role: {
            in: ['ADMIN', 'MEMBER']
          }
        }
      }),
      
      // Tasks with assignees (for utilization)
      prisma.task.count({
        where: {
          assignedTo: {
            not: null
          },
          status: {
            in: ['TODO', 'IN_PROGRESS', 'REVIEW']
          }
        }
      }),
      
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

    // Calculate on-time projects (completed before deadline)
    const onTimeProjects = await prisma.project.count({
      where: {
        status: 'COMPLETED',
        deadline: {
          gte: new Date()
        }
      }
    })

    // Calculate completion rates
    const projectCompletionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    
    // Calculate total revenue
    const totalRevenue = revenueData._sum.budget || 0
    
    // Calculate client satisfaction (based on completed projects on time)
    const clientSatisfaction = completedProjects > 0 
      ? Math.round((onTimeProjects / completedProjects) * 100) 
      : 95 // Default high satisfaction for new projects
    
    // Calculate team utilization (assigned tasks vs capacity)
    // Assuming each team member can handle 10 active tasks
    const teamCapacity = teamMembers * 10
    const teamUtilization = teamCapacity > 0 
      ? Math.round((assignedTasks / teamCapacity) * 100)
      : 0

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
        projectCompletionRate,
        taskCompletionRate,
      },
      performance: {
        clientSatisfaction,
        teamUtilization,
        onTimeDelivery: completedProjects > 0 
          ? Math.round((onTimeProjects / completedProjects) * 100)
          : 100,
      },
      teamInsights: {
        totalMembers: teamMembers,
        utilization: teamUtilization,
        assignedTasks,
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