import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { Resource } from '@/types';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

type ResourceFormData = Omit<Resource, 'id' | 'providedBy'>;

const ResourcesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resources, setResources] = useState<Resource[]>([
    {
      id: '1',
      type: 'medical',
      quantity: 100,
      location: { lat: 40.7128, lng: -74.006 },
      status: 'available',
      providedBy: 'Hospital A'
    },
    // Add more mock data
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ResourceFormData>();

  const onSubmit = async (data: ResourceFormData) => {
    setIsLoading(true);
    try {
      // TODO: Implement API call
      const newResource: Resource = {
        ...data,
        id: Date.now().toString(),
        providedBy: 'Current User'
      };
      setResources([...resources, newResource]);
      setIsModalOpen(false);
      reset();
    } catch (error) {
      console.error('Failed to add resource:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resourceTypeIcons: Record<Resource['type'], string> = {
    medical: '🏥',
    food: '🍲',
    water: '💧',
    shelter: '🏠',
    transport: '🚗'
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Resources</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition"
          >
            Add Resource
          </button>
        </div>

        {/* Resource Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-dark-secondary rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{resourceTypeIcons[resource.type]}</span>
                    <h3 className="text-lg font-semibold capitalize">{resource.type}</h3>
                  </div>
                  <p className="text-dark-muted mt-1">Quantity: {resource.quantity}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  resource.status === 'available' 
                    ? 'bg-green-500/20 text-green-400'
                    : resource.status === 'allocated'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {resource.status}
                </span>
              </div>
              <div className="mt-4">
                <p className="text-sm text-dark-muted">Provided by: {resource.providedBy}</p>
                <div className="mt-4 flex space-x-2">
                  <button className="px-3 py-1 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/30 transition">
                    View Details
                  </button>
                  <button className="px-3 py-1 bg-green-600/20 text-green-400 rounded hover:bg-green-600/30 transition">
                    Request
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Resource Modal */}
        <Dialog
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  >
                    <option value="medical">Medical</option>
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
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <select
                    {...register('status', { required: true })}
                    className="w-full bg-dark-accent text-dark-text rounded-lg p-2"
                  >
                    <option value="available">Available</option>
                    <option value="allocated">Allocated</option>
                    <option value="depleted">Depleted</option>
                  </select>
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
                        <span className="ml-2">Adding...</span>
                      </>
                    ) : (
                      'Add Resource'
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

export default ResourcesPage; 