# Niyo Creations PM - Project Management & CRM

An **extremely intuitive and powerful** project management system optimized for **IT agencies, construction firms, and interior design companies**.

## 🎯 **INDUSTRY-FOCUSED FEATURES**

### **💻 IT Agency**
- **Sprint Velocity Tracking** - Monitor development team performance
- **Code Review Management** - Track and manage peer reviews  
- **Deployment Pipeline** - Visualize release cycles
- **Technical Task Types** - Bug fixes, features, DevOps, testing

### **🏗️ Construction Firm** 
- **Site Management** - Active project locations and safety tracking
- **BOQ Integration** - Bill of quantities and material management
- **Safety Incident Tracking** - Zero-incident goal monitoring
- **Phase-Based Planning** - Foundation, structure, finishing phases

### **🎨 Interior Design Studio**
- **Visual Project Stages** - Concept, design, approval, execution
- **Client Approval Workflow** - Design reviews and feedback cycles
- **Material & Vendor Management** - Supplier coordination
- **Site Visit Scheduling** - Client meetings and installations

## 🔐 **AUTHENTICATION & SECURITY**

### **Clerk Authentication Integration**
- **Secure user authentication** with modern OAuth providers
- **Role-based access control** (ADMIN, MEMBER, CLIENT)
- **Protected API routes** with authentication middleware  
- **User management** with profile customization
- **Session management** with automatic token refresh

### **Permission System**
- **ADMIN**: Full system access, user management, settings
- **MEMBER**: Project management, task assignment, client interaction
- **CLIENT**: Limited view access to assigned projects only

## 🚀 **KEY FEATURES**

### **📊 Industry-Specific Dashboards**
- **Dynamic filtering** by industry type (IT/Construction/Interior Design)
- **Custom metrics** tailored to each industry
- **Real-time stats** with progress indicators
- **Project health monitoring** across all teams

### **🎨 Enhanced Kanban Board**
- **Beautiful shadcn styling** with glass morphism effects
- **Smooth drag-and-drop** with visual feedback
- **Industry-aware task columns**: TODO → IN_PROGRESS → REVIEW → DONE
- **Real-time API synchronization**

### **📋 Comprehensive Project Management**
- **Tabbed project views**: Tasks, Documents, Timeline, Client Info
- **Team-based organization** with role management
- **Project type classification** for industry-specific workflows
- **Client-project linking** for comprehensive CRM

### **👥 Advanced CRM Module**
- **Complete client profiles** with contact management
- **Project history tracking** per client
- **Client statistics** and completion rates
- **Communication logs** and notes

### **📅 Smart Calendar Integration**
- **Task scheduling** with due date visualization
- **Multi-filter support**: project type, team, assignee, status, priority
- **Inline task creation** by clicking dates
- **Monthly overview** with task density indicators
- **Overdue and upcoming task alerts**

### **✅ Robust Form Validation**
- **Shadcn Dialog + Form + Zod** validation architecture
- **Task, Project, and Client forms** with proper error handling
- **Real-time validation** with user-friendly messages
- **Modal management system** with unified state

### **🧪 Comprehensive Testing Strategy**
- **Jest + React Testing Library** setup
- **Component testing** for UI reliability
- **Store/state management testing** for data integrity
- **API route testing** for backend reliability
- **Integration testing** for complete workflows

## 🛠 **TECHNOLOGY STACK**

### **Frontend**
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and better DX
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Radix UI** - Primitive components for complex interactions
- **React Hook Form + Zod** - Form management and validation
- **Zustand** - Lightweight state management
- **React Beautiful DnD** - Drag and drop functionality

### **Backend & Database**
- **Prisma ORM** - Type-safe database operations
- **SQLite** - Local development database
- **Next.js API Routes** - RESTful API endpoints
- **Server Components** - Optimized data fetching

### **Authentication & Security**
- **Clerk** - Modern authentication with OAuth providers
- **Middleware Protection** - Route-level access control
- **Role-based Permissions** - Granular access management
- **Webhook Integration** - Real-time user synchronization

### **Testing & Quality**
- **Jest** - JavaScript testing framework
- **React Testing Library** - Component testing utilities
- **TypeScript** - Compile-time error checking
- **ESLint** - Code quality and consistency

## 📁 **PROJECT STRUCTURE**

```
├── app/                     # Next.js 14 App Router
│   ├── api/                # API routes
│   │   ├── tasks/          # Task CRUD operations
│   │   ├── projects/       # Project management
│   │   ├── clients/        # Client CRM
│   │   ├── teams/          # Team management
│   │   └── users/          # User operations
│   ├── board/              # Kanban board page
│   ├── calendar/           # Calendar view
│   ├── clients/            # CRM module
│   ├── projects/           # Project management
│   └── globals.css         # Global styles + shadcn theme
├── components/             # Reusable UI components
│   ├── ui/                 # Shadcn base components
│   ├── forms/              # Form components with validation
│   ├── IndustryDashboard.tsx
│   ├── KanbanBoard.tsx
│   └── ModalManager.tsx
├── store/                  # Zustand state management
│   ├── boardStore.ts       # Kanban board state
│   └── modalStore.ts       # Modal management
├── types/                  # TypeScript definitions
├── lib/                    # Utility functions
├── prisma/                 # Database schema and migrations
├── __tests__/              # Test suites
└── utils/                  # Helper functions
```

## 🚀 **GETTING STARTED**

### **1. Installation**
```bash
npm install
```

### **2. Environment Configuration**
```bash
# Copy environment template
cp env.example .env.local

# Configure your environment variables:
# - DATABASE_URL="file:./dev.db"
# - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
# - CLERK_SECRET_KEY=your-clerk-secret-key
# - CLERK_WEBHOOK_SECRET=your-webhook-secret
```

### **3. Clerk Authentication Setup**
1. **Create a Clerk account** at [clerk.dev](https://clerk.dev)
2. **Create a new application** in your Clerk Dashboard
3. **Copy your keys** to `.env.local`
4. **Configure webhooks** (optional):
   - Endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Events: `user.created`, `user.updated`, `user.deleted`

### **4. Database Setup**
```bash
# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Seed with sample data
npm run db:seed
```

### **5. Development**
```bash
npm run dev
```

### **6. Testing**
```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

Visit [http://localhost:3000](http://localhost:3000) to start managing your projects!

## 📊 **SAMPLE DATA**

The system comes pre-populated with:
- **4 users** across different roles
- **3 teams** (IT Development, Construction Crew, Design Studio)
- **3 clients** representing each industry
- **4 projects** showcasing different project types
- **7 tasks** demonstrating various statuses and priorities

## 🎯 **CORE WORKFLOWS**

### **1. Project Creation**
1. Navigate to Projects → "New Project"
2. Select industry type (IT/Construction/Interior Design)
3. Assign team and client
4. Set deadline and description
5. Project automatically appears in industry dashboard

### **2. Task Management**
1. Use Kanban board for visual task tracking
2. Drag tasks between columns (TODO → IN_PROGRESS → REVIEW → DONE)
3. Filter by project type, team, assignee, priority
4. Set due dates visible in calendar view

### **3. Client Relationship Management**
1. Add clients with contact information
2. Link clients to projects
3. Track project progress per client
4. View client statistics and completion rates

### **4. Calendar Planning**
1. View tasks across all projects by due date
2. Filter by multiple criteria
3. Click dates to create new tasks
4. Monitor upcoming deadlines and overdue items

## 🔐 **ROLE-BASED ACCESS**

- **ADMIN**: Full system access, user management
- **MEMBER**: Project participation, task management  
- **CLIENT**: View-only access to their projects

## 🎨 **DESIGN SYSTEM**

- **Glass morphism** - Modern translucent UI elements
- **Industry-specific colors** - Blue (IT), Orange (Construction), Purple (Design)
- **Responsive design** - Mobile-first approach
- **Accessibility** - ARIA compliant, keyboard navigation
- **Dark mode ready** - CSS custom properties for theming

## 📈 **PERFORMANCE & SCALABILITY**

- **Server Components** - Reduced client-side JavaScript
- **Optimistic updates** - Immediate UI feedback
- **Efficient state management** - Zustand for minimal re-renders
- **Database indexing** - Optimized Prisma queries
- **Type safety** - Runtime error prevention

## 🧪 **TESTING COVERAGE**

- **Component tests** - UI behavior and rendering
- **Integration tests** - Complete user workflows  
- **Store tests** - State management reliability
- **API tests** - Backend functionality
- **Form validation tests** - Input handling and errors

## 🚀 **DEPLOYMENT READY**

The application is production-ready with:
- **Environment configuration** for different stages
- **Database migrations** for schema updates
- **Error handling** and user feedback
- **Security best practices** implemented
- **Performance optimizations** in place

---

**Built with ❤️ by Niyo Creations** - Transforming project management for modern industries.