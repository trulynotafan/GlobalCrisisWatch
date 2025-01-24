import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Incident } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type IncidentFormData = Omit<Incident, 'id' | 'createdAt' | 'reportedBy'>;

const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<IncidentFormData>();

  const onSubmit = async (data: IncidentFormData) => {
    try {
      // TODO: Implement API call
      console.log('Submitting incident:', data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit incident:', error);
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
            Report New Incident
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                {...register('title', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                placeholder="Brief incident description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                rows={3}
                placeholder="Detailed incident information"
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
                  <option value="active">Active</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
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
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Report</span>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReportIncidentModal; 