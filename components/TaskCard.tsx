'use client';

import { Task } from '@/types';
import { Calendar, Clock, Tag, User, MoreVertical, MessageCircle, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import { useModalStore } from '@/store/modalStore';
import { cn } from '@/utils/cn';

interface TaskCardProps {
  task: Task;
}

export default function TaskCard({ task }: TaskCardProps) {
  const { openTaskModal } = useModalStore();

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'CRITICAL':
        return 'Critical';
      case 'HIGH':
        return 'High';
      case 'MEDIUM':
        return 'Medium';
      case 'LOW':
        return 'Low';
      default:
        return 'Low';
    }
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div 
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => openTaskModal(task.id)}
    >
      {/* Priority and Actions */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "w-2 h-2 rounded-full",
            getPriorityColor(task.priority)
          )} />
          <span className="text-xs font-medium text-gray-600">
            {getPriorityText(task.priority)}
          </span>
        </div>
        <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>

      {/* Task Title */}
      <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
        {task.title}
      </h4>

      {/* Task Description */}
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Project Type Badge */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {task.project.type.replace('_', ' ')}
        </span>
      </div>

      {/* Task Meta Information */}
      <div className="space-y-2">
        {/* Due Date */}
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500">
            <Calendar className="h-3 w-3 mr-1" />
            <span className={cn(
              isOverdue ? "text-red-600 font-medium" : ""
            )}>
              {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              {isOverdue && " (Overdue)"}
            </span>
          </div>
        )}

        {/* Estimated Hours */}
        <div className="flex items-center text-xs text-gray-500">
          <Clock className="h-3 w-3 mr-1" />
          <span>Task in {task.project.title}</span>
        </div>

        {/* Assignee */}
        {task.assignee && (
          <div className="flex items-center text-xs text-gray-500">
            <User className="h-3 w-3 mr-1" />
            <span>Assigned to {task.assignee.name}</span>
          </div>
        )}
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Comments */}
          <div className="flex items-center text-xs text-gray-500">
            <MessageCircle className="h-3 w-3 mr-1" />
            <span>0</span>
          </div>

          {/* Attachments */}
          <div className="flex items-center text-xs text-gray-500">
            <Paperclip className="h-3 w-3 mr-1" />
            <span>0</span>
          </div>
        </div>

        {/* Created Date */}
        <div className="text-xs text-gray-400">
          {format(new Date(task.createdAt), 'MMM dd')}
        </div>
      </div>
    </div>
  );
} 