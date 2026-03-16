import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { db, auth } from '../firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';

export interface HistoryItem {
  id: string;
  roomName: string;
  location: string;
  date: string;
  time: string;
  purpose: string;
  status: 'Approved' | 'Rejected';
  iconType: 'DoorOpen' | 'Monitor';
  userUid: string;
}

interface HistoryContextType {
  history: HistoryItem[];
  addToHistory: (item: Omit<HistoryItem, 'id'>) => Promise<void>;
  deleteFromHistory: (id: string) => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'history'), 
      where('userUid', '==', auth.currentUser.uid),
      orderBy('date', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const historyData: HistoryItem[] = [];
      snapshot.forEach((doc) => {
        historyData.push({ id: doc.id, ...doc.data() } as HistoryItem);
      });
      setHistory(historyData);
    }, (error) => {
      console.error("Firestore Error in HistoryContext: ", error);
    });

    return () => unsubscribe();
  }, [auth.currentUser]);

  const addToHistory = async (item: Omit<HistoryItem, 'id'>) => {
    try {
      await addDoc(collection(db, 'history'), {
        ...item,
        userUid: auth.currentUser?.uid
      });
    } catch (error) {
      console.error("Error adding to history: ", error);
    }
  };

  const deleteFromHistory = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'history', id));
    } catch (error) {
      console.error("Error deleting from history: ", error);
    }
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
