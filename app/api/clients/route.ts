import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      include: {
        address: true,
        projects: {
          include: {
            project: {
              select: {
                id: true,
                name: true,
                status: true,
                priority: true,
              },
            },
          },
        },
        _count: {
          select: {
            projects: true,
            comments: true,
            activities: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      email,
      phone,
      company,
      status,
      notes,
      address,
    } = body

    const client = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        company,
        status,
        notes,
        address: address ? {
          create: {
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
          },
        } : undefined,
      },
      include: {
        address: true,
      },
    })

    return NextResponse.json(client, { status: 201 })
  } catch (error) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      { error: 'Failed to create client' },
      { status: 500 }
    )
  }
} 