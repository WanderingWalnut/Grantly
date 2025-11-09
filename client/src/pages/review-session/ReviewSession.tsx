import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useApplications } from "../../hooks";
import { useOrganization } from "../../context/OrganizationContext";
import { generateGrantDraft } from "../../services";

const formatDateTime = (date?: Date | string) => {
  if (!date) return "Unknown";
  try {
    return new Date(date).toLocaleString();
  } catch {
    return "Unknown";
  }
};

const buildOrganizationSummary = (
  organization: {
    legal_business_name?: string;
    operating_name?: string;
    mission_statement?: string;
    company_description?: string;
    target_beneficiaries?: string;
    business_sector?: string;
    address?: string;
  } | null
) => {
  if (!organization) {
    return "No organization profile information provided.";
  }

  return [
    `Organization Name: ${
      organization.legal_business_name || organization.operating_name
    }`,
    organization.mission_statement &&
      `Mission: ${organization.mission_statement}`,
    organization.company_description &&
      `About: ${organization.company_description}`,
    organization.target_beneficiaries &&
      `Target Beneficiaries: ${organization.target_beneficiaries}`,
    organization.business_sector && `Sector: ${organization.business_sector}`,
    organization.address && `Address: ${organization.address}`,
  ]
    .filter(Boolean)
    .join("\n");
};

const toEditableAnswers = (
  answers?: Record<string, unknown>
): Record<string, string> => {
  if (!answers) {
    return {};
  }

  return Object.entries(answers).reduce<Record<string, string>>(
    (acc, [key, value]) => {
      if (value == null) {
        acc[key] = "";
      } else if (Array.isArray(value)) {
        acc[key] = value.join("\n");
      } else if (typeof value === "object") {
        acc[key] = Object.entries(value as Record<string, unknown>)
          .map(
            ([subKey, subValue]) =>
              `${subKey}: ${subValue as string | number | boolean | null}`
          )
          .join("\n");
      } else {
        acc[key] = String(value);
      }
      return acc;
    },
    {}
  );
};

const toDraftPayload = (
  answers: Record<string, string>
): Record<string, unknown> => {
  return Object.entries(answers).reduce<Record<string, unknown>>(
    (acc, [key, rawValue]) => {
      const trimmed = rawValue.trim();
      if (!trimmed) {
        acc[key] = "";
        return acc;
      }

      // If the user entered multi-line text, treat it as an array of bullet points.
      if (trimmed.includes("\n")) {
        acc[key] = trimmed
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean);
        return acc;
      }

      acc[key] = trimmed;
      return acc;
    },
    {}
  );
};

export const ReviewSession = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { applications, updateApplicationDraft } = useApplications();
  const { organization } = useOrganization();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [editableAnswers, setEditableAnswers] = useState<
    Record<string, string>
  >({});
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const application = useMemo(() => {
    if (!applicationId) {
      return undefined;
    }
    const numericId = Number(applicationId);
    if (Number.isNaN(numericId)) {
      return undefined;
    }
    return applications.find((app) => app.id === numericId);
  }, [applicationId, applications]);

  useEffect(() => {
    setEditableAnswers(toEditableAnswers(application?.draft?.answers));
  }, [application?.draft]);

  if (!application) {
    return (
      <div className="p-6 lg:p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-surface-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">
            Application Not Found
          </h1>
          <p className="text-surface-600 mb-6">
            We couldn&apos;t locate that application. It may not have been
            started yet.
          </p>
          <button
            onClick={() => navigate("/matches")}
            className="px-6 py-3 bg-gradient-civic text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Browse Matches
          </button>
        </div>
      </div>
    );
  }

  const sessionExists = Boolean(application.liveViewUrl);

  const handleGenerateDraft = async () => {
    if (!application) {
      return;
    }
    if (!application.pdfLink) {
      setGenerationError("PDF link is not available for this application.");
      return;
    }

    setGenerationError(null);
    setIsGenerating(true);

    try {
      const summary = buildOrganizationSummary(organization);
      const response = await generateGrantDraft({
        pdf_link: application.pdfLink,
        organization_summary: summary,
      });

      updateApplicationDraft(application.id, {
        answers: response.draft,
        model: response.model,
        generatedAt: response.generated_at,
        tokensUsed: response.tokens_used ?? null,
      });

      setEditableAnswers(toEditableAnswers(response.draft));
    } catch (error) {
      console.error("Failed to generate draft responses", error);
      setGenerationError(
        error instanceof Error
          ? error.message
          : "Unable to generate draft responses. Please try again."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const currentDraftMetadata = application?.draft;

  const handleCopyDraft = async () => {
    const payload = {
      ...toDraftPayload(editableAnswers),
      model: currentDraftMetadata?.model,
      generatedAt: currentDraftMetadata?.generatedAt,
    };
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyFeedback("Draft copied!");
      setTimeout(() => setCopyFeedback(null), 2000);
    } catch (error) {
      console.error("Failed to copy draft", error);
      setCopyFeedback("Unable to copy draft");
      setTimeout(() => setCopyFeedback(null), 2500);
    }
  };

  const handleExportPdf = () => {
    const payload = {
      answers: toDraftPayload(editableAnswers),
      model: currentDraftMetadata?.model,
      generatedAt: currentDraftMetadata?.generatedAt,
      tokensUsed: currentDraftMetadata?.tokensUsed,
    };

    const printableWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printableWindow) {
      return;
    }

    printableWindow.document.write(`
      <html>
        <head>
          <title>Grant Draft Export</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.6; }
            pre { white-space: pre-wrap; word-wrap: break-word; background: #f4f4f4; padding: 16px; border-radius: 8px; }
            h1 { font-size: 20px; margin-bottom: 12px; }
          </style>
        </head>
        <body>
          <h1>${application?.grantTitle ?? "Grant Draft"}</h1>
          <pre>${JSON.stringify(payload, null, 2)}</pre>
        </body>
      </html>
    `);
    printableWindow.document.close();
    printableWindow.focus();
    printableWindow.print();
  };

  const handleSaveDraft = () => {
    if (!application) {
      return;
    }
    const answers = toDraftPayload(editableAnswers);
    updateApplicationDraft(application.id, {
      answers,
      model: currentDraftMetadata?.model ?? "manual-edit",
      generatedAt:
        currentDraftMetadata?.generatedAt ?? new Date().toISOString(),
      tokensUsed: currentDraftMetadata?.tokensUsed ?? null,
    });
    setSaveFeedback("Draft saved.");
    setTimeout(() => setSaveFeedback(null), 2000);
  };

  const handleAnswerChange = (key: string, value: string) => {
    setEditableAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const draftKeys = Object.keys(editableAnswers);

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>

          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-3xl font-bold text-surface-900">
              {application.grantTitle}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-surface-600">
              <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">
                Started {formatDateTime(application.timestamp)}
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-100 text-surface-700 font-semibold">
                {application.funder}
              </span>
              <span className="px-3 py-1 rounded-full bg-secondary-50 text-secondary-700 font-semibold">
                {application.amount}
              </span>
            </div>

            {generationError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {generationError}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleGenerateDraft}
                disabled={isGenerating}
                className="inline-flex items-center gap-2 rounded-lg bg-gradient-civic px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isGenerating ? (
                  <>
                    <svg
                      className="h-4 w-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        fill="currentColor"
                      />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Generate Draft Responses
                  </>
                )}
              </button>

              {application.draft && (
                <>
                  <button
                    onClick={handleCopyDraft}
                    className="inline-flex items-center gap-2 rounded-lg border border-primary-200 px-4 py-2 text-sm font-semibold text-primary-600 transition hover:bg-primary-50"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16h8m-6-4h6m2 8H8a2 2 0 01-2-2V6a2 2 0 012-2h6l4 4v12a2 2 0 01-2 2z"
                      />
                    </svg>
                    Copy JSON
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="inline-flex items-center gap-2 rounded-lg border border-secondary-200 px-4 py-2 text-sm font-semibold text-secondary-600 transition hover:bg-secondary-50"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Save Draft Changes
                  </button>
                  <button
                    onClick={handleExportPdf}
                    className="inline-flex items-center gap-2 rounded-lg border border-secondary-200 px-4 py-2 text-sm font-semibold text-secondary-600 transition hover:bg-secondary-50"
                  >
                    <svg
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      fill="none"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 16l4-5h-3V4h-2v7H8l4 5zm8 2H4v-2h16v2z"
                      />
                    </svg>
                    Export as PDF
                  </button>
                </>
              )}

              {(copyFeedback || saveFeedback) && (
                <span className="text-sm text-surface-500">
                  {copyFeedback ?? saveFeedback}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-2">
                Browserbase Session
              </h2>
              {sessionExists ? (
                <>
                  <p className="text-surface-900 font-semibold">
                    {application.sessionId}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <a
                      href={application.liveViewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 bg-gradient-civic text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 text-sm"
                    >
                      View Live Session
                    </a>
                    {application.pdfLink && (
                      <a
                        href={application.pdfLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-primary-200 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200 text-sm"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-surface-600 text-sm">
                  Live session metadata not available. Start the application
                  from the Matches page to create a session.
                </p>
              )}
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-2">
                Supporting Documents
              </h2>
              {application.pdfLink ? (
                <div>
                  <p className="text-sm text-surface-700 mb-3">
                    Latest document captured from the grant portal:
                  </p>
                  <a
                    href={application.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-secondary-200 text-secondary-600 font-semibold rounded-lg hover:bg-secondary-50 transition-all duration-200 text-sm"
                  >
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    CFEP Small Sample Application PDF
                  </a>
                </div>
              ) : (
                <p className="text-sm text-surface-600">
                  The PDF link will appear here once it has been captured by
                  Browserbase.
                </p>
              )}
            </div>
          </div>
        </div>

        {draftKeys.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
            <h2 className="text-2xl font-bold text-surface-900 mb-4">
              Draft Responses
            </h2>
            <p className="text-surface-600 mb-6">
              Review and edit the generated responses below. Changes you make
              can be copied or exported.
            </p>

            <div className="space-y-4">
              {draftKeys.map((key) => (
                <div
                  key={key}
                  className="border border-surface-200 rounded-lg p-4 bg-surface-50"
                >
                  <label className="block text-sm font-semibold text-surface-700 mb-2 uppercase tracking-wide">
                    {key.replace(/_/g, " ")}
                  </label>
                  <textarea
                    className="w-full min-h-[120px] rounded-lg border border-surface-300 p-3 text-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
                    value={editableAnswers[key]}
                    onChange={(event) =>
                      handleAnswerChange(key, event.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
