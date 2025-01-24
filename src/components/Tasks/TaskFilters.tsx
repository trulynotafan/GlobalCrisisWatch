import React from 'react';
import { Task } from '@/types';

interface TaskFiltersProps {
  currentFilter: Task['status'] | 'all';
  currentSort: 'deadline' | 'priority' | 'status';
  onFilterChange: (filter: Task['status'] | 'all') => void;
  onSortChange: (sort: 'deadline' | 'priority' | 'status') => void;
  priorityFilter: Task['priority'] | 'all';
  onPriorityFilterChange: (priority: Task['priority'] | 'all') => void;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  currentSort,
  onFilterChange,
  onSortChange,
  priorityFilter,
  onPriorityFilterChange
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Status Filter</label>
          <div className="flex space-x-2 bg-dark-secondary p-2 rounded-lg">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => onFilterChange(status)}
                className={`px-4 py-2 rounded-lg transition flex-1 ${
                  currentFilter === status
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-dark-accent'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Priority Filter</label>
          <div className="flex space-x-2 bg-dark-secondary p-2 rounded-lg">
            {(['all', 'high', 'medium', 'low'] as const).map((priority) => (
              <button
                key={priority}
                onClick={() => onPriorityFilterChange(priority)}
                className={`px-4 py-2 rounded-lg transition flex-1 ${
                  priorityFilter === priority
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-dark-accent'
                }`}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Sort By</label>
          <select
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value as 'deadline' | 'priority' | 'status')}
            className="w-full bg-dark-secondary text-dark-text rounded-lg p-2"
          >
            <option value="deadline">Deadline</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters; 