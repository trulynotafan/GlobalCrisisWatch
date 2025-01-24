import React, { useState } from 'react';
import { format } from 'date-fns';
import { Message as MessageType } from '@/types/communication';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCommunicationStore } from '@/store/communicationStore';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const { deleteMessage, editMessage } = useCommunicationStore();

  const handleEdit = () => {
    if (!editContent.trim()) return;
    editMessage(message.id, editContent);
    setIsEditing(false);
  };

  const isOwnMessage = user?.email === message.sender;

  return (
    <div
      className={`p-3 rounded-lg ${
        message.type === 'alert'
          ? 'bg-red-500/20 border border-red-500/50'
          : message.type === 'update'
          ? 'bg-blue-500/20 border border-blue-500/50'
          : 'bg-dark-accent'
      }`}
    >
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium">{message.sender}</span>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-dark-muted">
            {format(new Date(message.timestamp), 'HH:mm')}
          </span>
          {isOwnMessage && (
            <div className="flex space-x-2">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-sm text-blue-400 hover:text-blue-300"
              >
                Edit
              </button>
              <button
                onClick={() => deleteMessage(message.id)}
                className="text-sm text-red-400 hover:text-red-300"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      {isEditing ? (
        <div className="mt-2 space-y-2">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-dark-primary rounded p-2 text-dark-text"
            rows={2}
          />
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 text-sm text-dark-muted hover:text-dark-text"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              className="px-2 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p>{message.content}</p>
      )}
    </div>
  );
};

export default Message; 