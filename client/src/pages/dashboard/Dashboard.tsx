import { useState } from 'react';

export const Dashboard = () => {
  const [userName] = useState('User'); // TODO: Get from auth context

  return (
    <div className="min-h-screen bg-surface-100">
      {/* Header */}
      <header className="bg-gradient-civic shadow-civic">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white civic-heading">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-white/90">Welcome, {userName}</span>
            <button className="px-4 py-2 text-sm font-medium text-primary-600 bg-white rounded-civic hover:bg-surface-100 transition-all duration-200 shadow-civic">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Stat Card 1 */}
          <div className="bg-surface-50 overflow-hidden shadow-civic rounded-civic-lg hover:shadow-civic-md transition-all duration-200 border border-secondary-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-primary-50 rounded-civic">
                  <svg
                    className="h-6 w-6 text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-600 truncate">Total Grants</dt>
                    <dd className="text-2xl font-bold text-surface-900 civic-heading">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-surface-50 overflow-hidden shadow-civic rounded-civic-lg hover:shadow-civic-md transition-all duration-200 border border-secondary-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-secondary-50 rounded-civic">
                  <svg
                    className="h-6 w-6 text-secondary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-600 truncate">Applications</dt>
                    <dd className="text-2xl font-bold text-surface-900 civic-heading">0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-surface-50 overflow-hidden shadow-civic rounded-civic-lg hover:shadow-civic-md transition-all duration-200 border border-secondary-100">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 p-3 bg-accent-50 rounded-civic">
                  <svg
                    className="h-6 w-6 text-accent-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-surface-600 truncate">Total Funding</dt>
                    <dd className="text-2xl font-bold text-surface-900 civic-heading">$0</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface-50 shadow-civic rounded-civic-lg border border-secondary-100">
          <div className="px-6 py-6 sm:p-8">
            <h3 className="text-xl leading-6 font-bold text-surface-900 mb-6 civic-heading">
              Recent Activity
            </h3>
            <div className="text-center py-12">
              <div className="mx-auto h-16 w-16 bg-gradient-civic-subtle rounded-civic-lg flex items-center justify-center mb-4">
                <svg
                  className="h-8 w-8 text-primary-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mt-2 text-lg font-semibold text-surface-900 civic-heading">No activity yet</h3>
              <p className="mt-2 text-base text-surface-600 civic-text max-w-md mx-auto">
                Get started by creating your first grant application. Our AI assistant will guide you through the process.
              </p>
              <div className="mt-8">
                <button
                  type="button"
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-civic text-base font-semibold rounded-civic text-white bg-gradient-civic hover:shadow-civic-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <svg
                    className="-ml-1 mr-3 h-5 w-5"
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
                  Start New Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

