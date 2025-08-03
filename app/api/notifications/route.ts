import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // For now, we'll use the Clerk userId to find the user in our database
    // In production, you'd sync Clerk users with your database users
    const user = await prisma.user.findFirst({
      where: { email: { contains: userId } }
    })

    if (!user) {
      // Create some sample notifications if no user found (for demo)
      return NextResponse.json({
        notifications: [],
        unreadCount: 0
      })
    }

    // Get unread parameter from query
    const unread = request.nextUrl.searchParams.get('unread') === 'true'

    const notifications = await prisma.notification.findMany({
      where: {
        userId: user.id,
        ...(unread && { read: false })
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 most recent
    })

    // Get unread count
    const unreadCount = await prisma.notification.count({
      where: {
        userId: user.id,
        read: false
      }
    })

    return NextResponse.json({
      notifications,
      unreadCount
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

// Mark notification as read
export async function PATCH(request: NextRequest) {
  try {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { notificationId, markAllRead } = body

    if (markAllRead) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: {
          userId: userId,
          read: false
        },
        data: {
          read: true
        }
      })
      return NextResponse.json({ success: true })
    }

    if (notificationId) {
      // Mark single notification as read
      await prisma.notification.update({
        where: {
          id: notificationId,
          userId: userId
        },
        data: {
          read: true
        }
      })
      return NextResponse.json({ success: true })
    }

    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating notification:', error)
    return NextResponse.json(
      { error: 'Failed to update notification' },
      { status: 500 }
    )
  }
}