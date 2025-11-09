import { createContext } from 'react';

export type ApplicationStatus = 'started' | 'failed';

export interface Application {
  id: number;
  grantTitle: string;
  funder: string;
  amount: string;
  status: ApplicationStatus;
  timestamp: Date;
  sessionId?: string;
  liveViewUrl?: string;
  pdfLink?: string;
}

export interface SuccessMessage {
  id: number;
  grantTitle: string;
}

export interface ApplicationContextValue {
  applications: Application[];
  addApplication: (application: Application) => void;
  successMessages: SuccessMessage[];
  addSuccessMessage: (message: SuccessMessage) => void;
  removeSuccessMessage: (id: number) => void;
}

export const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);

