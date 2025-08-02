import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    // Test database connection by counting users
    const userCount = await prisma.user.count()
    
    return NextResponse.json({ 
      message: 'Database connection successful', 
      userCount,
      timestamp: new Date().toISOString() 
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Database connection failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 