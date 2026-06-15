import { createContext, useContext, useState, ReactNode } from 'react';
import BatchDetailDrawer from '@/components/BatchDetailDrawer';

interface BatchDrawerContextType {
  openBatch: (batchNo: string, type?: 'pulping' | 'material') => void;
  closeBatch: () => void;
  currentBatch: string;
  currentType: 'pulping' | 'material';
  isOpen: boolean;
}

const BatchDrawerContext = createContext<BatchDrawerContextType | null>(null);

export function BatchDrawerProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentBatch, setCurrentBatch] = useState('');
  const [currentType, setCurrentType] = useState<'pulping' | 'material'>('pulping');

  const openBatch = (batchNo: string, type?: 'pulping' | 'material') => {
    setCurrentBatch(batchNo);
    if (type) {
      setCurrentType(type);
    } else {
      setCurrentType(batchNo.startsWith('TP') || batchNo.startsWith('DC') ? 'material' : 'pulping');
    }
    setIsOpen(true);
  };

  const closeBatch = () => {
    setIsOpen(false);
  };

  return (
    <BatchDrawerContext.Provider value={{ openBatch, closeBatch, currentBatch, currentType, isOpen }}>
      {children}
      <BatchDetailDrawer open={isOpen} batchNo={currentBatch} type={currentType} onClose={closeBatch} />
    </BatchDrawerContext.Provider>
  );
}

export function useBatchDrawer() {
  const ctx = useContext(BatchDrawerContext);
  if (!ctx) throw new Error('useBatchDrawer must be used within BatchDrawerProvider');
  return ctx;
}
