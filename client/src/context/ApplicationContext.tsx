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

interface ApplicationContextType {
  applications: Application[];
  addApplication: (application: Application) => void;
}

const ApplicationContext = createContext<ApplicationContextType | undefined>(undefined);

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);

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

  return (
    <ApplicationContext.Provider value={{ applications, addApplication }}>
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
