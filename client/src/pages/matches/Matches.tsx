import { useState } from 'react';

export const Matches = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for grant matches
  const mockMatches = [
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
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-surface-900 civic-heading">
                Grant Matches
              </h1>
            </div>
            <p className="text-lg text-surface-600 civic-text max-w-2xl">
              Our AI has found grants specifically tailored to your organization's mission and needs
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-2xl font-bold text-primary-600">94%</div>
              </div>
              <div className="text-sm text-surface-600">Average Match Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-primary-100/50 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <input
                  type="text"
                  placeholder="Search grants by keyword, funder, or program area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-4 pl-14 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 transition-all duration-300 text-lg group-hover:bg-white"
                />
                <svg className="absolute left-5 top-1/2 transform -translate-y-1/2 w-6 h-6 text-surface-400 group-focus-within:text-primary-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="group px-6 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
                <svg className="inline w-5 h-5 mr-2 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                Filters
              </button>
              
              <button className="px-6 py-4 border-2 border-primary-200 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-300">
                Sort by Match
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Match Results */}
      <div className="space-y-8">
        {mockMatches.map((match) => (
          <div key={match.id} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
            <div className="p-8">
              {/* Header with Match Score */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-2xl font-bold text-surface-900 civic-heading group-hover:text-primary-600 transition-colors duration-300">
                      {match.title}
                    </h3>
                    <div className="relative">
                      <div className={`flex items-center px-4 py-2 rounded-2xl text-sm font-bold shadow-lg ${
                        match.matchPercentage >= 90 ? 'bg-gradient-to-r from-green-500 to-green-600 text-white' :
                        match.matchPercentage >= 80 ? 'bg-gradient-to-r from-accent-500 to-accent-600 text-white' :
                        'bg-gradient-to-r from-secondary-500 to-secondary-600 text-white'
                      }`}>
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        {match.matchPercentage}% Match
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-lg text-surface-600 civic-text mb-6 leading-relaxed">
                    {match.description}
                  </p>
                  
                  {/* Info Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-surface-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-100 rounded-xl">
                          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-500">Funder</div>
                          <div className="text-surface-900 font-bold">{match.funder}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-accent-100 rounded-xl">
                          <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-500">Award Range</div>
                          <div className="text-surface-900 font-bold">{match.amount}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-surface-50 rounded-2xl p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-secondary-100 rounded-xl">
                          <svg className="w-5 h-5 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m0 0v6a1 1 0 01-1 1H9a1 1 0 01-1-1V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-surface-500">Deadline</div>
                          <div className="text-surface-900 font-bold">{match.deadline}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eligibility Tags */}
              <div className="flex flex-wrap gap-3 mb-6">
                {match.eligibility.map((tag) => (
                  <span key={tag} className="px-4 py-2 bg-gradient-to-r from-primary-100 to-secondary-100 text-primary-700 text-sm font-semibold rounded-2xl border border-primary-200">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-surface-200">
                <button className="group flex-1 sm:flex-none px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <svg className="-ml-1 mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Start Application
                </button>
                
                <button className="flex-1 sm:flex-none px-8 py-4 border-2 border-primary-200 text-primary-600 font-bold rounded-2xl hover:bg-primary-50 hover:border-primary-300 transition-all duration-300">
                  <svg className="-ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Save for Later
                </button>
                
                <button className="p-4 text-surface-500 hover:text-primary-600 hover:bg-primary-50 rounded-2xl transition-all duration-300 hover:scale-105">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center mt-8">
        <button className="px-8 py-3 border-2 border-primary-500 text-primary-600 font-semibold rounded-civic hover:bg-primary-50 transition-all duration-200">
          Load More Matches
        </button>
      </div>
    </div>
  );
};