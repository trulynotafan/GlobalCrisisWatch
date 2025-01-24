import React from 'react';
import { Dialog } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { Channel } from '@/types/communication';
import { useCommunicationStore } from '@/store/communicationStore';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ChannelFormData = Omit<Channel, 'id'>;

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset } = useForm<ChannelFormData>();
  const addChannel = useCommunicationStore((state) => state.addChannel);

  const onSubmit = (data: ChannelFormData) => {
    addChannel({
      id: Date.now().toString(),
      ...data
    });
    reset();
    onClose();
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
            Create New Channel
          </Dialog.Title>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Channel Name</label>
              <input
                {...register('name', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                {...register('description', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                {...register('type', { required: true })}
                className="w-full bg-dark-accent rounded-lg p-2"
              >
                <option value="public">Public</option>
                <option value="emergency">Emergency</option>
                <option value="team">Team</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-dark-muted hover:text-dark-text"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create Channel
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CreateChannelModal; 