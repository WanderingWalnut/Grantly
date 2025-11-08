import { useState } from 'react';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState<'organization' | 'preferences' | 'security'>('organization');
  
  // Mock data for organization profile
  const [organizationData, setOrganizationData] = useState({
    name: 'Community Care Initiative',
    ein: '12-3456789',
    email: 'contact@communitycare.org',
    phone: '(555) 123-4567',
    website: 'https://communitycare.org',
    address: '123 Main Street',
    city: 'Springfield',
    state: 'IL',
    zipCode: '62701',
    missionStatement: 'Dedicated to improving community health and wellness through innovative programs and partnerships.',
    focusAreas: ['Health & Wellness', 'Community Development', 'Youth Programs'],
    organizationType: 'nonprofit',
    yearEstablished: '2015',
    annualBudget: '$250,000 - $500,000'
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    grantAlerts: true,
    deadlineReminders: true,
    weeklyDigest: false,
    preferredGrantTypes: ['Community Development', 'Health & Human Services', 'Education'],
    minimumAmount: 10000,
    maximumAmount: 500000
  });

  const tabs = [
    { id: 'organization', name: 'Organization Info', icon: 'building' },
    { id: 'preferences', name: 'Preferences', icon: 'cog' },
    { id: 'security', name: 'Security', icon: 'shield' }
  ];

  const getTabIcon = (iconType: string) => {
    switch (iconType) {
      case 'building':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'cog':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-4 mb-3">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h1 className="text-4xl font-bold text-surface-900 civic-heading">
                Organization Settings
              </h1>
            </div>
            <p className="text-lg text-surface-600 civic-text max-w-2xl">
              Keep your organization information up to date for better grant matching
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-primary-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <svg className="w-6 h-6 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-2xl font-bold text-success">85%</div>
              </div>
              <div className="text-sm text-surface-600">Profile Complete</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-10">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-primary-100/50">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'organization' | 'preferences' | 'security')}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-civic text-white shadow-lg transform scale-105'
                    : 'text-surface-600 hover:text-primary-600 hover:bg-primary-50 hover:scale-105'
                }`}
              >
                <span className={`transition-transform duration-200 ${activeTab === tab.id ? 'scale-110' : ''}`}>
                  {getTabIcon(tab.icon)}
                </span>
                {tab.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Organization Info Tab */}
      {activeTab === 'organization' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-surface-900 civic-heading">Organization Information</h3>
              <p className="text-surface-600">Update your organization details to improve grant matching</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surface-700 mb-2">Organization Name</label>
              <input
                type="text"
                value={organizationData.name}
                onChange={(e) => setOrganizationData({...organizationData, name: e.target.value})}
                className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                placeholder="Enter organization name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surface-700 mb-2">EIN (Tax ID)</label>
              <input
                type="text"
                value={organizationData.ein}
                onChange={(e) => setOrganizationData({...organizationData, ein: e.target.value})}
                className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                placeholder="XX-XXXXXXX"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surface-700 mb-2">Email Address</label>
              <input
                type="email"
                value={organizationData.email}
                onChange={(e) => setOrganizationData({...organizationData, email: e.target.value})}
                className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                placeholder="contact@organization.org"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-bold text-surface-700 mb-2">Phone Number</label>
              <input
                type="tel"
                value={organizationData.phone}
                onChange={(e) => setOrganizationData({...organizationData, phone: e.target.value})}
                className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg"
                placeholder="(555) 123-4567"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <label className="block text-sm font-bold text-surface-700 mb-3">Mission Statement</label>
            <textarea
              rows={6}
              value={organizationData.missionStatement}
              onChange={(e) => setOrganizationData({...organizationData, missionStatement: e.target.value})}
              className="w-full px-6 py-4 bg-surface-50 border-2 border-surface-200 rounded-2xl focus:border-primary-500 focus:ring-4 focus:ring-primary-100 focus:bg-white transition-all duration-300 text-lg resize-none"
              placeholder="Describe your organization's mission and goals..."
            />
          </div>
          
          <div className="mt-10 flex justify-between items-center">
            <div className="text-sm text-surface-600">
              Last updated: <span className="font-semibold">Never</span>
            </div>
            <button className="group px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
              <svg className="-ml-1 mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-primary-100/50 p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-4 bg-gradient-to-br from-secondary-500 to-accent-500 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-surface-900 civic-heading">Notification Preferences</h3>
              <p className="text-surface-600">Customize how you receive updates and alerts</p>
            </div>
          </div>
          
          <div className="space-y-8">
            <div className="bg-surface-50 rounded-2xl p-6 hover:bg-white transition-colors duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary-100 rounded-xl">
                    <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-900 text-lg">Email Notifications</h4>
                    <p className="text-surface-600">Receive updates about your applications and important news</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.emailNotifications}
                    onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
                </label>
              </div>
            </div>
            
            <div className="bg-surface-50 rounded-2xl p-6 hover:bg-white transition-colors duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-accent-100 rounded-xl">
                    <svg className="w-6 h-6 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-900 text-lg">Grant Match Alerts</h4>
                    <p className="text-surface-600">Get notified instantly when we find perfect grants for you</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.grantAlerts}
                    onChange={(e) => setPreferences({...preferences, grantAlerts: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
                </label>
              </div>
            </div>
            
            <div className="bg-surface-50 rounded-2xl p-6 hover:bg-white transition-colors duration-300">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-secondary-100 rounded-xl">
                    <svg className="w-6 h-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-surface-900 text-lg">Deadline Reminders</h4>
                    <p className="text-surface-600">Never miss a deadline with smart reminder notifications</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preferences.deadlineReminders}
                    onChange={(e) => setPreferences({...preferences, deadlineReminders: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-surface-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-primary-500 peer-checked:to-secondary-500"></div>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex justify-between items-center">
            <div className="text-sm text-surface-600">
              Preferences saved automatically
            </div>
            <button className="group px-8 py-4 bg-gradient-civic text-white font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105">
              <svg className="-ml-1 mr-3 h-5 w-5 group-hover:rotate-180 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="bg-surface-50 rounded-civic-lg shadow-civic border border-secondary-100 p-6">
          <h3 className="text-lg font-bold text-surface-900 civic-heading mb-6">Security Settings</h3>
          
          <div className="space-y-6">
            <div className="border-b border-surface-200 pb-6">
              <h4 className="font-medium text-surface-900 mb-2">Change Password</h4>
              <p className="text-sm text-surface-600 mb-4">Update your password to keep your account secure</p>
              <button className="px-4 py-2 border-2 border-primary-500 text-primary-600 font-semibold rounded-civic hover:bg-primary-50 transition-all duration-200">
                Change Password
              </button>
            </div>
            
            <div className="border-b border-surface-200 pb-6">
              <h4 className="font-medium text-surface-900 mb-2">Two-Factor Authentication</h4>
              <p className="text-sm text-surface-600 mb-4">Add an extra layer of security to your account</p>
              <button className="px-4 py-2 bg-gradient-civic text-white font-semibold rounded-civic hover:shadow-civic-md transition-all duration-200">
                Enable 2FA
              </button>
            </div>
            
            <div>
              <h4 className="font-medium text-surface-900 mb-2">Account Deletion</h4>
              <p className="text-sm text-surface-600 mb-4">Permanently delete your account and all associated data</p>
              <button className="px-4 py-2 border-2 border-red-500 text-red-600 font-semibold rounded-civic hover:bg-red-50 transition-all duration-200">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};