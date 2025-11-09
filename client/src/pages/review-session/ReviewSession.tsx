import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useApplications } from '../../hooks';

const formatDateTime = (date?: Date) => {
  if (!date) return 'Unknown';
  try {
    return new Date(date).toLocaleString();
  } catch {
    return 'Unknown';
  }
};

export const ReviewSession = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { applications } = useApplications();

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

  if (!application) {
    return (
      <div className="p-6 lg:p-10">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg border border-surface-200 p-8 text-center">
          <h1 className="text-2xl font-bold text-surface-900 mb-2">Application Not Found</h1>
          <p className="text-surface-600 mb-6">
            We couldn&apos;t locate that application. It may not have been started yet.
          </p>
          <button
            onClick={() => navigate('/matches')}
            className="px-6 py-3 bg-gradient-civic text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200"
          >
            Browse Matches
          </button>
        </div>
      </div>
    );
  }

  const sessionExists = Boolean(application.liveViewUrl);

  return (
    <div className="p-6 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>

          <div className="flex flex-col gap-4 mb-6">
            <h1 className="text-3xl font-bold text-surface-900">{application.grantTitle}</h1>
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-surface-500 uppercase tracking-wide mb-2">
                Browserbase Session
              </h2>
              {sessionExists ? (
                <>
                  <p className="text-surface-900 font-semibold">{application.sessionId}</p>
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
                  Live session metadata not available. Start the application from the Matches page to create a session.
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
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    CFEP Small Sample Application PDF
                  </a>
                </div>
              ) : (
                <p className="text-sm text-surface-600">
                  The PDF link will appear here once it has been captured by Browserbase.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-surface-200 p-8">
          <h2 className="text-2xl font-bold text-surface-900 mb-4">Application Workspace</h2>
          <p className="text-surface-600 mb-6">
            Use this space to capture your responses and notes while reviewing the application PDF. Additional
            automation can populate this workflow in future iterations.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Key Eligibility Notes</h3>
              <textarea
                className="w-full h-32 p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm"
                placeholder="Document important eligibility criteria here..."
              />
            </div>

            <div className="bg-surface-50 border border-surface-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-surface-900 mb-2">Supporting Documents Checklist</h3>
              <textarea
                className="w-full h-32 p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary-100 focus:border-primary-500 text-sm"
                placeholder="Track required attachments and evidence..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

