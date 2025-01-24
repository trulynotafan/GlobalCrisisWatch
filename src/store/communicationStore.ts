import { create } from 'zustand';
import { Message, Channel } from '@/types/communication';

interface CommunicationStore {
  messages: Message[];
  channels: Channel[];
  activeChannel: string;
  addMessage: (message: Message) => void;
  setActiveChannel: (channelId: string) => void;
  addChannel: (channel: Channel) => void;
  deleteMessage: (messageId: string) => void;
  editMessage: (messageId: string, content: string) => void;
}

export const useCommunicationStore = create<CommunicationStore>((set) => ({
  messages: [
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
  ],
  channels: [
    { id: 'general', name: 'General', description: 'General communications', type: 'public' },
    { id: 'emergency', name: 'Emergency Alerts', description: 'Critical updates', type: 'emergency' },
    { id: 'medical', name: 'Medical Team', description: 'Medical response coordination', type: 'team' },
  ],
  activeChannel: 'general',
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  setActiveChannel: (channelId) => 
    set({ activeChannel: channelId }),
  addChannel: (channel) => 
    set((state) => ({ channels: [...state.channels, channel] })),
  deleteMessage: (messageId) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== messageId)
    })),
  editMessage: (messageId, content) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === messageId ? { ...msg, content } : msg
      )
    })),
})); 