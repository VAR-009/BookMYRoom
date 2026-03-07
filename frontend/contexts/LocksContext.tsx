import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Lock {
  id: string;
  roomId: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  reason: string;
}

interface LocksContextType {
  locks: Lock[];
  addLock: (lock: Lock) => void;
  removeLock: (id: string) => void;
}

const LocksContext = createContext<LocksContextType | undefined>(undefined);

export const LocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locks, setLocks] = useState<Lock[]>([
    {
      id: '1',
      roomId: '101',
      roomName: 'Lecture Hall A',
      date: '2023-10-25',
      startTime: '09:00',
      endTime: '12:00',
      reason: 'Projector Maintenance'
    }
  ]);

  const addLock = (lock: Lock) => {
    setLocks(prev => [...prev, lock]);
  };

  const removeLock = (id: string) => {
    setLocks(prev => prev.filter(lock => lock.id !== id));
  };

  return (
    <LocksContext.Provider value={{ locks, addLock, removeLock }}>
      {children}
    </LocksContext.Provider>
  );
};

export const useLocks = () => {
  const context = useContext(LocksContext);
  if (context === undefined) {
    throw new Error('useLocks must be used within a LocksProvider');
  }
  return context;
};
