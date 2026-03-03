import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface HistoryItem {
  id: string;
  roomName: string;
  location: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Approved' | 'Rejected';
  iconType: 'DoorOpen' | 'Monitor';
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: HistoryItem) => void;
  deleteFromHistory: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: '1',
      roomName: 'Lecture Hall A',
      location: 'Wing B, 2nd Floor',
      date: 'Oct 12, 2023',
      time: '10:00 AM - 12:00 PM',
      purpose: 'Math Club Meeting',
      status: 'Approved',
      iconType: 'DoorOpen'
    },
    {
      id: '2',
      roomName: 'Lab 304',
      location: 'Science Block',
      date: 'Oct 10, 2023',
      time: '02:00 PM - 04:00 PM',
      purpose: 'Physics Experiment',
      status: 'Rejected',
      iconType: 'Monitor'
    }
  ]);

  const addToHistory = (item: HistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };

  const deleteFromHistory = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, deleteFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};
