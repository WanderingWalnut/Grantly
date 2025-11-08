import { useState } from 'react';

type ApplicationStatus = 'draft' | 'submitted' | 'under-review' | 'approved' | 'rejected';

interface Application {
  id: number;
  grantTitle: string;
  funder: string;
  amount: string;
  status: ApplicationStatus;
  submittedDate?: string;
  deadline: string;
  progress: number;
  nextSteps?: string;
}

export const ApplicationTracker = () => {
  const [filter, setFilter] = useState<ApplicationStatus | 'all'>('all');

  // Mock data for applications
  const mockApplications: Application[] = [
    {
      id: 1,
      grantTitle: 'Community Development Block Grant',
      funder: 'HUD',
      amount: '$500,000',
      status: 'under-review',
      submittedDate: '2024-01-15',
      deadline: '2024-03-15',
      progress: 100,
      nextSteps: 'Waiting for review committee decision'
    },
    {
      id: 2,
      grantTitle: 'Environmental Justice Grant',
      funder: 'EPA',
      amount: '$250,000',
      status: 'draft',
      deadline: '2024-02-28',
      progress: 65,
      nextSteps: 'Complete budget narrative and submit'
    },
    {
      id: 3,
      grantTitle: 'Youth Development Initiative',
      funder: 'RWJF',
      amount: '$100,000',
      status: 'approved',
      submittedDate: '2023-12-01',
      deadline: '2024-01-31',
      progress: 100,
      nextSteps: 'Begin project implementation'
    },
    {
      id: 4,
      grantTitle: 'Arts Education Program',
      funder: 'NEA',
      amount: '$75,000',
      status: 'submitted',
      submittedDate: '2024-01-10',
      deadline: '2024-02-15',
      progress: 100,
      nextSteps: 'Application under initial review'
    }
  ];

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case 'draft':
        return 'bg-accent-100 text-accent-700 border-accent-200';
      case 'submitted':
        return 'bg-primary-100 text-primary-700 border-primary-200';
      case 'under-review':
        return 'bg-secondary-100 text-secondary-700 border-secondary-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-surface-100 text-surface-700 border-surface-200';
    }
  };

  const getStatusIcon = (status: ApplicationStatus) => {
    switch (status) {
      case 'draft':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        );
      case 'submitted':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        );
      case 'under-review':
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'approved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case 'rejected':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const filteredApplications = filter === 'all' 
    ? mockApplications 
    : mockApplications.filter(app => app.status === filter);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-accent-500 to-secondary-500 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-surface-900 civic-heading">
                Application Progress
              </h1>
            </div>
            <p className="text-lg text-surface-600 civic-text max-w-2xl">
              Track every step of your grant journey from draft to award
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <div className="text-2xl font-bold text-secondary-600">{filteredApplications.length}</div>
              </div>
              <div className="text-sm text-surface-600">Active Applications</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-primary-100/50">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Applications', count: mockApplications.length },
              { key: 'draft', label: 'Draft', count: mockApplications.filter(app => app.status === 'draft').length },
              { key: 'submitted', label: 'Submitted', count: mockApplications.filter(app => app.status === 'submitted').length },
              { key: 'under-review', label: 'Under Review', count: mockApplications.filter(app => app.status === 'under-review').length },
              { key: 'approved', label: 'Approved', count: mockApplications.filter(app => app.status === 'approved').length },
              { key: 'rejected', label: 'Rejected', count: mockApplications.filter(app => app.status === 'rejected').length }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as ApplicationStatus | 'all')}
                className={`relative px-6 py-3 rounded-xl font-bold transition-all duration-300 group ${
                  filter === tab.key
                    ? 'bg-gradient-civic text-white shadow-lg transform scale-105'
                    : 'bg-surface-100 text-surface-600 hover:bg-primary-50 hover:text-primary-600 hover:scale-105'
                }`}
              >
                <span className="relative z-10">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`ml-2 px-2 py-1 text-xs font-bold rounded-full ${
                    filter === tab.key 
                      ? 'bg-white/20 text-white' 
                      : 'bg-primary-100 text-primary-600 group-hover:bg-primary-200'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.map((application) => (
          <div key={application.id} className="bg-surface-50 rounded-civic-lg shadow-civic border border-secondary-100 hover:shadow-civic-md transition-all duration-200">
            <div className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-surface-900 civic-heading">{application.grantTitle}</h3>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-civic text-sm font-medium border ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      {application.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-surface-500 font-medium">Funder:</span>
                      <span className="ml-2 text-surface-900">{application.funder}</span>
                    </div>
                    <div>
                      <span className="text-surface-500 font-medium">Amount:</span>
                      <span className="ml-2 text-surface-900 font-semibold">{application.amount}</span>
                    </div>
                    <div>
                      <span className="text-surface-500 font-medium">Deadline:</span>
                      <span className="ml-2 text-surface-900">{application.deadline}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-surface-700 mb-1">Progress</div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-surface-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-civic h-2 rounded-full transition-all duration-300"
                          style={{ width: `${application.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-surface-700">{application.progress}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {application.submittedDate && (
                <div className="mb-3 text-sm text-surface-600">
                  <strong>Submitted:</strong> {application.submittedDate}
                </div>
              )}

              {application.nextSteps && (
                <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-civic">
                  <div className="text-sm font-medium text-primary-800 mb-1">Next Steps:</div>
                  <div className="text-sm text-primary-700">{application.nextSteps}</div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-surface-200">
                {application.status === 'draft' && (
                  <>
                    <button className="px-4 py-2 bg-gradient-civic text-white font-semibold rounded-civic hover:shadow-civic-md transition-all duration-200">
                      Continue Application
                    </button>
                    <button className="px-4 py-2 border-2 border-surface-300 text-surface-600 font-semibold rounded-civic hover:bg-surface-100 transition-all duration-200">
                      Delete Draft
                    </button>
                  </>
                )}
                {(application.status === 'submitted' || application.status === 'under-review') && (
                  <button className="px-4 py-2 border-2 border-primary-500 text-primary-600 font-semibold rounded-civic hover:bg-primary-50 transition-all duration-200">
                    View Submission
                  </button>
                )}
                {application.status === 'approved' && (
                  <button className="px-4 py-2 bg-success text-white font-semibold rounded-civic hover:bg-green-600 transition-all duration-200">
                    View Award Details
                  </button>
                )}
                <button className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-civic transition-all duration-200">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredApplications.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-16 w-16 bg-gradient-civic-subtle rounded-civic-lg flex items-center justify-center mb-4">
            <svg className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-surface-900 civic-heading mb-2">No applications found</h3>
          <p className="text-surface-600 civic-text mb-6">
            {filter === 'all' 
              ? "You haven't started any grant applications yet."
              : `No applications with status "${filter.replace('-', ' ')}".`
            }
          </p>
          <button className="px-6 py-3 bg-gradient-civic text-white font-semibold rounded-civic hover:shadow-civic-md transition-all duration-200">
            Browse Grant Matches
          </button>
        </div>
      )}
    </div>
  );
};