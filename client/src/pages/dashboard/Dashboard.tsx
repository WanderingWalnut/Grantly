import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const successfulApplications = applications.filter(app => app.status === 'success');
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 4;
  
  const totalPages = Math.ceil(successfulApplications.length / itemsPerPage);
  const startIndex = (activityPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentApplications = successfulApplications.slice(startIndex, endIndex);

  // Mock data for available grants (matching Matches.tsx)
  const allAvailableGrants = [
    { id: 1, amount: '$500,000 - $2,000,000' },
    { id: 2, amount: '$100,000 - $500,000' },
    { id: 3, amount: '$50,000 - $250,000' },
    { id: 4, amount: '$250,000 - $1,000,000' },
    { id: 5, amount: '$25,000 - $150,000' },
    { id: 6, amount: '$100,000 - $500,000' },
    { id: 7, amount: '$300,000 - $750,000' },
    { id: 8, amount: '$50,000 - $200,000' },
    { id: 9, amount: '$75,000 - $400,000' }
  ];

  // Calculate available grants (excluding successfully applied ones)
  const availableGrants = allAvailableGrants.filter(grant => 
    !successfulApplications.some(app => app.id === grant.id)
  );
  const availableGrantsCount = availableGrants.length;
  const newGrantsThisWeek = 3; // This would be calculated based on grant creation dates

  // Calculate active applications statistics
  const activeApplicationsCount = successfulApplications.length;
  const underReviewCount = Math.floor(activeApplicationsCount * 0.5); // 50% under review as example

  // Calculate potential funding
  const parseAmount = (amountString: string) => {
    // Extract max value from range like "$500,000 - $2,000,000"
    const match = amountString.match(/\$([\d,]+)\s*-\s*\$([\d,]+)/);
    if (match) {
      const maxValue = parseInt(match[2].replace(/,/g, ''));
      return maxValue;
    }
    return 0;
  };

  const totalPotentialFunding = availableGrants.reduce((sum, grant) => {
    return sum + parseAmount(grant.amount);
  }, 0);

  const highProbabilityGrants = availableGrants.slice(0, 3); // Top 3 matches
  const highProbabilityFunding = highProbabilityGrants.reduce((sum, grant) => {
    return sum + parseAmount(grant.amount);
  }, 0);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value}`;
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Dashboard</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {/* Stat Card 1 */}
        <div className="bg-white rounded-2xl shadow-md border border-surface-200 p-6 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-primary-100 rounded-xl">
              <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-surface-900">{availableGrantsCount}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-sm">
              <svg className="w-4 h-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-600 font-semibold">+{newGrantsThisWeek}</span>
              <span className="text-surface-500 ml-1">this week</span>
            </div>
            <div className="text-right text-sm font-medium text-surface-600">Available Grants</div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white rounded-2xl shadow-md border border-surface-200 p-6 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-secondary-100 rounded-xl">
              <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-surface-900">{activeApplicationsCount}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-sm text-surface-600">
              <span className="font-semibold">{underReviewCount}</span>
              <span className="ml-1">under review</span>
            </div>
            <div className="text-right text-sm font-medium text-surface-600">Active Applications</div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white rounded-2xl shadow-md border border-surface-200 p-6 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[160px]">
          <div className="flex items-start justify-between">
            <div className="p-3 bg-accent-100 rounded-xl">
              <svg className="h-6 w-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-3xl font-bold text-surface-900">{formatCurrency(totalPotentialFunding)}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-sm text-surface-600">
              <span className="font-semibold">{formatCurrency(highProbabilityFunding)}</span>
              <span className="ml-1">high probability</span>
            </div>
            <div className="text-right text-sm font-medium text-surface-600">Potential Funding</div>
          </div>
        </div>
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100/50">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-surface-900 civic-heading">Recent Activity</h3>
              {successfulApplications.length > 0 && (
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActivityPage(prev => Math.max(1, prev - 1))}
                    disabled={activityPage === 1}
                    className="p-1.5 rounded-lg hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span className="text-sm text-surface-600 font-medium min-w-[80px] text-center">
                    Page {activityPage} of {Math.max(1, totalPages)}
                  </span>
                  <button 
                    onClick={() => setActivityPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={activityPage >= totalPages}
                    className="p-1.5 rounded-lg hover:bg-surface-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 text-surface-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
            
            {successfulApplications.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
                  <svg className="h-10 w-10 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-surface-900 civic-heading mb-3">Ready to get started?</h3>
                <p className="text-lg text-surface-600 civic-text max-w-md mx-auto mb-8">
                  Let our AI assistant help you find and apply for grants that match your organization perfectly.
                </p>
                <button 
                  onClick={() => navigate('/matches')}
                  className="group inline-flex items-center px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg className="-ml-1 mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Your First Application
                </button>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                {currentApplications.map((app) => (
                  <div key={app.id} className="group relative bg-gradient-to-r from-white to-green-50/30 rounded-xl border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-green-600"></div>
                    <div className="flex items-start gap-4 p-4 pl-5">
                      <div className="flex-shrink-0 p-2.5 bg-green-100 rounded-xl group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h4 className="text-base font-bold text-surface-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight">{app.grantTitle}</h4>
                          <span className="flex-shrink-0 px-2.5 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-lg">
                            Application Started
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-surface-600 mb-2">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">{app.funder}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-sm">
                            <svg className="w-4 h-4 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-accent-700">{app.amount}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-surface-500">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(app.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {currentApplications.length === 0 && activityPage > 1 && (
                  <div className="text-center py-8 text-surface-500">
                    No applications on this page
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-secondary-100/50 p-6">
            <h4 className="text-lg font-bold text-surface-900 civic-heading mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full flex items-center px-4 py-3 text-left bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors duration-200 group">
                <div className="p-2 bg-primary-500 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-surface-900">Find Grants</div>
                  <div className="text-sm text-surface-600">Browse matching opportunities</div>
                </div>
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left bg-secondary-50 hover:bg-secondary-100 rounded-xl transition-colors duration-200 group">
                <div className="p-2 bg-secondary-500 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-surface-900">Track Applications</div>
                  <div className="text-sm text-surface-600">Monitor your progress</div>
                </div>
              </button>
              
              <button className="w-full flex items-center px-4 py-3 text-left bg-accent-50 hover:bg-accent-100 rounded-xl transition-colors duration-200 group">
                <div className="p-2 bg-accent-600 rounded-lg mr-3 group-hover:scale-105 transition-transform duration-200">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <div className="font-semibold text-surface-900">Update Profile</div>
                  <div className="text-sm text-surface-600">Keep info current</div>
                </div>
              </button>
            </div>
          </div>

          {/* Tips Card */}
          <div className="relative overflow-hidden bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl border border-primary-100/50 hover:shadow-2xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5"></div>
            <div className="relative p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 bg-gradient-civic rounded-xl shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-lg text-surface-900 civic-heading mb-2">Professional Tip</h4>
                  <p className="text-sm text-surface-600 civic-text leading-relaxed">
                    Complete your organization profile to get more accurate grant matches and improve your success rate.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

