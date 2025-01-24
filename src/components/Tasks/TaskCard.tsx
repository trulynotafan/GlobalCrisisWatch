import React from 'react';
import { Task } from '@/types';
import { format } from 'date-fns';
import { UserProfile } from '@auth0/nextjs-auth0/client';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onAssign: (taskId: string) => void;
  currentUser: UserProfile | undefined | null;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onAssign, currentUser }) => {
  const priorityColors = {
    high: 'text-red-400 bg-red-500/20',
    medium: 'text-yellow-400 bg-yellow-500/20',
    low: 'text-green-400 bg-green-500/20'
  };

  const statusColors = {
    pending: 'text-yellow-400 bg-yellow-500/20',
    'in-progress': 'text-blue-400 bg-blue-500/20',
    completed: 'text-green-400 bg-green-500/20'
  };

  return (
    <div className="bg-dark-secondary rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-dark-muted mt-1 text-sm">{task.description}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 text-xs rounded-full ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${statusColors[task.status]}`}>
            {task.status}
          </span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {task.deadline && (
          <p className="text-sm text-dark-muted">
            Deadline: {format(new Date(task.deadline), 'MMM dd, yyyy HH:mm')}
          </p>
        )}
        {task.assignedTo ? (
          <p className="text-sm text-dark-muted">Assigned to: {task.assignedTo}</p>
        ) : (
          currentUser && (
            <button
              onClick={() => onAssign(task.id)}
              className="text-sm text-blue-400 hover:text-blue-300"
            >
              Assign to me
            </button>
          )
        )}
      </div>

      <div className="mt-4 flex space-x-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className="bg-dark-accent text-dark-text rounded px-2 py-1 text-sm"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default TaskCard; 