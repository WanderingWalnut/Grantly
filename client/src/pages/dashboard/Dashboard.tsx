export const Dashboard = () => {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-surface-900">Dashboard</h1>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {/* Stat Card 1 */}
        <div className="group bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 border border-primary-100/50 hover:-translate-y-1">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0 p-4 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-surface-900 civic-heading mb-1">12</div>
                <div className="text-sm font-medium text-surface-600">Available Grants</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success font-semibold">↗ +3</span>
              <span className="text-surface-500 ml-1">this week</span>
            </div>
          </div>
        </div>

        {/* Stat Card 2 */}
        <div className="group bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 border border-secondary-100/50 hover:-translate-y-1">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0 p-4 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-surface-900 civic-heading mb-1">4</div>
                <div className="text-sm font-medium text-surface-600">Active Applications</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-accent-600 font-semibold">2</span>
              <span className="text-surface-500 ml-1">under review</span>
            </div>
          </div>
        </div>

        {/* Stat Card 3 */}
        <div className="group bg-white/80 backdrop-blur-sm overflow-hidden shadow-xl rounded-2xl hover:shadow-2xl transition-all duration-300 border border-accent-100/50 hover:-translate-y-1">
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-shrink-0 p-4 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-surface-900 civic-heading mb-1">$125K</div>
                <div className="text-sm font-medium text-surface-600">Potential Funding</div>
              </div>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-success font-semibold">$45K</span>
              <span className="text-surface-500 ml-1">high probability</span>
            </div>
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
              <button className="text-sm text-primary-600 hover:text-primary-700 font-semibold">View All</button>
            </div>
            
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
              <button className="group inline-flex items-center px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
                <svg className="-ml-1 mr-3 h-6 w-6 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Start Your First Application
              </button>
            </div>
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

