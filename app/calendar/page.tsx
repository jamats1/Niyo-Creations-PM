'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Plus, 
  Filter,
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useModalStore } from '@/store/modalStore';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  dueDate: string | null;
  assignee: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  project: {
    id: string;
    title: string;
    type: 'IT' | 'CONSTRUCTION' | 'INTERIOR_DESIGN';
    team: {
      id: string;
      name: string;
    };
    client: {
      id: string;
      name: string;
    } | null;
  };
}

interface CalendarFilters {
  projectType: string;
  teamId: string;
  assigneeId: string;
  status: string;
  priority: string;
}

export default function CalendarPage() {
  const { openTaskModal } = useModalStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [filters, setFilters] = useState<CalendarFilters>({
    projectType: 'all',
    teamId: 'all',
    assigneeId: 'all',
    status: 'all',
    priority: 'all',
  });
  const [teams, setTeams] = useState<Array<{id: string; name: string}>>([]);
  const [users, setUsers] = useState<Array<{id: string; name: string}>>([]);

  useEffect(() => {
    fetchTasks();
    fetchTeams();
    fetchUsers();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data.filter((task: Task) => task.dueDate));
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      if (response.ok) {
        const data = await response.json();
        setTeams(data);
      }
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.projectType !== 'all' && task.project.type !== filters.projectType) return false;
    if (filters.teamId !== 'all' && task.project.team.id !== filters.teamId) return false;
    if (filters.assigneeId !== 'all' && task.assignee?.id !== filters.assigneeId) return false;
    if (filters.status !== 'all' && task.status !== filters.status) return false;
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    return true;
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const prevDate = new Date(year, month, -startingDayOfWeek + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Add days of the current month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Add empty cells to complete the grid
    const remainingCells = 42 - days.length; // 6 rows × 7 days = 42 cells
    for (let i = 1; i <= remainingCells; i++) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false });
    }
    
    return days;
  };

  const getTasksForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return filteredTasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'TODO': return <Clock className="h-3 w-3 text-gray-500" />;
      case 'IN_PROGRESS': return <div className="h-3 w-3 bg-blue-500 rounded-full animate-pulse" />;
      case 'REVIEW': return <AlertTriangle className="h-3 w-3 text-amber-500" />;
      case 'DONE': return <CheckCircle className="h-3 w-3 text-green-500" />;
      default: return <Clock className="h-3 w-3 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'border-l-green-500';
      case 'MEDIUM': return 'border-l-yellow-500';
      case 'HIGH': return 'border-l-orange-500';
      case 'CRITICAL': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IT': return '💻';
      case 'CONSTRUCTION': return '🏗️';
      case 'INTERIOR_DESIGN': return '🎨';
      default: return '📁';
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    // Open task modal with pre-filled due date
    openTaskModal();
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newDate;
    });
  };

  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const monthYear = currentDate.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-96 bg-white rounded-xl"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-2">Project Calendar</h1>
                  <p className="text-slate-600">View and manage tasks across all your projects</p>
                </div>
                <button 
                  onClick={() => openTaskModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Add Task
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-gray-600" />
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <select
                  value={filters.projectType}
                  onChange={(e) => setFilters(prev => ({ ...prev, projectType: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Project Types</option>
                  <option value="IT">💻 IT Development</option>
                  <option value="CONSTRUCTION">🏗️ Construction</option>
                  <option value="INTERIOR_DESIGN">🎨 Interior Design</option>
                </select>

                <select
                  value={filters.teamId}
                  onChange={(e) => setFilters(prev => ({ ...prev, teamId: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Teams</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>

                <select
                  value={filters.assigneeId}
                  onChange={(e) => setFilters(prev => ({ ...prev, assigneeId: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Assignees</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>

                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="DONE">Done</option>
                </select>

                <select
                  value={filters.priority}
                  onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="CRITICAL">Critical</option>
                </select>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 mb-6">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateMonth('prev')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <h2 className="text-xl font-semibold text-gray-900">{monthYear}</h2>
                  <button
                    onClick={() => navigateMonth('next')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Today
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="p-6">
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(currentDate).map((day, index) => {
                    const dayTasks = getTasksForDate(day.date);
                    const isCurrentDay = isToday(day.date);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => handleDateClick(day.date)}
                        className={`
                          min-h-[120px] p-2 border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                          ${day.isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-50 text-gray-400'}
                          ${isCurrentDay ? 'ring-2 ring-blue-500 bg-blue-50' : ''}
                        `}
                      >
                        <div className={`text-sm font-medium mb-2 ${isCurrentDay ? 'text-blue-600' : ''}`}>
                          {day.date.getDate()}
                        </div>
                        
                        <div className="space-y-1">
                          {dayTasks.slice(0, 3).map(task => (
                            <div
                              key={task.id}
                              className={`text-xs p-1 rounded border-l-2 bg-gray-50 hover:bg-gray-100 transition-colors ${getPriorityColor(task.priority)}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                // Could open task detail modal here
                              }}
                            >
                              <div className="flex items-center gap-1 mb-1">
                                {getStatusIcon(task.status)}
                                <span className="text-xs">{getTypeIcon(task.project.type)}</span>
                              </div>
                              <div className="font-medium text-gray-900 truncate">
                                {task.title}
                              </div>
                              {task.assignee && (
                                <div className="text-gray-600 truncate">
                                  {task.assignee.name}
                                </div>
                              )}
                            </div>
                          ))}
                          
                          {dayTasks.length > 3 && (
                            <div className="text-xs text-gray-500 text-center py-1">
                              +{dayTasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Task Summary */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredTasks.length}</div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredTasks.filter(t => new Date(t.dueDate!) < today && t.status !== 'DONE').length}
                  </div>
                  <div className="text-sm text-gray-600">Overdue</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredTasks.filter(t => {
                      const dueDate = new Date(t.dueDate!);
                      const diffTime = dueDate.getTime() - today.getTime();
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7 && diffDays >= 0 && t.status !== 'DONE';
                    }).length}
                  </div>
                  <div className="text-sm text-gray-600">Due This Week</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredTasks.filter(t => t.status === 'DONE').length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}