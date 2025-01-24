import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Task } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';
import TaskCard from '@/components/Tasks/TaskCard';
import { useUser } from '@auth0/nextjs-auth0/client';
import TaskFilters from '@/components/Tasks/TaskFilters';

type TaskFormData = Omit<Task, 'id' | 'assignedTo'>;

const TasksPage: React.FC = () => {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Medical Supply Distribution',
      description: 'Distribute medical supplies to affected areas in downtown',
      status: 'pending',
      priority: 'high',
      location: { lat: 40.7128, lng: -74.006 },
      deadline: new Date('2024-02-20')
    },
    {
      id: '2',
      title: 'Evacuation Assistance',
      description: 'Help evacuate residents from flood-prone areas',
      status: 'in-progress',
      priority: 'high',
      location: { lat: 40.7128, lng: -74.006 },
      assignedTo: 'John Doe',
      deadline: new Date('2024-02-19')
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<Task['status'] | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Task['priority'] | 'all'>('all');
  const [sortBy, setSortBy] = useState<'deadline' | 'priority' | 'status'>('deadline');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TaskFormData>();

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const newTask: Task = {
        ...data,
        id: Date.now().toString(),
        status: 'pending'
      };
      setTasks([...tasks, newTask]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleAssign = (taskId: string) => {
    if (!user) return;
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, assignedTo: user.name || user.email } : task
    ));
  };

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      switch (sortBy) {
        case 'deadline':
          if (!a.deadline) return 1;
          if (!b.deadline) return -1;
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        case 'priority':
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        case 'status':
          const statusOrder = { pending: 0, 'in-progress': 1, completed: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });
  };

  const filteredTasks = tasks
    .filter(task => filter === 'all' ? true : task.status === filter)
    .filter(task => priorityFilter === 'all' ? true : task.priority === priorityFilter);

  const sortedAndFilteredTasks = sortTasks(filteredTasks);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Tasks</h1>
            <p className="text-dark-muted mt-1">Manage and track response tasks</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            Create Task
          </button>
        </div>

        <TaskFilters
          currentFilter={filter}
          currentSort={sortBy}
          onFilterChange={setFilter}
          onSortChange={setSortBy}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Task Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedAndFilteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onAssign={handleAssign}
              currentUser={user}
            />
          ))}
        </div>

        {/* Create Task Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-dark-secondary rounded-lg p-6 max-w-md w-full">
              <Dialog.Title className="text-xl font-semibold mb-4">
                Create New Task
              </Dialog.Title>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <input
                    type="text"
                    {...register('title', { required: true })}
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <textarea
                    {...register('description', { required: true })}
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Priority</label>
                  <select
                    {...register('priority', { required: true })}
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Deadline</label>
                  <input
                    type="datetime-local"
                    {...register('deadline')}
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  />
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-dark-muted hover:text-dark-text transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <LoadingSpinner size="sm" />
                        <span className="ml-2">Creating...</span>
                      </>
                    ) : (
                      'Create Task'
                    )}
                  </button>
                </div>
              </form>
            </Dialog.Panel>
          </div>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default TasksPage; 