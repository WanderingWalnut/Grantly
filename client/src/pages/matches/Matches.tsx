import { useState } from 'react';
import { useApplications } from '../../context/ApplicationContext';

export const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(3);
  const { applications, addApplication, addSuccessMessage } = useApplications();

  // Mock data for grant matches (expanded list)
  const allMockMatches = [
    {
      id: 1,
      title: 'Community Development Block Grant',
      funder: 'Department of Housing and Urban Development',
      amount: '$500,000 - $2,000,000',
      deadline: '2024-03-15',
      matchPercentage: 95,
      description: 'Supports community development activities in low- and moderate-income areas.',
      eligibility: ['Nonprofits', 'Local Government', 'Community Organizations'],
      status: 'Open'
    },
    {
      id: 2,
      title: 'Environmental Justice Grant Program',
      funder: 'Environmental Protection Agency',
      amount: '$100,000 - $500,000',
      deadline: '2024-02-28',
      matchPercentage: 88,
      description: 'Addresses environmental and public health issues in underserved communities.',
      eligibility: ['Nonprofits', 'Community Groups', 'Tribal Organizations'],
      status: 'Open'
    },
    {
      id: 3,
      title: 'Youth Development Initiative',
      funder: 'Robert Wood Johnson Foundation',
      amount: '$50,000 - $250,000',
      deadline: '2024-04-10',
      matchPercentage: 82,
      description: 'Supports programs that promote positive youth development and leadership.',
      eligibility: ['Youth Organizations', 'Nonprofits', 'Educational Institutions'],
      status: 'Open'
    },
    {
      id: 4,
      title: 'Clean Energy Innovation Fund',
      funder: 'Department of Energy',
      amount: '$250,000 - $1,000,000',
      deadline: '2024-05-20',
      matchPercentage: 79,
      description: 'Funds innovative clean energy projects and renewable energy initiatives.',
      eligibility: ['Nonprofits', 'Research Institutions', 'Technology Companies'],
      status: 'Open'
    },
    {
      id: 5,
      title: 'Arts and Culture Enrichment Grant',
      funder: 'National Endowment for the Arts',
      amount: '$25,000 - $150,000',
      deadline: '2024-03-30',
      matchPercentage: 76,
      description: 'Supports arts organizations and cultural programs in underserved communities.',
      eligibility: ['Arts Organizations', 'Nonprofits', 'Cultural Centers'],
      status: 'Open'
    },
    {
      id: 6,
      title: 'Education Equity Grant',
      funder: 'Gates Foundation',
      amount: '$100,000 - $500,000',
      deadline: '2024-06-15',
      matchPercentage: 91,
      description: 'Promotes educational equity and access for underserved student populations.',
      eligibility: ['Educational Institutions', 'Nonprofits', 'School Districts'],
      status: 'Open'
    },
    {
      id: 7,
      title: 'Healthcare Access Initiative',
      funder: 'Health Resources and Services Administration',
      amount: '$300,000 - $750,000',
      deadline: '2024-04-25',
      matchPercentage: 85,
      description: 'Improves healthcare access and quality in rural and underserved areas.',
      eligibility: ['Healthcare Organizations', 'Nonprofits', 'Community Health Centers'],
      status: 'Open'
    },
    {
      id: 8,
      title: 'Small Business Development Fund',
      funder: 'Small Business Administration',
      amount: '$50,000 - $200,000',
      deadline: '2024-05-10',
      matchPercentage: 73,
      description: 'Supports small business development and entrepreneurship programs.',
      eligibility: ['Business Development Organizations', 'Nonprofits', 'Incubators'],
      status: 'Open'
    },
    {
      id: 9,
      title: 'Food Security Grant Program',
      funder: 'USDA Rural Development',
      amount: '$75,000 - $400,000',
      deadline: '2024-04-05',
      matchPercentage: 87,
      description: 'Addresses food insecurity and promotes sustainable food systems.',
      eligibility: ['Nonprofits', 'Food Banks', 'Agricultural Organizations'],
      status: 'Open'
    }
  ];

  // Filter matches based on search query and exclude successfully started applications
  const filteredMatches = allMockMatches.filter((match) => {
    // Check if this grant has been successfully applied to (exclude only successful ones)
    const alreadySuccessful = applications.some(
      app => app.id === match.id && app.status === 'success'
    );
    
    // Exclude grants that have already been successfully applied to
    // But allow failed applications to be retried (they will show in the list)
    if (alreadySuccessful) return false;
    
    // Apply search filter
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      match.title.toLowerCase().includes(searchLower) ||
      match.funder.toLowerCase().includes(searchLower) ||
      match.description.toLowerCase().includes(searchLower) ||
      match.eligibility.some(e => e.toLowerCase().includes(searchLower))
    );
  });

  // Get visible matches based on pagination
  const visibleMatches = filteredMatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMatches.length;

  // Handle loading more matches
  const handleLoadMore = () => {
    const previousCount = visibleCount;
    setVisibleCount(prev => prev + 3);
    
    // Scroll to the first new match after state updates
    setTimeout(() => {
      const firstNewMatchElement = document.querySelector(`[data-match-index="${previousCount}"]`);
      if (firstNewMatchElement) {
        firstNewMatchElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  // Handle starting an application
  const handleStartApplication = async (matchId: number, matchTitle: string, funder: string, amount: string) => {
    setProcessingId(matchId);
    
    // Simulate application process (70% success rate)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const isSuccess = Math.random() > 0.3;
    
    // Only add to context if successful
    if (isSuccess) {
      addApplication({
        id: matchId,
        grantTitle: matchTitle,
        funder,
        amount,
        status: 'success',
        timestamp: new Date()
      });
      
      // Add success message to the global stack (stays until user clicks X)
      addSuccessMessage({ id: matchId, grantTitle: matchTitle });
    } else {
      // For failed applications, just add temporarily to show the badge
      // It will be replaced on retry
      addApplication({
        id: matchId,
        grantTitle: matchTitle,
        funder,
        amount,
        status: 'failed',
        timestamp: new Date()
      });
    }
    
    setProcessingId(null);
  };

  // Get application status for a grant
  const getApplicationStatus = (matchId: number) => {
    return applications.find(app => app.id === matchId);
  };

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-surface-900">Grant Matches</h1>
        {applications.length > 0 && (
          <span className="text-sm text-surface-600">
            {applications.filter(a => a.status === 'success').length} applications started
          </span>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-5">
        <div className="bg-white rounded-xl shadow-md border border-surface-200 p-4">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search grants by keyword, funder, or program area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 bg-surface-50 border border-surface-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 transition-all duration-300 text-sm group-hover:bg-white"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-surface-400 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="group px-4 py-2.5 bg-gradient-civic text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm">
                <svg className="inline w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              
              <button className="px-4 py-2.5 border border-primary-200 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 text-sm">
                Sort by Match
              </button>
            </div>
          </div>
          
          {searchQuery && (
            <div className="mt-3 text-sm text-surface-600">
              Found {filteredMatches.length} {filteredMatches.length === 1 ? 'match' : 'matches'}
            </div>
          )}
        </div>
      </div>

      {/* Match Results */}
      <div className="space-y-4">
        {visibleMatches.map((match, index) => {
          const appStatus = getApplicationStatus(match.id);
          const isProcessing = processingId === match.id;
          
          return (
          <div 
            key={match.id} 
            data-match-index={index}
            className="group bg-white rounded-xl shadow-md border border-surface-200 hover:shadow-lg transition-all duration-300"
          >
            <div className="p-4">
              {/* Header with Match Score */}
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary-600 transition-colors duration-300">
                      {match.title}
                    </h3>
                    <div className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                      match.matchPercentage >= 90 ? 'bg-green-100 text-green-700' :
                      match.matchPercentage >= 80 ? 'bg-accent-100 text-accent-700' :
                      'bg-secondary-100 text-secondary-700'
                    }`}>
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {match.matchPercentage}%
                    </div>
                    
                    {appStatus && (
                      <div className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                        appStatus.status === 'success' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {appStatus.status === 'success' ? (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Started
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Failed
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-sm text-surface-600 mb-3 leading-relaxed">
                    {match.description}
                  </p>
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                    <div className="bg-surface-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-primary-100 rounded-lg">
                          <svg className="w-3.5 h-3.5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-surface-500">Funder</div>
                          <div className="text-sm text-surface-900 font-semibold">{match.funder}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-accent-100 rounded-lg">
                          <svg className="w-3.5 h-3.5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-surface-500">Award Range</div>
                          <div className="text-sm text-surface-900 font-semibold">{match.amount}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-50 rounded-lg p-2.5">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-secondary-100 rounded-lg">
                          <svg className="w-3.5 h-3.5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m0 0v6a1 1 0 01-1 1H9a1 1 0 01-1-1V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-xs font-medium text-surface-500">Deadline</div>
                          <div className="text-sm text-surface-900 font-semibold">{match.deadline}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {match.eligibility.map((tag) => (
                  <span key={tag} className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs font-semibold rounded-lg border border-primary-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-3 border-t border-surface-200">
                <button 
                  onClick={() => handleStartApplication(match.id, match.title, match.funder, match.amount)}
                  disabled={isProcessing || (appStatus?.status === 'success')}
                  className="group flex items-center px-4 py-2 bg-gradient-civic text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : appStatus ? (
                    appStatus.status === 'success' ? (
                      'Application Started'
                    ) : (
                      <>
                        <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retry Application
                      </>
                    )
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Application
                    </>
                  )}
                </button>
                
                <button className="flex items-center px-4 py-2 border border-primary-200 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 hover:border-primary-300 transition-all duration-300 text-sm">
                  <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save
                </button>
                
                <button className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all duration-300">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      {visibleMatches.length === 0 && (
        <div className="text-center py-12">
          <p className="text-surface-600">No grants found matching your search.</p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button 
            onClick={handleLoadMore}
            className="px-6 py-2 border border-primary-500 text-primary-600 font-semibold rounded-lg hover:bg-primary-50 transition-all duration-200 text-sm"
          >
            Load More Matches ({filteredMatches.length - visibleCount} more)
          </button>
        </div>
      )}
    </div>
  );
};