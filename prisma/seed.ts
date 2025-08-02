import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create users
  const user1 = await prisma.user.upsert({
    where: { email: 'john.doe@niyocreations.com' },
    update: {},
    create: {
      email: 'john.doe@niyocreations.com',
      name: 'John Doe',
      role: 'MANAGER',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=3b82f6&color=fff',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'sarah.smith@niyocreations.com' },
    update: {},
    create: {
      email: 'sarah.smith@niyocreations.com',
      name: 'Sarah Smith',
      role: 'USER',
      avatar: 'https://ui-avatars.com/api/?name=Sarah+Smith&background=8b5cf6&color=fff',
    },
  })

  const user3 = await prisma.user.upsert({
    where: { email: 'mike.johnson@niyocreations.com' },
    update: {},
    create: {
      email: 'mike.johnson@niyocreations.com',
      name: 'Mike Johnson',
      role: 'USER',
      avatar: 'https://ui-avatars.com/api/?name=Mike+Johnson&background=10b981&color=fff',
    },
  })

  // Create clients
  const client1 = await prisma.client.upsert({
    where: { email: 'john.smith@techcorp.com' },
    update: {},
    create: {
      name: 'John Smith',
      email: 'john.smith@techcorp.com',
      phone: '+1-555-0123',
      company: 'TechCorp Inc.',
      status: 'ACTIVE',
      notes: 'Primary contact for all IT projects',
    },
  })

  const client2 = await prisma.client.upsert({
    where: { email: 'emma.wilson@designstudio.com' },
    update: {},
    create: {
      name: 'Emma Wilson',
      email: 'emma.wilson@designstudio.com',
      phone: '+1-555-0456',
      company: 'Design Studio LLC',
      status: 'ACTIVE',
      notes: 'Interior design projects specialist',
    },
  })

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Modern Office Interior Design',
      description: 'Complete interior redesign for TechCorp\'s new office space',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2024-06-30'),
      budget: 75000,
      categories: JSON.stringify(['interior design', 'office']),
      tags: JSON.stringify(['modern', 'corporate', 'sustainable']),
      creatorId: user1.id,
    },
  })

  const project2 = await prisma.project.create({
    data: {
      name: 'E-commerce Website Development',
      description: 'Full-stack e-commerce platform for Design Studio',
      status: 'PLANNING',
      priority: 'MEDIUM',
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-08-15'),
      budget: 45000,
      categories: JSON.stringify(['it', 'web development']),
      tags: JSON.stringify(['e-commerce', 'react', 'node.js']),
      creatorId: user1.id,
    },
  })

  const project3 = await prisma.project.create({
    data: {
      name: 'Kitchen Renovation Project',
      description: 'Complete kitchen renovation for residential property',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-05-30'),
      budget: 35000,
      categories: JSON.stringify(['construction', 'renovation']),
      tags: JSON.stringify(['kitchen', 'residential', 'modern']),
      creatorId: user1.id,
    },
  })

  const project4 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Cross-platform mobile app for client management',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-07-31'),
      budget: 60000,
      categories: JSON.stringify(['it', 'mobile development']),
      tags: JSON.stringify(['react native', 'mobile', 'client management']),
      creatorId: user1.id,
    },
  })

  // Create project members
  const projectMembers = [
    { userId: user1.id, projectId: project1.id, role: 'owner' },
    { userId: user2.id, projectId: project1.id, role: 'member' },
    { userId: user3.id, projectId: project1.id, role: 'member' },
    { userId: user1.id, projectId: project2.id, role: 'owner' },
    { userId: user2.id, projectId: project2.id, role: 'admin' },
    { userId: user1.id, projectId: project3.id, role: 'owner' },
    { userId: user3.id, projectId: project3.id, role: 'member' },
    { userId: user1.id, projectId: project4.id, role: 'owner' },
    { userId: user2.id, projectId: project4.id, role: 'member' },
  ]

  for (const member of projectMembers) {
    await prisma.projectMember.upsert({
      where: { userId_projectId: { userId: member.userId, projectId: member.projectId } },
      update: member,
      create: member,
    })
  }

  // Create project clients
  const projectClients = [
    { clientId: client1.id, projectId: project1.id, role: 'client' },
    { clientId: client2.id, projectId: project2.id, role: 'client' },
    { clientId: client1.id, projectId: project4.id, role: 'client' },
  ]

  for (const client of projectClients) {
    await prisma.projectClient.upsert({
      where: { clientId_projectId: { clientId: client.clientId, projectId: client.projectId } },
      update: client,
      create: client,
    })
  }

  // Create tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Design Living Room Layout',
      description: 'Create detailed layout design for the main living area',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date('2024-02-15'),
      estimatedHours: 8,
      actualHours: 7.5,
      tags: JSON.stringify(['design', 'layout', 'living room']),
      projectId: project1.id,
      assigneeId: user2.id,
      creatorId: user1.id,
    },
  })

  const task2 = await prisma.task.create({
    data: {
      title: 'Select Furniture and Materials',
      description: 'Choose furniture pieces and material samples',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      dueDate: new Date('2024-03-01'),
      estimatedHours: 12,
      actualHours: 6,
      tags: JSON.stringify(['furniture', 'materials', 'selection']),
      projectId: project1.id,
      assigneeId: user2.id,
      creatorId: user1.id,
    },
  })

  const task3 = await prisma.task.create({
    data: {
      title: 'Database Schema Design',
      description: 'Design the database structure for the e-commerce platform',
      status: 'TODO',
      priority: 'HIGH',
      dueDate: new Date('2024-03-15'),
      estimatedHours: 16,
      tags: JSON.stringify(['database', 'schema', 'design']),
      projectId: project2.id,
      assigneeId: user3.id,
      creatorId: user1.id,
    },
  })

  const task4 = await prisma.task.create({
    data: {
      title: 'Kitchen Cabinets Installation',
      description: 'Install new kitchen cabinets and hardware',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date('2024-04-15'),
      estimatedHours: 20,
      actualHours: 12,
      tags: JSON.stringify(['installation', 'cabinets', 'kitchen']),
      projectId: project3.id,
      assigneeId: user3.id,
      creatorId: user1.id,
    },
  })

  const task5 = await prisma.task.create({
    data: {
      title: 'User Authentication System',
      description: 'Implement user authentication and authorization',
      status: 'REVIEW',
      priority: 'HIGH',
      dueDate: new Date('2024-02-28'),
      estimatedHours: 24,
      actualHours: 22,
      tags: JSON.stringify(['authentication', 'security', 'backend']),
      projectId: project4.id,
      assigneeId: user2.id,
      creatorId: user1.id,
    },
  })

  // Create comments
  const comments = [
    {
      content: 'Great work on the layout design! The client loved the modern approach.',
      authorId: user1.id,
      taskId: task1.id,
    },
    {
      content: 'I\'ve selected three different material options. Let me know which one you prefer.',
      authorId: user2.id,
      taskId: task2.id,
    },
    {
      content: 'The database schema looks comprehensive. Ready for review.',
      authorId: user3.id,
      taskId: task3.id,
    },
    {
      content: 'Cabinets are 60% installed. On track for completion.',
      authorId: user3.id,
      taskId: task4.id,
    },
    {
      content: 'Authentication system is working perfectly. Ready for testing.',
      authorId: user2.id,
      taskId: task5.id,
    },
  ]

  for (const comment of comments) {
    await prisma.comment.create({
      data: comment,
    })
  }

  // Create activities
  const activities = [
    {
      type: 'TASK_COMPLETED' as const,
      description: 'Sarah completed "Design Living Room Layout"',
      userId: user2.id,
      taskId: task1.id,
      projectId: project1.id,
    },
    {
      type: 'CLIENT_ADDED' as const,
      description: 'John Smith added as new client',
      userId: user1.id,
      clientId: client1.id,
    },
    {
      type: 'PROJECT_CREATED' as const,
      description: 'New project "Modern Office Interior Design" created',
      userId: user1.id,
      projectId: project1.id,
    },
    {
      type: 'COMMENT_ADDED' as const,
      description: 'Mike commented on "Database Schema Design"',
      userId: user3.id,
      taskId: task3.id,
      projectId: project2.id,
    },
  ]

  for (const activity of activities) {
    await prisma.activity.create({
      data: activity,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 