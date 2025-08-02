'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import { Calendar, Clock, Users, MapPin, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'milestone';
  date: string;
  time?: string;
  description?: string;
  attendees?: string[];
  location?: string;
  project?: {
    name: string;
    color: string;
  };
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    // Mock events - in real app, fetch from API
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Client Meeting - TechCorp',
        type: 'meeting',
        date: '2024-01-15',
        time: '10:00 AM',
        description: 'Discuss project requirements and timeline',
        attendees: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
        location: 'Conference Room A',
        project: { name: 'Modern Office Interior Design', color: 'bg-blue-500' }
      },
      {
        id: '2',
        title: 'Design Review Deadline',
        type: 'deadline',
        date: '2024-01-20',
        description: 'Submit final design mockups for client approval',
        project: { name: 'Modern Office Interior Design', color: 'bg-blue-500' }
      },
      {
        id: '3',
        title: 'Project Milestone - Phase 1 Complete',
        type: 'milestone',
        date: '2024-01-25',
        description: 'First phase of kitchen renovation completed',
        project: { name: 'Kitchen Renovation Project', color: 'bg-green-500' }
      },
      {
        id: '4',
        title: 'Team Standup',
        type: 'meeting',
        date: '2024-01-18',
        time: '9:00 AM',
        description: 'Daily team standup meeting',
        attendees: ['John Doe', 'Sarah Smith', 'Mike Johnson'],
        location: 'Virtual Meeting'
      }
    ];
    setEvents(mockEvents);
  }, []);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800';
      case 'deadline': return 'bg-red-100 text-red-800';
      case 'milestone': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meeting': return <Users className="h-3 w-3" />;
      case 'deadline': return <Clock className="h-3 w-3" />;
      case 'milestone': return <Calendar className="h-3 w-3" />;
      default: return <Calendar className="h-3 w-3" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <div className="w-full">
            {/* Page Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Calendar</h1>
                  <p className="text-gray-600">Schedule meetings, track deadlines, and manage project timelines</p>
                </div>
                <button className="btn btn-primary flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Event</span>
                </button>
              </div>
            </div>

            {/* Calendar Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-lg overflow-hidden">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="bg-gray-50 p-3 text-center">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                ))}

                {/* Calendar Days */}
                {daysInMonth.map((day) => {
                  const dayEvents = getEventsForDate(day);
                  const isToday = isSameDay(day, new Date());
                  const isSelected = selectedDate && isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, currentDate);

                  return (
                    <div
                      key={day.toString()}
                      className={`min-h-32 bg-white p-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                        isToday ? 'bg-blue-50' : ''
                      } ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-blue-600' : 
                        isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      
                      {/* Events */}
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`p-1 rounded text-xs flex items-center space-x-1 ${getEventTypeColor(event.type)}`}
                          >
                            {getEventTypeIcon(event.type)}
                            <span className="truncate">{event.title}</span>
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500 text-center">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Events for {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                </h3>
                
                {getEventsForDate(selectedDate).length > 0 ? (
                  <div className="space-y-4">
                    {getEventsForDate(selectedDate).map((event) => (
                      <div key={event.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                            {event.project && (
                              <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${event.project.color}`}>
                                {event.project.name}
                              </span>
                            )}
                          </div>
                          {event.time && (
                            <span className="text-sm text-gray-600 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {event.time}
                            </span>
                          )}
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                        {event.description && (
                          <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          {event.location && (
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{event.location}</span>
                            </div>
                          )}
                          
                          {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-1" />
                              <span>{event.attendees.length} attendees</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No events scheduled for this date</p>
                    <button className="mt-4 btn btn-primary">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Event
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Upcoming Events */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              
              <div className="space-y-3">
                {events
                  .filter(event => new Date(event.date) > new Date())
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => (
                    <div key={event.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`p-2 rounded-full ${getEventTypeColor(event.type)}`}>
                        {getEventTypeIcon(event.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">
                          {format(new Date(event.date), 'MMM d, yyyy')}
                          {event.time && ` at ${event.time}`}
                        </p>
                      </div>
                      {event.project && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${event.project.color}`}>
                          {event.project.name}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 