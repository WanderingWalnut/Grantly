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
      const existingIndex = prev.findIndex((app) => app.id === application.id);

      if (existingIndex !== -1) {
        const existing = prev[existingIndex];
        const merged: Application = {
          ...existing,
          ...application,
          draft: application.draft ?? existing.draft,
          sessionId: application.sessionId ?? existing.sessionId,
          liveViewUrl: application.liveViewUrl ?? existing.liveViewUrl,
          pdfLink: application.pdfLink ?? existing.pdfLink,
        };
        const updated = [...prev];
        updated[existingIndex] = merged;
        return updated;
      }

      return [application, ...prev];
    });
  };

  const updateApplicationDraft = (id: number, draft: Application["draft"]) => {
    if (!draft) {
      return;
    }
    setApplications((prev) =>
      prev.map((app) =>
        app.id === id
          ? {
              ...app,
              status:
                app.status === "failed"
                  ? "draft"
                  : ("draft" as Application["status"]),
              draft,
            }
          : app
      )
    );
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
        updateApplicationDraft,
        successMessages,
        addSuccessMessage,
        removeSuccessMessage,
      }}
    >
      {children}
    </ApplicationContext.Provider>
  );
};
