import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query } from 'firebase/firestore';

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
  addLock: (lock: Omit<Lock, 'id'>) => Promise<void>;
  removeLock: (id: string) => Promise<void>;
}

const LocksContext = createContext<LocksContextType | undefined>(undefined);

export const LocksProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locks, setLocks] = useState<Lock[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'locks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const locksData: Lock[] = [];
      snapshot.forEach((doc) => {
        locksData.push({ id: doc.id, ...doc.data() } as Lock);
      });
      setLocks(locksData);
    }, (error) => {
      console.error("Firestore Error in LocksContext: ", error);
    });

    return () => unsubscribe();
  }, []);

  const addLock = async (lock: Omit<Lock, 'id'>) => {
    try {
      await addDoc(collection(db, 'locks'), lock);
    } catch (error) {
      console.error("Error adding lock: ", error);
    }
  };

  const removeLock = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'locks', id));
    } catch (error) {
      console.error("Error removing lock: ", error);
    }
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
