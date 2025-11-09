import { createContext } from 'react';

export type ApplicationStatus = 'started' | 'draft' | 'failed';

export interface ApplicationDraft {
  answers: Record<string, unknown>;
  model: string;
  generatedAt: string;
  tokensUsed?: number | null;
}

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
  draft?: ApplicationDraft;
}

export interface SuccessMessage {
  id: number;
  grantTitle: string;
}

export interface ApplicationContextValue {
  applications: Application[];
  addApplication: (application: Application) => void;
  updateApplicationDraft: (id: number, draft: ApplicationDraft) => void;
  successMessages: SuccessMessage[];
  addSuccessMessage: (message: SuccessMessage) => void;
  removeSuccessMessage: (id: number) => void;
}

export const ApplicationContext = createContext<ApplicationContextValue | undefined>(undefined);

