import { useState } from "react";
import type { ReactNode } from "react";

import {
  ApplicationContext,
  type Application,
  type SuccessMessage,
} from "./ApplicationContextDefinition";

export const ApplicationProvider = ({ children }: { children: ReactNode }) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [successMessages, setSuccessMessages] = useState<SuccessMessage[]>([]);

  const addApplication = (application: Application) => {
    setApplications((prev) => {
      // Check if an application with this ID already exists
      const existingIndex = prev.findIndex((app) => app.id === application.id);

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
    setSuccessMessages((prev) => [...prev, message]);
  };

  const removeSuccessMessage = (id: number) => {
    setSuccessMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <ApplicationContext.Provider
      value={{
        applications,
        addApplication,
        successMessages,
        addSuccessMessage,
        removeSuccessMessage,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
