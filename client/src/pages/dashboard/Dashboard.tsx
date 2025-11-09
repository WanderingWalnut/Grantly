import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApplications } from '../../context/ApplicationContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { applications } = useApplications();
  const successfulApplications = applications.filter(app => app.status === 'success');
  const [activityPage, setActivityPage] = useState(1);
  const itemsPerPage = 3;
  
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
    <div className="p-4 lg:p-6 h-screen overflow-hidden flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-surface-900">Dashboard</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-6">
        {/* Stat Card 1 - Available Grants */}
        <div 
          onClick={() => navigate('/matches')}
          className="bg-white rounded-xl shadow-md border border-surface-200 p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors duration-300">
              <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors duration-300">{availableGrantsCount}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-xs">
              <svg className="w-4 h-4 mr-1 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-green-600 font-semibold">+{newGrantsThisWeek}</span>
              <span className="text-surface-500 ml-1">this week</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-right text-xs font-medium text-surface-600">Available Grants</span>
              <svg className="w-3.5 h-3.5 text-surface-400 group-hover:text-primary-600 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stat Card 2 - Active Applications */}
        <div 
          onClick={() => navigate('/tracker')}
          className="bg-white rounded-xl shadow-md border border-surface-200 p-4 hover:shadow-lg transition-all duration-300 flex flex-col justify-between min-h-[120px] cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="p-2 bg-secondary-100 rounded-lg group-hover:bg-secondary-200 transition-colors duration-300">
              <svg className="h-5 w-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-surface-900 group-hover:text-secondary-600 transition-colors duration-300">{activeApplicationsCount}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-xs text-surface-600">
              <span className="font-semibold">{underReviewCount}</span>
              <span className="ml-1">under review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-right text-xs font-medium text-surface-600">Active Applications</span>
              <svg className="w-3.5 h-3.5 text-surface-400 group-hover:text-secondary-600 group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Stat Card 3 - Potential Funding */}
        <div className="bg-white rounded-xl shadow-md border border-surface-200 p-4 hover:shadow-lg transition-shadow flex flex-col justify-between min-h-[120px]">
          <div className="flex items-start justify-between">
            <div className="p-2 bg-accent-100 rounded-lg">
              <svg className="h-5 w-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-surface-900">{formatCurrency(totalPotentialFunding)}</div>
          </div>
          <div className="flex items-end justify-between">
            <div className="flex items-center text-xs text-surface-600">
              <span className="font-semibold">{formatCurrency(highProbabilityFunding)}</span>
              <span className="ml-1">high probability</span>
            </div>
            <div className="text-right text-xs font-medium text-surface-600">Potential Funding</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-h-[400px]">
        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-xl border border-primary-100/50 flex flex-col h-full">
          <div className="p-4 flex-shrink-0">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-surface-900 civic-heading">Recent Activity</h3>
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
              <div className="text-center py-6 flex-1 flex flex-col items-center justify-center">
                <div className="mx-auto h-12 w-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center mb-3 shadow-lg">
                  <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-base font-bold text-surface-900 civic-heading mb-2">Ready to get started?</h3>
                <p className="text-xs text-surface-600 civic-text max-w-md mx-auto mb-3">
                  Let our AI assistant help you find and apply for grants that match your organization perfectly.
                </p>
                <button 
                  onClick={() => navigate('/matches')}
                  className="group inline-flex items-center px-5 py-2.5 bg-gradient-civic text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
                >
                  <svg className="-ml-1 mr-2 h-4 w-4 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Start Your First Application
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[280px] overflow-y-auto px-4 pb-4">
                {currentApplications.map((app) => (
                  <div key={app.id} className="group relative bg-gradient-to-r from-white to-green-50/30 rounded-lg border border-green-100 hover:border-green-200 hover:shadow-md transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-green-600"></div>
                    <div className="flex items-start gap-3 p-3 pl-4">
                      <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg group-hover:bg-green-200 group-hover:scale-110 transition-all duration-300 shadow-sm">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-sm font-bold text-surface-900 group-hover:text-primary-600 transition-colors duration-200 leading-tight">{app.grantTitle}</h4>
                          <span className="flex-shrink-0 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">
                            Started
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-surface-600 mb-1.5">
                          <div className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">{app.funder}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs">
                            <svg className="w-3.5 h-3.5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-semibold text-accent-700">{app.amount}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-surface-500">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  <div className="text-center py-4 text-surface-500 text-sm">
                    No applications on this page
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

