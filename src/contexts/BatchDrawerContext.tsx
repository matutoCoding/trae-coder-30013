import { createContext, useContext, useState, ReactNode } from 'react';
import BatchDetailDrawer from '@/components/BatchDetailDrawer';

interface BatchDrawerContextType {
  openBatch: (batchNo: string) => void;
  closeBatch: () => void;
  currentBatch: string;
  isOpen: boolean;
}

const BatchDrawerContext = createContext<BatchDrawerContextType | null>(null);

export function BatchDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState('');

  const openBatch = (batchNo: string) => {
    setCurrentBatch(batchNo);
    setIsOpen(true);
  };

  const closeBatch = () => {
    setIsOpen(false);
  };

  return (
    <BatchDrawerContext.Provider value={{ openBatch, closeBatch, currentBatch, isOpen }}>
      {children}
      <BatchDetailDrawer open={isOpen} batchNo={currentBatch} onClose={closeBatch} />
    </BatchDrawerContext.Provider>
  );
}

export function useBatchDrawer() {
  const ctx = useContext(BatchDrawerContext);
  if (!ctx) throw new Error('useBatchDrawer must be used within BatchDrawerProvider');
  return ctx;
}
