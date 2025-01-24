import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Task } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface AssignTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TaskFormData = Omit<Task, 'id' | 'assignedTo'>;

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<TaskFormData>();

  const onSubmit = async (data: TaskFormData) => {
    try {
      // TODO: Implement API call
      console.log('Creating task:', data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
                {...register('title', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                placeholder="Task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                rows={3}
                placeholder="Task details"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  {...register('priority', { required: true })}
                  className="w-full bg-dark-accent rounded-lg p-2"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <select
                  {...register('status', { required: true })}
                  className="w-full bg-dark-accent rounded-lg p-2"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="datetime-local"
                {...register('deadline')}
                className="w-full bg-dark-accent rounded-lg p-2"
              />
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-dark-muted hover:text-dark-text transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <span>Create Task</span>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AssignTaskModal; 