import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data
  await prisma.task.deleteMany()
  await prisma.document.deleteMany()
  await prisma.project.deleteMany()
  await prisma.teamMember.deleteMany()
  await prisma.team.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()

  // Create users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@niyo.com',
        name: 'Admin User',
        role: 'ADMIN',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
      },
    }),
    prisma.user.create({
      data: {
        email: 'john@niyo.com',
        name: 'John Smith',
        role: 'MEMBER',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john',
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah@niyo.com',
        name: 'Sarah Connor',
        role: 'MEMBER',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike@niyo.com',
        name: 'Mike Johnson',
        role: 'MEMBER',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      },
    }),
  ])

  // Create teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'IT Development Team',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Construction Crew Alpha',
      },
    }),
    prisma.team.create({
      data: {
        name: 'Design Studio',
      },
    }),
  ])

  // Create team members
  await Promise.all([
    // IT Team
    prisma.teamMember.create({
      data: {
        userId: users[0].id,
        teamId: teams[0].id,
        role: 'ADMIN',
      },
    }),
    prisma.teamMember.create({
      data: {
        userId: users[1].id,
        teamId: teams[0].id,
        role: 'MEMBER',
      },
    }),
    // Construction Team
    prisma.teamMember.create({
      data: {
        userId: users[2].id,
        teamId: teams[1].id,
        role: 'ADMIN',
      },
    }),
    // Design Team
    prisma.teamMember.create({
      data: {
        userId: users[3].id,
        teamId: teams[2].id,
        role: 'ADMIN',
      },
    }),
  ])

  // Create clients
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'TechCorp Solutions',
        email: 'contact@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Solutions Inc.',
        notes: 'Long-term IT partner, prefers agile methodology',
      },
    }),
    prisma.client.create({
      data: {
        name: 'BuildRight Construction',
        email: 'info@buildright.com',
        phone: '+1-555-0456',
        company: 'BuildRight Construction LLC',
        notes: 'Commercial construction projects, safety focused',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Elegant Interiors',
        email: 'hello@elegantinteriors.com',
        phone: '+1-555-0789',
        company: 'Elegant Interiors Studio',
        notes: 'High-end residential projects, detail-oriented',
      },
    }),
  ])

  // Create projects
  const projects = await Promise.all([
    // IT Projects
    prisma.project.create({
      data: {
        title: 'E-commerce Platform Redesign',
        description: 'Complete overhaul of the existing e-commerce platform with modern UI/UX',
        type: 'IT',
        status: 'EXECUTING',
        budget: 85000,
        teamId: teams[0].id,
        clientId: clients[0].id,
        deadline: new Date('2024-06-30'),
      },
    }),
    prisma.project.create({
      data: {
        title: 'Mobile App Development',
        description: 'Native iOS and Android app for customer engagement',
        type: 'IT',
        status: 'PLANNING',
        budget: 120000,
        teamId: teams[0].id,
        clientId: clients[0].id,
        deadline: new Date('2024-08-15'),
      },
    }),
    // Construction Projects
    prisma.project.create({
      data: {
        title: 'Office Building Renovation',
        description: 'Complete renovation of 5-story office building including HVAC and electrical',
        type: 'CONSTRUCTION',
        status: 'EXECUTING',
        budget: 450000,
        teamId: teams[1].id,
        clientId: clients[1].id,
        deadline: new Date('2024-09-30'),
      },
    }),
    // Interior Design Projects
    prisma.project.create({
      data: {
        title: 'Luxury Apartment Design',
        description: 'Full interior design for penthouse apartment with custom furniture',
        type: 'INTERIOR_DESIGN',
        status: 'REVIEW',
        budget: 75000,
        teamId: teams[2].id,
        clientId: clients[2].id,
        deadline: new Date('2024-05-20'),
      },
    }),
  ])

  // Create tasks
  const tasks = [
    // E-commerce Platform tasks
    {
      title: 'Set up development environment',
      description: 'Configure local development environment and CI/CD pipeline',
      status: 'DONE' as const,
      priority: 'HIGH' as const,
      projectId: projects[0].id,
      assignedTo: users[1].id,
    },
    {
      title: 'Design user authentication flow',
      description: 'Create wireframes and user flows for login/registration',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projects[0].id,
      assignedTo: users[1].id,
      dueDate: new Date('2024-02-15'),
    },
    {
      title: 'Implement shopping cart functionality',
      description: 'Build and test shopping cart with payment integration',
      status: 'TODO' as const,
      priority: 'MEDIUM' as const,
      projectId: projects[0].id,
      dueDate: new Date('2024-02-28'),
    },
    // Office Building tasks
    {
      title: 'Electrical inspection',
      description: 'Schedule and complete electrical systems inspection',
      status: 'TODO' as const,
      priority: 'CRITICAL' as const,
      projectId: projects[2].id,
      assignedTo: users[2].id,
      dueDate: new Date('2024-02-10'),
    },
    {
      title: 'HVAC installation',
      description: 'Install new HVAC system on floors 3-5',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projects[2].id,
      assignedTo: users[2].id,
    },
    // Luxury Apartment tasks
    {
      title: 'Color palette selection',
      description: 'Present color schemes to client for approval',
      status: 'REVIEW' as const,
      priority: 'MEDIUM' as const,
      projectId: projects[3].id,
      assignedTo: users[3].id,
      dueDate: new Date('2024-02-05'),
    },
    {
      title: 'Custom furniture design',
      description: 'Design custom dining table and bedroom furniture',
      status: 'IN_PROGRESS' as const,
      priority: 'HIGH' as const,
      projectId: projects[3].id,
      assignedTo: users[3].id,
    },
  ]

  await Promise.all(
    tasks.map(task => prisma.task.create({ data: task }))
  )

  console.log('✅ Database seeded successfully!')
  console.log(`Created:`)
  console.log(`- ${users.length} users`)
  console.log(`- ${teams.length} teams`)
  console.log(`- ${clients.length} clients`)
  console.log(`- ${projects.length} projects`)
  console.log(`- ${tasks.length} tasks`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })