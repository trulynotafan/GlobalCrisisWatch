import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Resource } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

interface AddResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ResourceFormData = Omit<Resource, 'id' | 'providedBy'>;

const AddResourceModal: React.FC<AddResourceModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ResourceFormData>();

  const onSubmit = async (data: ResourceFormData) => {
    try {
      // TODO: Implement API call
      console.log('Adding resource:', data);
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add resource:', error);
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
            Add New Resource
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                {...register('type', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              >
                <option value="medical">Medical Supplies</option>
                <option value="food">Food</option>
                <option value="water">Water</option>
                <option value="shelter">Shelter</option>
                <option value="transport">Transport</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <input
                type="number"
                {...register('quantity', { required: true, min: 1 })}
                className="w-full bg-dark-accent rounded-lg p-2"
                placeholder="Enter quantity"
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

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                {...register('status', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              >
                <option value="available">Available</option>
                <option value="allocated">Allocated</option>
                <option value="depleted">Depleted</option>
              </select>
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
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Resource</span>
                )}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddResourceModal; 