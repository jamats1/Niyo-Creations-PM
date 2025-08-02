'use client';

import { 
  CheckCircle, 
  UserPlus, 
  FileText, 
  MessageSquare, 
  Calendar,
  AlertCircle,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const activities = [
  {
    id: '1',
    type: 'task-completed',
    title: 'Task completed',
    description: 'Sarah completed "Design Living Room Layout"',
    project: 'Modern Office Interior Design',
    time: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  {
    id: '2',
    type: 'client-added',
    title: 'New client added',
    description: 'John Smith added as new client',
    project: 'E-commerce Website Development',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: UserPlus,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  {
    id: '3',
    type: 'document-uploaded',
    title: 'Document uploaded',
    description: 'Kitchen renovation plans uploaded',
    project: 'Kitchen Renovation Project',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    icon: FileText,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  {
    id: '4',
    type: 'comment-added',
    title: 'Comment added',
    description: 'Mike commented on "Mobile App Development"',
    project: 'Mobile App Development',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    icon: MessageSquare,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  {
    id: '5',
    type: 'meeting-scheduled',
    title: 'Meeting scheduled',
    description: 'Client meeting scheduled for tomorrow',
    project: 'Modern Office Interior Design',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    icon: Calendar,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  {
    id: '6',
    type: 'task-overdue',
    title: 'Task overdue',
    description: 'Kitchen renovation task is overdue',
    project: 'Kitchen Renovation Project',
    time: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
];

const getTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  } else if (diffInMinutes < 1440) {
    const hours = Math.floor(diffInMinutes / 60);
    return `${hours}h ago`;
  } else {
    const days = Math.floor(diffInMinutes / 1440);
    return `${days}d ago`;
  }
};

export default function ActivityFeed() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
        <p className="text-sm text-gray-600 mt-1">
          Latest updates and activities
        </p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {/* Activity Icon */}
              <div className={`p-2 rounded-lg ${activity.bgColor} flex-shrink-0`}>
                <activity.icon className={`h-4 w-4 ${activity.color}`} />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900">
                    {activity.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getTimeAgo(activity.time)}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mt-1">
                  {activity.description}
                </p>
                
                <p className="text-xs text-gray-500 mt-1">
                  {activity.project}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
} 