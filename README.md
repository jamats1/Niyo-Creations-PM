# Niyo Creations PM - Project Management & CRM

A comprehensive project management and CRM system built for interior design, construction, and IT projects. Built with the latest modern tech stack including Next.js 14, TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Features

### Core Project Management
- **Kanban Board**: Drag and drop task management with real-time updates
- **Project Tracking**: Complete project lifecycle management
- **Task Management**: Create, assign, and track tasks with priorities
- **Team Collaboration**: Assign team members and track progress
- **Time Tracking**: Estimate and track actual hours spent on tasks

### CRM Functionality
- **Client Management**: Store and manage client information
- **Project History**: Track all projects for each client
- **Communication Log**: Keep track of client interactions
- **Document Management**: Upload and organize project documents

### Dashboard & Analytics
- **Real-time Dashboard**: Overview of all projects and tasks
- **Progress Tracking**: Visual progress indicators for projects
- **Performance Metrics**: Track team productivity and project success
- **Activity Feed**: Real-time updates on project activities

### Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode**: Toggle between themes
- **Drag & Drop**: Intuitive task management
- **Real-time Updates**: Live collaboration features
- **Beautiful Animations**: Smooth transitions and interactions

## 🛠 Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Zustand**: Lightweight state management
- **React Beautiful DnD**: Drag and drop functionality
- **Lucide React**: Beautiful icons
- **Framer Motion**: Smooth animations

### UI Components
- **Radix UI**: Accessible component primitives
- **React Hook Form**: Form handling
- **Zod**: Schema validation
- **React Avatar**: User avatar components
- **Date-fns**: Date manipulation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/niyo-creations-pm.git
   cd niyo-creations-pm
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your configuration:
   ```env
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗 Project Structure

```
niyo-creations-pm/
├── app/                    # Next.js App Router pages
│   ├── board/             # Kanban board page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # Reusable React components
│   ├── Header.tsx         # Application header
│   ├── Sidebar.tsx        # Navigation sidebar
│   ├── KanbanBoard.tsx    # Main board component
│   ├── KanbanColumn.tsx   # Board column component
│   ├── TaskCard.tsx       # Individual task card
│   └── ...                # Other components
├── store/                 # Zustand state management
│   ├── boardStore.ts      # Board state management
│   └── modalStore.ts      # Modal state management
├── types/                 # TypeScript type definitions
│   └── index.d.ts         # Main type definitions
├── utils/                 # Utility functions
│   └── cn.ts             # Class name utility
├── public/               # Static assets
└── package.json          # Dependencies and scripts
```

## 🎯 Key Features Explained

### Kanban Board
The Kanban board provides a visual way to manage tasks across different stages:
- **To Do**: New tasks that need to be started
- **In Progress**: Tasks currently being worked on
- **Review**: Tasks ready for review or testing
- **Done**: Completed tasks

### Drag & Drop
Tasks can be dragged between columns to update their status. The board automatically saves the new state and provides visual feedback during dragging.

### Real-time Updates
All changes are reflected immediately across the application using Zustand for state management.

### Responsive Design
The application is fully responsive and works seamlessly on all device sizes.

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Add your database and API keys here when integrating backend
```

### Customization
- **Colors**: Modify the color scheme in `tailwind.config.js`
- **Components**: Customize components in the `components/` directory
- **Styling**: Update global styles in `app/globals.css`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you need help or have questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

## 🎉 Acknowledgments

- Built with inspiration from modern project management tools
- Icons from [Lucide](https://lucide.dev/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Niyo Creations PM** - Streamlining project management for creative businesses. 