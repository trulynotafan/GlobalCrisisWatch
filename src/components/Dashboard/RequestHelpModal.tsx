import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface RequestHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface HelpRequestFormData {
  type: 'medical' | 'rescue' | 'supplies' | 'evacuation' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  contactName: string;
  contactPhone: string;
  peopleAffected: number;
}

const RequestHelpModal: React.FC<RequestHelpModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<HelpRequestFormData>();

  const onSubmit = async (data: HelpRequestFormData) => {
    try {
      // TODO: Implement API call
      console.log('Submitting help request:', data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to submit help request:', error);
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
            Request Emergency Help
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type of Help Needed</label>
              <select
                {...register('type', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              >
                <option value="medical">Medical Assistance</option>
                <option value="rescue">Rescue Operation</option>
                <option value="supplies">Emergency Supplies</option>
                <option value="evacuation">Evacuation</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Urgency Level</label>
              <select
                {...register('urgency', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                rows={3}
                placeholder="Describe the situation and help needed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register('location.lat', { required: true })}
                    className="w-full bg-dark-accent rounded-lg p-2"
                    placeholder="Latitude"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    step="any"
                    {...register('location.lng', { required: true })}
                    className="w-full bg-dark-accent rounded-lg p-2"
                    placeholder="Longitude"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Name</label>
                <input
                  {...register('contactName', { required: true })}
                  className="w-full bg-dark-accent rounded-lg p-2"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone</label>
                <input
                  {...register('contactPhone', { required: true })}
                  className="w-full bg-dark-accent rounded-lg p-2"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Number of People Affected</label>
              <input
                type="number"
                {...register('peopleAffected', { required: true, min: 1 })}
                className="w-full bg-dark-accent rounded-lg p-2"
                placeholder="Number of people"
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
                className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Request Help</span>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default RequestHelpModal; 