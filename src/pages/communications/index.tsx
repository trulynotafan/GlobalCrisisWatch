import React, { useState } from 'react';
import MainLayout from '@/components/Layout/MainLayout';
import { useUser } from '@auth0/nextjs-auth0/client';
import { format } from 'date-fns';

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  type: 'text' | 'alert' | 'update';
  channel: string;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  type: 'public' | 'emergency' | 'team';
}

const CommunicationsPage: React.FC = () => {
  const { user } = useUser();
  const [activeChannel, setActiveChannel] = useState<string>('general');
  const [messageInput, setMessageInput] = useState('');

  // Mock data
  const channels: Channel[] = [
    { id: 'general', name: 'General', description: 'General communications', type: 'public' },
    { id: 'emergency', name: 'Emergency Alerts', description: 'Critical updates', type: 'emergency' },
    { id: 'medical', name: 'Medical Team', description: 'Medical response coordination', type: 'team' },
  ];

  const messages: Message[] = [
    {
      id: '1',
      content: 'New medical supplies available at Central Hospital',
      sender: 'Medical Coordinator',
      timestamp: new Date('2024-02-18T10:00:00'),
      type: 'update',
      channel: 'general'
    },
    {
      id: '2',
      content: '⚠️ Flash flood warning in downtown area',
      sender: 'Emergency Response',
      timestamp: new Date('2024-02-18T10:30:00'),
      type: 'alert',
      channel: 'emergency'
    },
  ];

  const filteredMessages = messages.filter(msg => msg.channel === activeChannel);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !user) return;

    // TODO: Implement actual message sending
    console.log('Sending message:', messageInput);
    setMessageInput('');
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-theme(spacing.16))]">
        <div className="grid grid-cols-4 gap-4 h-full">
          {/* Channels Sidebar */}
          <div className="col-span-1 bg-dark-secondary rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4">Channels</h2>
            <div className="space-y-2">
              {channels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => setActiveChannel(channel.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    activeChannel === channel.id
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-dark-accent'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {channel.type === 'emergency' && <span>🚨</span>}
                    {channel.type === 'team' && <span>👥</span>}
                    {channel.type === 'public' && <span>#</span>}
                    <span>{channel.name}</span>
                  </div>
                  <p className="text-sm text-dark-muted truncate">
                    {channel.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Messages Area */}
          <div className="col-span-3 bg-dark-secondary rounded-lg flex flex-col">
            {/* Channel Header */}
            <div className="p-4 border-b border-dark-accent">
              <h2 className="text-lg font-semibold">
                {channels.find(c => c.id === activeChannel)?.name}
              </h2>
              <p className="text-sm text-dark-muted">
                {channels.find(c => c.id === activeChannel)?.description}
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {filteredMessages.map(message => (
                <div
                  key={message.id}
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
                    <span className="text-sm text-dark-muted">
                      {format(message.timestamp, 'HH:mm')}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-dark-accent">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-dark-accent rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunicationsPage; 