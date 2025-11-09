import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

export interface Application {
  id: number;
  grantTitle: string;
  funder: string;
  amount: string;
  status: 'success' | 'failed';
  timestamp: Date;
}

export interface SuccessMessage {
  id: number;
  grantTitle: string;
}

interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Application) => void;
  successMessages: SuccessMessage[];
  addSuccessMessage: (message: SuccessMessage) => void;
  removeSuccessMessage: (id: number) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [successMessages, setSuccessMessages] = useState<SuccessMessage[]>([]);

  const addApplication = (application: Application) => {
    setApplications(prev => {
      // Check if an application with this ID already exists
      const existingIndex = prev.findIndex(app => app.id === application.id);
      
      if (existingIndex !== -1) {
        // Replace the existing application (for retries)
        const updated = [...prev];
        updated[existingIndex] = application;
        return updated;
      } else {
        // Add new application
        return [application, ...prev];
      }
    });
  };

  const addSuccessMessage = (message: SuccessMessage) => {
    setSuccessMessages(prev => [...prev, message]);
  };

  const removeSuccessMessage = (id: number) => {
    setSuccessMessages(prev => prev.filter(msg => msg.id !== id));
  };

  return (
    <ApplicationContext.Provider value={{ 
      applications, 
      addApplication, 
      successMessages, 
      addSuccessMessage, 
      removeSuccessMessage 
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};

export const useApplications = () => {
  const context = useContext(ApplicationContext);
  if (!context) {
    throw new Error('useApplications must be used within ApplicationProvider');
  }
  return context;
};
